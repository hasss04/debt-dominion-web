import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Article, Category } from '../services/types';
import { useAuth } from './AuthContext';

const CATEGORIES: Category[] = ['Politics', 'Finance', 'Geopolitics', 'Technology', 'World'];

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

// --- Move these outside the main component and memoize them ---
type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const InputField: React.FC<InputFieldProps> = React.memo(
  ({ id, label, value, onChange, required = false, placeholder = '', disabled = false }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary disabled:cursor-not-allowed disabled:bg-slate-200 dark:disabled:bg-slate-800/50"
      />
    </div>
  )
);

type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
};

const TextareaField: React.FC<TextareaFieldProps> = React.memo(
  ({ id, label, value, onChange, required = false, rows = 3, placeholder = '' }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
  )
);
// --- end moved subcomponents ---


interface CreateArticlePageProps {
  addArticle?: (article: Article) => Promise<void>;
  updateArticle?: (article: Article) => Promise<void>;
  articles?: Article[];
}

const CreateArticlePage: React.FC<CreateArticlePageProps> = ({ addArticle, updateArticle, articles }) => {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEditMode = !!urlSlug;
  const existingArticle = useMemo(
    () => (isEditMode ? articles?.find((a) => a.slug === urlSlug) : undefined),
    [articles, isEditMode, urlSlug]
  );

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

  const editorRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);

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
      setIsSlugManuallyEdited(true);
      setAuthorName(existingArticle.author.name);
      setAuthorAvatarUrl(existingArticle.author.avatarUrl);
    } else if (!isEditMode && user) {
      setAuthorName(user.displayName || '');
      setAuthorAvatarUrl(user.photoURL || '');
    }
  }, [isEditMode, existingArticle, user]);

  useEffect(() => {
    if (editorRef.current && isInitialMount.current && body) {
      editorRef.current.innerHTML = body;
      isInitialMount.current = false;
    }
  }, [body]);

  useEffect(() => {
    if (!isSlugManuallyEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugManuallyEdited]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(e.target.value));
  };

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreCursorPosition = (range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setBody(editorRef.current.innerHTML);
    }
  };

  // FIXED handleCommand to prevent title input losing focus
  const handleCommand = (cmd: string, value?: string) => {
    const range = saveCursorPosition();
    if (editorRef.current) editorRef.current.focus();

    document.execCommand(cmd, false, value);

    requestAnimationFrame(() => {
      if (editorRef.current) {
        setBody(editorRef.current.innerHTML);
        restoreCursorPosition(range);
      }
    });
  };

  const handleLinkCreation = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';

    const linkText = prompt('Text to Display:', selectedText || '');
    if (linkText === null || linkText.trim() === '') return;

    const url = prompt('URL:', 'https://');
    if (!url || url === 'https://') return;

    editorRef.current?.focus();

    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;

    if (selectedText) {
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('insertHTML', false, linkHtml + '&nbsp;');
    }

    setTimeout(() => {
      if (editorRef.current) {
        setBody(editorRef.current.innerHTML);
      }
    }, 0);
  };

  // Keep this if you want to ensure the editor doesn't steal focus while typing in inputs.
  useEffect(() => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      editorRef.current?.blur();
    }
  }, [body]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !body || !excerpt || !category || !slug || !authorName) {
      alert('Please fill out all required fields.');
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
        avatarUrl:
          authorAvatarUrl ||
          `https://picsum.photos/seed/${generateSlug(authorName)}/100/100`,
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-brand-light">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <button
          type="submit"
          className="px-6 py-2 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
          disabled={!isFormValid}
        >
          {isEditMode ? 'Update Article' : 'Publish Article'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
            <InputField
              id="title"
              label="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Your Awesome Headline"
            />
            <InputField
              id="imageUrl"
              label="Featured Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Body
              </label>

              <div className="flex items-center gap-2 mb-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-t-md border-b border-slate-300 dark:border-slate-700 flex-wrap">
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('bold')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-bold" title="Bold">B</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('italic')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 italic" title="Italic">I</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('underline')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 underline" title="Underline">U</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('insertUnorderedList')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Bullet List">• List</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('formatBlock', 'h2')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Heading 2">H2</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('formatBlock', 'h3')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Heading 3">H3</button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={handleLinkCreation} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center" title="Insert Link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/>
                  </svg>
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('removeFormat')} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center" title="Clear Formatting">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14"/>
                    <path d="M14 3h6"/>
                    <path d="M10 7h8"/>
                    <line x1="2" y1="21" x2="22" y2="21"/>
                  </svg>
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="w-full min-h-[400px] bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-b-md p-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary prose dark:prose-invert max-w-none"
              />

              <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-brand-light mb-2">Live Preview</h3>
                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            </div>

            <TextareaField
              id="excerpt"
              label="Excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              rows={4}
              placeholder="A short, catchy summary of your article."
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-brand-light">
              SEO & Metadata
            </h2>
            <InputField
              id="focusKeyPhrase"
              label="Focus Key Phrase"
              value={focusKeyPhrase}
              onChange={(e) => setFocusKeyPhrase(e.target.value)}
              placeholder="e.g., global economic trends"
            />
            <InputField
              id="slug"
              label="Slug"
              value={slug}
              onChange={handleSlugChange}
              required
              placeholder="article-url-slug"
              disabled={isEditMode}
            />
            <TextareaField
              id="metaDescription"
              label="Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              placeholder="A brief description for search engine results."
            />
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-brand-light border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              Publish Settings
            </h2>
            <div className="space-y-4">
              <InputField
                id="authorName"
                label="Author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                placeholder="Author's name"
              />
              <InputField
                id="authorAvatarUrl"
                label="Author Avatar URL"
                value={authorAvatarUrl}
                onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold font-serif text-slate-800 dark:text-brand-light mb-4">
              Featured Image Preview
            </h2>
            <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Featured image preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <p className="text-slate-500 text-sm">
                  Image preview will appear here
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
};

export default CreateArticlePage;