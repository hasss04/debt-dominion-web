import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import type { Article } from "../services/types";

interface Props {
  article: Article;
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link to={`/article/${article.slug}`}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-semibold mb-3 w-fit">
          {article.category}
        </span>

        {/* Title */}
        <Link to={`/article/${article.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t dark:border-slate-700 pt-4">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatarUrl}
              alt={article.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-medium">{article.author.name}</span>
          </div>
          <span>{formattedDate}</span>
        </div>

        {/* Read More + AI Button */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/article/${article.slug}`}
            className="flex-1 px-4 py-2 bg-orange-500 text-white text-center rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
