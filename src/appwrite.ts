import { Client, Databases, ID, Query, Models } from 'appwrite';

// Environment variables
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

if (!PROJECT_ID || !DATABASE_ID || !COLLECTION_ID) {
  throw new Error('Missing Appwrite env vars');
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

// ✅ Movie type
type Movie = {
  id: number;
  poster_path: string | null;
};

// ✅ SearchDocument type (optional, to type listDocuments result)
interface SearchDocument extends Models.Document {
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
}

// ✅ Update search count
export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
  try {
    const result = await database.listDocuments<SearchDocument>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('searchTerm', searchTerm)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument<SearchDocument>(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        {
          count: doc.count + 1,
        }
      );
    } else {
      await database.createDocument<SearchDocument>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

// Get trending movies
export const getTrendingMovies = async (): Promise<SearchDocument[] | undefined> => {
  try {
    const result = await database.listDocuments<SearchDocument>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(5), Query.orderDesc('count')]
    );
    return result.documents;
  } catch (error) {
    console.error(error);
  }
};
