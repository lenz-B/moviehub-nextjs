"use client";

import MovieCard from "@/components/movieCard";
import Search from "@/components/Search";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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
  const [movieList, setMovieList] = useState<any[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);

  const fetchMovies = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      
      if(!response.ok) throw new Error("Failed to fetch movies");
      
      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'No movies found');
        setMovieList([])
        return
      }
      
      setMovieList(data.results || [])      
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { 
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy Without the Hassle</h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
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