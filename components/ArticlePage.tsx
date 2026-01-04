import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AudioReader from "./AudioReader";
import type { Article } from "../services/types";

interface Props {
  articles: Article[];
  deleteArticle: (slug: string) => Promise<void>;
}

const ArticlePage: React.FC<Props> = ({ articles, deleteArticle }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Article Not Found</h2>
        <Link to="/" className="text-orange-500 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  const handleDelete = async () => {
    await deleteArticle(article.slug);
    navigate("/");
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/"
        className="inline-block mb-6 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
      >
        ← Back to all articles
      </Link>

      {/* Hero Image */}
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl mb-6 shadow-lg"
      />

      {/* Category Badge */}
      <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
        {article.category}
      </span>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">
        {article.title}
      </h1>

      {/* Author & Date */}
      <div className="flex items-center gap-3 mb-8 text-slate-600 dark:text-slate-400">
        <img
          src={article.author.avatarUrl}
          alt={article.author.name}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-medium">{article.author.name}</span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>

      {/* Admin controls */}
      {user?.role === "admin" && (
        <div className="flex gap-3 mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Link
            to={`/edit/${article.slug}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Confirm delete */}
      {showConfirm && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200 font-semibold mb-3">
            Confirm deletion
          </p>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ✅ STICKY AUDIO PLAYER - Stays at top while scrolling */}
      <AudioReader />

      {/* Article Body */}
      <div
        id="article-content"
        className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-p:text-slate-700 dark:prose-p:text-slate-300
          prose-a:text-orange-600 dark:prose-a:text-orange-400
          prose-strong:text-slate-900 dark:prose-strong:text-white
          prose-code:text-orange-600 dark:prose-code:text-orange-400
          prose-img:rounded-xl prose-img:shadow-lg
          prose-li:text-slate-700 dark:prose-li:text-slate-300
          prose-blockquote:border-l-orange-500 dark:prose-blockquote:border-l-orange-400
          prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />
    </article>
  );
};

export default ArticlePage;