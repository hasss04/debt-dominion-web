import React, { useState } from 'react';
import type { Article, Category } from '../services/types';
import HeroCarousel from './HeroCarousel';
import ArticleCard from './ArticleCard';
import AboutSection from './AboutSection';
import TeamSection from './TeamSection';
import Newsletter from './Newsletter';

interface HomePageProps {
  articles: Article[];
}

const CATEGORIES: Category[] = ['Politics', 'Finance', 'Geopolitics', 'Technology', 'World'];

const HomePage: React.FC<HomePageProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const heroArticles = articles.length > 5 ? articles.slice(0, 5) : articles;
  const feedArticles = articles.length > 5 ? articles.slice(5) : articles;

  const filteredArticles =
    selectedCategory === 'All'
      ? feedArticles
      : feedArticles.filter(
          (article) =>
            article.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="space-y-12 sm:space-y-16">
      {heroArticles.length > 0 && <HeroCarousel articles={heroArticles} />}

      <section>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-6 sm:mb-8 border-b border-slate-300 dark:border-slate-700 pb-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-brand-light">
            Latest Articles
          </h2>

          {/* Horizontal, scrollable category chips on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1"
               aria-label="Filter by category">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 dark:text-brand-medium">
            <p className="text-base sm:text-lg">No articles found in this category.</p>
          </div>
        )}
      </section>

      <TeamSection />
      <Newsletter />
      <AboutSection />
    </div>
  );
};

export default HomePage;