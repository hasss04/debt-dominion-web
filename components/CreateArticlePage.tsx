import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Article, Category } from '../services/types';
import { useAuth } from './AuthContext';
import { LinkIcon, Heading2Icon, Heading3Icon } from './icons';

const CATEGORIES: Category[] = ['Politics', 'Finance', 'Geopolitics', 'Technology', 'World'];

// A simple utility to generate a slug from a string
const generateSlug = (text: string) =>
    text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

interface CreateArticlePageProps {
    addArticle?: (article: Article) => Promise<void>;
    updateArticle?: (article: Article) => Promise<void>;
    articles?: Article[];
}

const CreateArticlePage: React.FC<CreateArticlePageProps> = ({ addArticle, updateArticle, articles }) => {
    const { slug: urlSlug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

    const isEditMode = !!urlSlug;
    
    const existingArticle = useMemo(() => 
        isEditMode ? articles?.find(a => a.slug === urlSlug) : undefined
    , [articles, isEditMode, urlSlug]);

    // Form State
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [body, setBody] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState<Category>('Finance');
    const [focusKeyPhrase, setFocusKeyPhrase] = useState('');
    const [slug, setSlug] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [authorName, setAuthorName] = useState('');
    const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');

    // Populate form when in edit mode or for new post
    useEffect(() => {
        if (isEditMode && existingArticle) {
            setTitle(existingArticle.title);
            setImageUrl(existingArticle.imageUrl);
            setBody(existingArticle.body);
            setExcerpt(existingArticle.excerpt);
            setCategory(existingArticle.category);
            setFocusKeyPhrase(existingArticle.focusKeyPhrase || '');
            setSlug(existingArticle.slug);
            setMetaDescription(existingArticle.metaDescription || '');
            setIsSlugManuallyEdited(true); // Slug should not auto-update in edit mode
            setAuthorName(existingArticle.author.name);
            setAuthorAvatarUrl(existingArticle.author.avatarUrl);
        } else if (!isEditMode && user) {
            // Pre-fill for new article
            setAuthorName(user.displayName || '');
            setAuthorAvatarUrl(user.photoURL || '');
        }
    }, [isEditMode, existingArticle, user]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isSlugManuallyEdited && title) {
            setSlug(generateSlug(title));
        }
    }, [title, isSlugManuallyEdited]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugManuallyEdited(true);
        setSlug(generateSlug(e.target.value)); // Still sanitize the manual input
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        // If the user changes the title and they haven't manually edited the slug, reset the manual edit flag
        // so the slug starts auto-updating again.
        if(isSlugManuallyEdited && slug === generateSlug(e.target.value.slice(0, -1))) {
            setIsSlugManuallyEdited(false);
        }
    }

    const insertText = (before: string, after: string = '') => {
        const textarea = bodyTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const newText = `${before}${selectedText}${after}`;
        
        const updatedValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        setBody(updatedValue);

        // Focus and adjust cursor position after update
        textarea.focus();
        setTimeout(() => {
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = end + before.length;
        }, 0);
    };

    const handleAddLink = () => {
        const url = prompt("Enter the URL:", "https://");
        if (url) {
            insertText(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title || !body || !excerpt || !category || !slug || !authorName) {
            alert("Please fill out all required fields.");
            return;
        }

        const newArticle: Article = {
            slug,
            title,
            excerpt,
            imageUrl: imageUrl || `https://picsum.photos/seed/${slug}/1200/800`,
            category,
            author: {
                name: authorName,
                avatarUrl: authorAvatarUrl || `https://picsum.photos/seed/${generateSlug(authorName)}/100/100`,
            },
            publishedDate: existingArticle?.publishedDate || new Date().toISOString(),
            body,
            focusKeyPhrase,
            metaDescription,
        };
        
        if (isEditMode && updateArticle) {
            await updateArticle(newArticle);
        } else if (addArticle) {
            await addArticle(newArticle);
        }
        navigate(`/article/${slug}`);
    };

    const isFormValid = title && body && excerpt && category && slug && authorName;

    const InputField = ({ id, label, value, onChange, required=false, placeholder='', disabled = false }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input id={id} type="text" value={value} onChange={onChange} required={required} placeholder={placeholder} disabled={disabled}
                   className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary disabled:cursor-not-allowed disabled:bg-slate-200 dark:disabled:bg-slate-800/50"/>
        </div>
    );

    const TextareaField = ({ id, label, value, onChange, required=false, rows=3, placeholder='' }) => (
         <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <textarea id={id} value={value} onChange={onChange} required={required} rows={rows} placeholder={placeholder}
                      className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"/>
        </div>
    );


    return (
        <form onSubmit={handleSubmit}>
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
                <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-brand-light">{isEditMode ? 'Edit Article' : 'Create New Article'}</h1>
                <button type="submit"
                        className="px-6 py-2 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                        disabled={!isFormValid}>
                    {isEditMode ? 'Update Article' : 'Publish Article'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
                        <InputField id="title" label="Article Title" value={title} onChange={handleTitleChange} required placeholder="Your Awesome Headline" />
                        <InputField id="imageUrl" label="Featured Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg"/>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Body</label>
                            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-t-md border-b border-slate-300 dark:border-slate-700">
                                <button type="button" onClick={() => insertText('<h2>', '</h2>')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Heading 2"><Heading2Icon className="w-5 h-5"/></button>
                                <button type="button" onClick={() => insertText('<h3>', '</h3>')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Heading 3"><Heading3Icon className="w-5 h-5"/></button>
                                <button type="button" onClick={handleAddLink} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Add Link"><LinkIcon className="w-5 h-5"/></button>
                            </div>
                            <textarea id="body" value={body} ref={bodyTextareaRef} onChange={(e) => setBody(e.target.value)} required rows={15}
                                      className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-b-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                                      placeholder="Write your article content here... You can use the tools above to format."/>
                        </div>
                        <TextareaField id="excerpt" label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={4} placeholder="A short, catchy summary of your article."/>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
                        <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-brand-light">SEO & Metadata</h2>
                        <InputField id="focusKeyPhrase" label="Focus Key Phrase" value={focusKeyPhrase} onChange={(e) => setFocusKeyPhrase(e.target.value)} placeholder="e.g., global economic trends" />
                        <InputField id="slug" label="Slug" value={slug} onChange={handleSlugChange} required placeholder="article-url-slug" disabled={isEditMode} />
                        <TextareaField id="metaDescription" label="Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="A brief description for search engine results."/>
                    </div>
                </div>

                {/* Sidebar column */}
                <aside className="lg:col-span-1 space-y-6">
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-brand-light border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Publish Settings</h2>
                        <div className="space-y-4">
                            <InputField id="authorName" label="Author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required placeholder="Author's name"/>
                            <InputField id="authorAvatarUrl" label="Author Avatar URL" value={authorAvatarUrl} onChange={(e) => setAuthorAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg"/>
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary">
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                     </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-brand-light mb-4">Featured Image Preview</h2>
                        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Featured image preview" className="w-full h-full object-cover rounded-md"/>
                            ) : (
                                <p className="text-slate-500 text-sm">Image preview will appear here</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
};

export default CreateArticlePage;