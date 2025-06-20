"use client";

import { getTrendingMovies, updateSearchCount } from "@/appwrite";
import MovieCard from "@/components/MovieCard";
import { Search } from "@/components/Search";
import Spinner from "@/components/Spinner";
import { Movie, SearchDocument } from "@/types/types";
import { useEffect, useState } from "react";
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;

if (!API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_TMDB_API_KEY');
}

const API_OPTIONS = {
  method: 'GET', 
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<SearchDocument[]>([])
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState<string>('')

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm] )

  const fetchMovies = async (query = ''): Promise<void> => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_popularity.desc`
      
      const response = await fetch(endpoint, API_OPTIONS)
      
      if(!response.ok) throw new Error("Failed to fetch movies");
      
      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'No movies found');
        setMovieList([])
        return
      }
      
      setMovieList(data.results || [])

      if (query && data.results.length > 0) await updateSearchCount(query, data.results[0])

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()

      setTrendingMovies(movies ?? [])
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      // setErrorMessage('Error fetching trending movies')
    }
  }

  useEffect(() => { 
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy Without the Hassle</h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isloading ? (
            <Spinner/>            
          ): errorMessage ? (
            <p className="text-shadow-indigo-500" >{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />                
              ))}
            </ul>
          )}

        </section>


      </div>
    </main>
  );
}