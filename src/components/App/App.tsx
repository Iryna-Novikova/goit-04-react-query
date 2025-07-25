import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import type { Movie } from '../../types/movie';
import { useEffect, useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import { toast, Toaster } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

function App() {
  // cтани
  const [movieSelect, setMovieSelect] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = async (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.', { duration: 1200 });
    }
  }, [isSuccess, data]);

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
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data?.results.length > 0 && (
        <MovieGrid onSelect={handleSelect} movies={data.results} />
      )}
      {movieSelect && <MovieModal movie={movieSelect} onClose={closeModal} />}
    </>
  );
}

export default App;
