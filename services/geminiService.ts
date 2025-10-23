import { ref, get, set, push, update, remove } from "firebase/database";
import { rtdb } from "./firebase";
import type { Article } from "./types";

/**
 * Fetch all articles from Firebase.
 */
export async function getArticles(): Promise<Article[]> {
  try {
    const snapshot = await get(ref(rtdb, "articles"));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const articles = Object.entries(data).map(([id, value]: any) => ({
      id,
      ...value,
    })) as Article[];

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

/**
 * Add a new article.
 */
export async function addArticle(article: Article): Promise<string> {
  try {
    const newArticleRef = push(ref(rtdb, "articles"));
    await set(newArticleRef, article);
    return newArticleRef.key as string;
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
}

/**
 * Update an existing article.
 */
export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  try {
    await update(ref(rtdb, `articles/${id}`), data);
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

/**
 * Delete an article.
 */
export async function deleteArticle(id: string): Promise<void> {
  try {
    await remove(ref(rtdb, `articles/${id}`));
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

/**
 * generateArticles()
 * ✅ Replaces old Gemini AI function
 * Checks Firebase; if empty, seeds with sample articles
 * Returns all articles (used by App.tsx)
 */
export async function generateArticles(): Promise<Article[]> {
  try {
    const existingArticles = await getArticles();

    if (existingArticles.length > 0) {
      console.log("Articles already exist in Firebase.");
      return existingArticles;
    }

    console.log("No articles found, seeding sample data...");

    const sampleArticles: Article[] = [
      {
        slug: "finance-trends-2025",
        title: "Finance Trends 2025: Global Shifts to Watch",
        excerpt: "An overview of how financial systems are evolving in the face of global inflation and digital disruption.",
        imageUrl: "https://picsum.photos/1200/800",
        category: "Finance",
        author: { name: "Jane Doe", avatarUrl: "https://picsum.photos/100/100" },
        publishedDate: new Date().toISOString(),
        body: "<h2>Introduction</h2><p>As we move into 2025, markets continue adapting...</p>"
      },
      {
        slug: "tech-frontiers-ai",
        title: "AI and the Next Frontier: How Automation Is Redefining Work",
        excerpt: "Exploring how artificial intelligence continues to reshape industries and the human workforce.",
        imageUrl: "https://picsum.photos/1200/800",
        category: "Technology",
        author: { name: "John Smith", avatarUrl: "https://picsum.photos/100/100" },
        publishedDate: new Date().toISOString(),
        body: "<h2>AI at Scale</h2><p>From creative industries to manufacturing, AI...</p>"
      },
    ];

    // Seed the sample data
    for (const article of sampleArticles) {
      await addArticle(article);
    }

    console.log("Firebase seeded with sample articles.");
    return await getArticles();
  } catch (error) {
    console.error(" Error in generateArticles():", error);
    throw error;
  }
}
