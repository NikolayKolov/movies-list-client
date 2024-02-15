import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import TMovie from '../data/TMovie';
import { TMovieState, TMoviesState } from '../store/moviesSlice';

// NOT USED
// transform array of movies to a JSON object for normalized and easy data lookup
const moviesArrayToObject = (array: TMovie[]) => (
    array.reduce((obj, movie) => {
        const key: number = movie.id;
        const movieObj: TMovieState = {
            ...movie,
            title: movie.title.toString(),
        };
    
        return Object.assign(obj, { [key]: movieObj })
    }, {})
);

const movieIds = (array: TMovie[]) => {
    return array.map(movie => movie.id)
}

export const moviesApi = createApi({
    reducerPath: 'moviesApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getAllMovies: builder.query<TMoviesState, void>({
            query: () => ('movies'),
            transformResponse: (rawResult: { result: TMovie[] }): TMoviesState => {
                return {
                    entities: moviesArrayToObject(rawResult.result),
                    ids: movieIds(rawResult.result),
                    status: 'success'
                }
            }
        })
    })
});

export const { useGetAllMoviesQuery } = moviesApi;