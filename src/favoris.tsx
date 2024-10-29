import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const Favoris: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavoriteMovies(JSON.parse(storedFavorites));
    }
  }, []);

  const removeFavorite = (movieId: number) => {
    const updatedFavorites = favoriteMovies.filter(
      (movie) => movie.id !== movieId
    );
    setFavoriteMovies(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success("Film retiré des favoris !");
  };

  return (
    <div className="favoris_container">
      <h2>Mes Films Favoris</h2>
      <ToastContainer />

      {favoriteMovies.length === 0 ? (
        <p>Aucun film dans vos favoris.</p>
      ) : (
        <ul className="favoris_list">
          {favoriteMovies.map((movie) => (
            <li key={movie.id} className="favoris_item">
              <div className="favoris_movie">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="favoris_movie-poster"
                />
                <div className="favoris_movie-details">
                  <h3>{movie.title}</h3>
                  <p>Date de sortie : {movie.release_date}</p>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(movie.id)}
                  >
                    Retirer des Favoris
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favoris;
