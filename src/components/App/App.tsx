import SearchBar from '../SearchBar/SearchBar';
import './App.module.css';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import { toast, Toaster } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';

function App() {
  // cтани
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movieSelect, setMovieSelect] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);
      const findMovies = await fetchMovies(query);
      setMovies(findMovies);
      if (findMovies.length === 0) {
        toast.error('No movies found for your request.');
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setMovieSelect(null);
  };

  const handleSelect = (movie: Movie) => {
    setMovieSelect(movie);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
      {movies.length > 0 && (
        <MovieGrid onSelect={handleSelect} movies={movies} />
      )}
      {movieSelect && <MovieModal movie={movieSelect} onClose={closeModal} />}
    </>
  );
}

export default App;
