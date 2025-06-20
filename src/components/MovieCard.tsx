import React from "react";

export default function MovieCard({movie}){
  return(
    <p key={movie.id} className="text-white">{movie.title} </p>
  )
}