export type Category = 'Politics' | 'Finance' | 'Geopolitics' | 'Technology' | 'World';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: Category;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishedDate: string; // ISO string format
  body: string; // HTML content
  focusKeyPhrase?: string;
  metaDescription?: string;
}

export type Theme = 'light' | 'dark';

export type Role = 'admin' | 'member' | 'subscriber';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
}
