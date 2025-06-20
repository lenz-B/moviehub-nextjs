import { Models } from 'appwrite';

// Data - TMDB API
export type Movie = {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  release_date: string;
  original_language: string;
};

// Document - Appwrite
export interface SearchDocument extends Models.Document {
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
}
