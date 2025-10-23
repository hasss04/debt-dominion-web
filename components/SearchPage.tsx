
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Article } from '../services/types';
import ArticleCard from './ArticleCard';
import { SearchIcon } from './icons';

interface SearchPageProps {
    articles: Article[];
}

const SearchPage: React.FC<SearchPageProps> = ({ articles }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const searchResults = useMemo(() => {
        if (!query.trim()) {
            return [];
        }
        const lowercasedQuery = query.toLowerCase();
        return articles.filter(article =>
            article.title.toLowerCase().includes(lowercasedQuery)
        );
    }, [articles, query]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="pb-8 border-b border-slate-300 dark:border-slate-700">
                <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-brand-light">
                    Search Results
                </h1>
                {query ? (
                    <p className="mt-2 text-slate-600 dark:text-brand-medium">
                        Showing {searchResults.length} results for: <span className="font-semibold text-slate-800 dark:text-slate-200">"{query}"</span>
                    </p>
                ) : (
                    <p className="mt-2 text-slate-600 dark:text-brand-medium">
                        Please enter a search term in the header to find articles.
                    </p>
                )}
            </div>

            <div className="mt-8">
                {query && searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {searchResults.map(article => (
                            <ArticleCard key={article.slug} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500 dark:text-brand-medium">
                         <div className="flex justify-center mb-4">
                            <SearchIcon className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">
                            {query ? 'No Articles Found' : 'Start Your Search'}
                        </h2>
                        <p className="max-w-md mx-auto">
                            {query 
                                ? "We couldn't find any articles matching your search. Try using different keywords."
                                : "Use the search bar in the navigation to find articles by title, excerpt, or content."}
                        </p>
                        <Link 
                            to="/"
                            className="mt-6 inline-block px-6 py-2 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;