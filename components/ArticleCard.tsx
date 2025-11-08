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
    <article className="relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col group transition-transform duration-300 hover:-translate-y-0.5">
      <Link to={`/article/${article.slug}`} className="block">
        {/* Responsive media area with fixed aspect ratio */}
        <div className="w-full aspect-[16/9] bg-slate-200 dark:bg-slate-700">
          <img
            src={imageUrl}
            alt={article.title || 'Article image'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-primary">
            {article.category || 'World'}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-serif mb-2 text-slate-900 dark:text-brand-light">
          <Link
            to={`/article/${article.slug}`}
            className="hover:text-brand-primary transition-colors"
          >
            {article.title || 'Untitled Article'}
          </Link>
        </h3>

        <p className="text-slate-600 dark:text-brand-medium text-sm sm:text-[15px] leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 text-slate-500 dark:text-brand-medium text-xs">
          <img
            src={authorAvatar}
            alt={typeof authorName === 'string' ? authorName : 'Author'}
            className="w-8 h-8 rounded-full object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <span className="block truncate font-semibold text-slate-700 dark:text-slate-300">
              {typeof authorName === 'string' ? authorName : 'Author'}
            </span>
            <span className="block">{formattedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;