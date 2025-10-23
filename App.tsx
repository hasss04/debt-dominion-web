import React, { useState, useEffect, useCallback } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { rtdb } from "./services/firebase";
import { AuthProvider, useAuth } from "./components/AuthContext";
import type { Article } from "./services/types";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ArticlePage from "./components/ArticlePage";
import CreateArticlePage from "./components/CreateArticlePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
import Spinner from "./components/Spinner";
import ContactPage from "./components/ContactPage";
import SearchPage from "./components/SearchPage";
import DashboardPage from "./components/DashboardPage";

const App: React.FC = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

const MainApp: React.FC = () => {
  const { theme, protectedRoute, adminProtectedRoute } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply theme globally
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
  }, [theme]);

  // Fetch articles from Firebase Realtime Database
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await get(ref(rtdb, "articles"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const validCategories = ["Politics", "Finance", "Geopolitics", "Technology", "World"];

        const fetchedArticles: Article[] = Object.values(data).map((item: any) => {
          const category = validCategories.includes(item.category) ? item.category : "World";
          return {
            slug:
              item.slug ||
              item.id ||
              item.title?.toLowerCase().replace(/\s+/g, "-") ||
              Math.random().toString(36).substring(2, 9),
            title: item.title || "Untitled Article",
            excerpt: item.excerpt || "",
            imageUrl:
              item.imageUrl ||
              item.imageURL ||
              item.image ||
              `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
            category,
            author: {
              name: typeof item.author === "string" ? item.author : item.author?.name || "Unknown Author",
              avatarUrl:
                item.authorImageUrl ||
                item.author?.avatarUrl ||
                "https://picsum.photos/seed/default/100/100",
            },
            publishedDate: item.publishedDate || new Date().toISOString(),
            body: item.body || "<p>No content available.</p>",
            focusKeyPhrase: item.focusKeywords || "",
            metaDescription: item.metaDescription || "",
          };
        });

        const sorted = fetchedArticles.sort(
          (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        );

        setArticles(sorted);
        localStorage.setItem("articles", JSON.stringify(sorted));
      } else {
        setArticles([]);
      }
    } catch {
      setError("Failed to load articles from Firebase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Add new article
  const handleAddArticle = async (newArticle: Article) => {
    const newArticles = [newArticle, ...articles];
    setArticles(newArticles);
    localStorage.setItem("articles", JSON.stringify(newArticles));
  };

  // Update article
  const handleUpdateArticle = async (updatedArticle: Article) => {
    const newArticles = articles.map((article) =>
      article.slug === updatedArticle.slug ? updatedArticle : article
    );
    setArticles(newArticles);
    localStorage.setItem("articles", JSON.stringify(newArticles));
  };

  // Delete article
  const handleDeleteArticle = async (slug: string) => {
    const newArticles = articles.filter((article) => article.slug !== slug);
    setArticles(newArticles);
    localStorage.setItem("articles", JSON.stringify(newArticles));
  };

  // Protected routes
  const CreateArticleProtectedRoute = adminProtectedRoute(CreateArticlePage);
  const ProfileProtectedRoute = protectedRoute(ProfilePage);
  const DashboardProtectedRoute = adminProtectedRoute(DashboardPage);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-secondary text-slate-800 dark:text-brand-light font-sans">
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
                className="mt-4 px-4 py-2 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
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
                element={<ArticlePage articles={articles} deleteArticle={handleDeleteArticle} />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfileProtectedRoute />} />
              <Route path="/dashboard" element={<DashboardProtectedRoute />} />
              <Route
                path="/create"
                element={<CreateArticleProtectedRoute addArticle={handleAddArticle} />}
              />
              <Route
                path="/edit/:slug"
                element={
                  <CreateArticleProtectedRoute
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
      </div>
    </HashRouter>
  );
};

export default App;