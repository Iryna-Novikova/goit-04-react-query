import axios from "axios";
import type { Movie } from "../types/movie"; 
    
interface MoviesHttpResponse {
    results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    const myKey = import.meta.env.VITE_TMDB_TOKEN;

    axios.defaults.baseURL = 'https://api.themoviedb.org/3/search';
    
    const endPoint = '/movie';
    const params = {
        query,
    }

    const response = await axios.get<MoviesHttpResponse>(endPoint, { params, headers: { Authorization: `Bearer ${myKey}` } });

    return response.data.results;
}