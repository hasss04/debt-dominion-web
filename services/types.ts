export interface Author {
  name: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  imageUrl: string;
  publishedDate: string;
  author: Author;
}
