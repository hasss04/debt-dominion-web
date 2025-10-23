
import React, { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import type { Article } from '../services/types';
import { useAuth } from './AuthContext';
import { TrashIcon, EditIcon } from './icons';

interface ArticlePageProps {
    articles: Article[];
    deleteArticle: (slug: string) => Promise<void>;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ articles, deleteArticle }) => {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const article = articles.find(a => a.slug === slug);

    const handleDelete = async () => {
        if (article) {
            await deleteArticle(article.slug);
            navigate('/'); // Redirect to home after deletion
        }
        setShowConfirmModal(false);
    };


    if (!article) {
        return <Navigate to="/" replace />;
    }

    const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div>
            <article className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <Link to="/" className="text-brand-primary hover:underline mb-4 inline-block">&larr; Back to all articles</Link>
                    <div className="text-sm font-medium text-brand-primary mb-2">{article.category.toUpperCase()}</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-slate-900 dark:text-brand-light leading-tight mb-4">
                        {article.title}
                    </h1>
                    <div className="flex items-center text-slate-500 dark:text-brand-medium text-sm">
                        <img src={article.author.avatarUrl} alt={article.author.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <span>By {article.author.name}</span>
                            <span className="mx-2">&bull;</span>
                            <time dateTime={article.publishedDate}>{formattedDate}</time>
                        </div>
                    </div>
                </header>

                <figure className="mb-8">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </figure>
                
                <div 
                    className="prose dark:prose-invert prose-lg max-w-none prose-h2:font-serif prose-h2:text-3xl prose-h3:font-serif prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-a:text-brand-primary hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: article.body }} 
                />
            </article>

            {user && user.role === 'admin' && (
                <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-end gap-4">
                    <Link
                        to={`/edit/${article.slug}`}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white font-bold rounded-md hover:bg-slate-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-slate-500"
                        aria-label="Edit article"
                    >
                        <EditIcon className="w-5 h-5" />
                        <span>Edit Article</span>
                    </Link>
                    <button
                        onClick={() => setShowConfirmModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-red-500"
                        aria-label="Delete article"
                    >
                        <TrashIcon className="w-5 h-5" />
                        <span>Delete Article</span>
                    </button>
                </div>
            )}

            {showConfirmModal && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-confirm-title"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 id="delete-confirm-title" className="text-lg font-bold font-serif text-slate-900 dark:text-white">Confirm Deletion</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete this article? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticlePage;
