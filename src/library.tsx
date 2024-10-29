import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface Category {
  name: string;
  movies: Movie[];
}

const Library: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Barre de recherche
  const [selectedGenre, setSelectedGenre] = useState<string>(""); // Filtre par genre
  const [selectedYear, setSelectedYear] = useState<string>(""); // Filtre par année
  const apiKey = "2a731016844b36270db74a2584bd768a";

  useEffect(() => {
    const fetchMoviesByCategory = async () => {
      try {
        const categoriesList = [
          { name: "Action", id: 28 },
          { name: "Aventure", id: 12 },
          { name: "Comédie", id: 35 },
          { name: "Drame", id: 18 },
          { name: "Horreur", id: 27 },
          { name: "Science-fiction", id: 878 },
        ];

        const moviesPromises = categoriesList.map(async (category) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${category.id}&language=fr-FR`
          );
          const data = await response.json();
          return { name: category.name, movies: data.results.slice(0, 10) };
        });

        const categoriesWithMovies = await Promise.all(moviesPromises);
        setCategories(categoriesWithMovies);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des catégories de films :",
          error
        );
      }
    };

    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };

    fetchMoviesByCategory();
    loadFavorites();
  }, []);

  const fetchMovieTrailers = async (movieId: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=fr-FR`
      );
      const data = await response.json();
      const trailers = data.results.filter(
        (video: { type: string }) => video.type === "Trailer"
      );

      if (trailers.length > 0) {
        const randomTrailer =
          trailers[Math.floor(Math.random() * trailers.length)];
        setTrailerUrl(`https://www.youtube.com/embed/${randomTrailer.key}`);
      } else {
        setTrailerUrl(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bandes-annonces :",
        error
      );
      setTrailerUrl(null);
    }
  };

  const openMovieModal = async (movie: Movie) => {
    setSelectedMovie(movie);
    await fetchMovieTrailers(movie.id);
  };

  const closeMovieModal = () => {
    setSelectedMovie(null);
    setTrailerUrl(null);
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast.success("Le film à bien été retirer des favoris !", {
        position: "top-right",
      });
    } else {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast.success("Le film à bien été ajouté au favoris !", {
        position: "top-right",
      });
    }
  };

  const isFavorite = (movie: Movie) => {
    return favorites.some((fav) => fav.id === movie.id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const filteredMovies = (movies: Movie[]) => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "" ||
        (Array.isArray(movie.genres) &&
          movie.genres.some((genre) => genre.name === selectedGenre));
      const matchesYear =
        selectedYear === "" || movie.release_date.startsWith(selectedYear);

      return matchesSearch && matchesGenre && matchesYear;
    });
  };

  return (
    <div className="library-page">
      <h2 className="library-title">Ma Bibliothèque de Films</h2>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />

        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="filter-select"
        >
          <option value="">Tous les genres</option>
          <option value="Action">Action</option>
          <option value="Aventure">Aventure</option>
          <option value="Comédie">Comédie</option>
          <option value="Drame">Drame</option>
          <option value="Horreur">Horreur</option>
          <option value="Science-fiction">Science-fiction</option>
        </select>

        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="filter-select"
        >
          <option value="">Toutes les années</option>
          {Array.from({ length: 50 }, (_, i) => 2024 - i).map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {categories.map((category) => (
        <div key={category.name} className="category-section">
          <h3 className="category-title">{category.name}</h3>
          <div
            className="movie-list"
            style={{ display: "flex", overflowX: "auto" }}
          >
            {filteredMovies(category.movies).map((movie: Movie) => (
              <div
                key={movie.id}
                className="movie-item"
                onClick={() => openMovieModal(movie)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedMovie && (
        <div className="modal-overlay" onClick={closeMovieModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="favorite-btn"
              onClick={() => toggleFavorite(selectedMovie)}
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              {isFavorite(selectedMovie) ? (
                <i
                  className="fa-solid fa-star"
                  style={{ color: "#FFD700", fontSize: "24px" }}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-star"
                  style={{ color: "#FFD700", fontSize: "24px" }}
                ></i>
              )}
            </button>
            <button className="modal-close" onClick={closeMovieModal}>
              X
            </button>
            {trailerUrl ? (
              <div className="modal-trailer">
                <iframe
                  width="560"
                  height="315"
                  src={trailerUrl}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="no_bad">Aucune bande-annonce disponible</p>
            )}
            <h2 className="modal-title">{selectedMovie.title}</h2>
            <p className="modal-release-date">
              Date de sortie : {selectedMovie.release_date}
            </p>
            <p className="modal-overview">{selectedMovie.overview}</p>
            <p className="modal-vote-average">
              Note moyenne : {selectedMovie.vote_average} / 10
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
