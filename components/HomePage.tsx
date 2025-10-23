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

  // Show all articles if fewer than 5
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
    <div className="space-y-16">
      {heroArticles.length > 0 && <HeroCarousel articles={heroArticles} />}

      <section>
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-slate-300 dark:border-slate-700 pb-4">
          <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-brand-light mb-4 md:mb-0">
            Latest Articles
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 dark:text-brand-medium">
            <p className="text-lg">No articles found in this category.</p>
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