"use client";

import { useState, useEffect, useCallback } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { rtdb } from "./services/firebase";
import { AuthProvider, useAuth } from "./components/AuthContext";
import type { Article } from "./services/types";

/* Layout */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* Pages */
import HomePage from "./components/HomePage";
import ArticlePage from "./components/ArticlePage";
import CreateArticlePage from "./components/CreateArticlePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
import ContactPage from "./components/ContactPage";
import SearchPage from "./components/SearchPage";
import DashboardPage from "./components/DashboardPage";

/* UI */
import Spinner from "./components/Spinner";
import ChatbotUI from "./components/Chatbot"; // ✅ Keep your chatbot

/* ================= ROOT APP ================= */

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

/* ================= MAIN APP ================= */

function MainApp() {
  const { theme, protectedRoute, adminProtectedRoute } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Apply theme */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
  }, [theme]);

  /* Fetch articles from Firebase RTDB */
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const snapshot = await get(ref(rtdb, "articles"));

      if (!snapshot.exists()) {
        setArticles([]);
        setIsLoading(false);
        return;
      }

      const data = snapshot.val();
      const validCategories = [
        "Politics",
        "Finance",
        "Geopolitics",
        "Technology",
        "World",
      ];

      const fetchedArticles: Article[] = Object.entries(data).map(
        ([id, item]: any) => {
          const category = validCategories.includes(item.category)
            ? item.category
            : "World";

          return {
            id,
            slug:
              item.slug ||
              id ||
              item.title?.toLowerCase().replace(/\s+/g, "-") ||
              Math.random().toString(36).slice(2, 9),

            title: item.title || item.excerpt || "Untitled Article",
            excerpt: item.excerpt || "",
            body:
              item.body ||
              (item.content ? `<p>${item.content}</p>` : "<p>No content available.</p>"),

            imageUrl:
              item.imageUrl ||
              item.imageURL ||
              item.image ||
              `https://picsum.photos/1200/600?random=${id}`,

            category,

            author: {
              name:
                typeof item.author === "string"
                  ? item.author
                  : item.author?.name || "Unknown Author",
              avatarUrl:
                item.authorImageUrl ||
                item.author?.avatarUrl ||
                "https://picsum.photos/seed/default/100/100",
            },

            publishedDate: item.publishedDate || new Date().toISOString(),
          };
        }
      );

      fetchedArticles.sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
      );

      setArticles(fetchedArticles);
      localStorage.setItem("articles", JSON.stringify(fetchedArticles));
    } catch (err) {
      console.error(err);
      setError("Failed to load articles from Firebase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  /* Article CRUD (local state only) */
  const handleAddArticle = async (article: Article) => {
    const updated = [article, ...articles];
    setArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));
  };

  const handleUpdateArticle = async (updatedArticle: Article) => {
    const updated = articles.map((a) =>
      a.slug === updatedArticle.slug ? updatedArticle : a
    );
    setArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));
  };

  const handleDeleteArticle = async (slug: string) => {
    const updated = articles.filter((a) => a.slug !== slug);
    setArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));
  };

  /* Protected routes */
  const CreateArticleProtected = adminProtectedRoute(CreateArticlePage);
  const ProfileProtected = protectedRoute(ProfilePage);
  const DashboardProtected = adminProtectedRoute(DashboardPage);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-secondary text-slate-800 dark:text-brand-light">
        <Header />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">An Error Occurred</h2>
              <p>{error}</p>
              <button
                onClick={fetchArticles}
                className="mt-4 px-4 py-2 bg-brand-primary text-white font-bold rounded-md"
              >
                Retry
              </button>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage articles={articles} />} />
              <Route path="/search" element={<SearchPage articles={articles} />} />
              <Route
                path="/article/:slug"
                element={
                  <ArticlePage
                    articles={articles}
                    deleteArticle={handleDeleteArticle}
                  />
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfileProtected />} />
              <Route path="/dashboard" element={<DashboardProtected />} />
              <Route
                path="/create"
                element={<CreateArticleProtected addArticle={handleAddArticle} />}
              />
              <Route
                path="/edit/:slug"
                element={
                  <CreateArticleProtected
                    articles={articles}
                    updateArticle={handleUpdateArticle}
                  />
                }
              />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>

        <Footer />
        <ChatbotUI />
      </div>
    </HashRouter>
  );
}

export default App;
