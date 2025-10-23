import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../services/types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const imageUrl =
    article.imageUrl ||
    `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;

  // Safely normalize author info
  const authorName =
    typeof article.author === 'string'
      ? article.author
      : article.author?.name || 'Unknown Author';

  const authorAvatar =
    typeof article.author === 'object' && article.author?.avatarUrl
      ? article.author.avatarUrl
      : 'https://picsum.photos/seed/default/100/100';

  const excerpt =
    article.excerpt && article.excerpt.trim().length > 0
      ? article.excerpt
      : article.metaDescription || 'Read the full story below.';

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg flex flex-col group transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/article/${article.slug}`} className="block">
        <img
          src={imageUrl}
          alt={article.title || 'Article image'}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            {article.category || 'World'}
          </span>
        </div>

        <h3 className="text-xl font-bold font-serif mb-2 text-slate-900 dark:text-brand-light flex-grow">
          <Link
            to={`/article/${article.slug}`}
            className="hover:text-brand-primary transition-colors"
          >
            {article.title || 'Untitled Article'}
          </Link>
        </h3>

        <p className="text-slate-600 dark:text-brand-medium text-sm mb-4">
          {excerpt}
        </p>

        <div className="flex items-center text-slate-500 dark:text-brand-medium text-xs mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
          <img
            src={authorAvatar}
            alt={typeof authorName === 'string' ? authorName : 'Author'}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {typeof authorName === 'string' ? authorName : 'Author'}
            </span>
            <span className="block">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;