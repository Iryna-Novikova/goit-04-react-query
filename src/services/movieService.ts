import axios from "axios";
import type { Movie } from "../types/movie"; 
    
interface MoviesHttpResponse {
    results: Movie[];
    total_pages: number;
}

export const fetchMovies = async (query: string, page:number): Promise<MoviesHttpResponse> => {
    const myKey = import.meta.env.VITE_TMDB_TOKEN;

    axios.defaults.baseURL = 'https://api.themoviedb.org/3/search';
    
    const endPoint = '/movie';
    const params = {
        query,
        page
    }

    const response = await axios.get<MoviesHttpResponse>(endPoint, { params, headers: { Authorization: `Bearer ${myKey}` } });

    return response.data;
}