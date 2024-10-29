import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );
  const navigate = useNavigate();
  const apiKey = "2a731016844b36270db74a2584bd768a";

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results.slice(0, 20));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des films :", error);
      });
  }, [loggedInUser, navigate]);

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="home-page">
      <h2 className="welcome-title">Bienvenue, {loggedInUser.username}!</h2>
      <p className="movie-list-description">Films en avant-première :</p>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-overlay">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-release-date">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
