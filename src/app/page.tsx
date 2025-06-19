"use client";

import Search from "@/components/search";
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

  const fetchMovies = async () => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)

      if(!response.ok) throw new Error("Failed to fetch movies");
      
      const data = await response.json();

      console.log(data);
      
      
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
  }

  useEffect(() => {
    console.log('asdasdf',API_KEY);
    
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
          <h2>All Movies</h2>

          {errorMessage && <p className="error-message" >{errorMessage}</p> }
        </section>


      </div>
    </main>
  );
}