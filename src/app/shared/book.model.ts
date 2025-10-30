export interface Book {
  isbn: string;
  title: string;
  subtitle?: string;
  authors: string[];
  imageUrl: string;
  description: string;
  createdAt: string;
}
