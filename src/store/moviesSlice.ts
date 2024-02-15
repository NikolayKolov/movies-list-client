import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TMovie from "../data/TMovie";

export type TMovieState = Omit<TMovie, 'id'>;

// transform array of movies to a JSON object for normalized and easy data lookup
const normalizeEntities = (array: TMovie[]) => (
    array.reduce((obj, movie) => {
        const key: number = movie.id;
        const movieObj: TMovieState = {
            ...movie,
            title: movie.title.toString(),
        };
    
        return Object.assign(obj, { [key]: movieObj })
    }, {})
);

const normalizeIds = (array: TMovie[]) => {
    return array.map(movie => movie.id)
}

export const nomalizeMovies = {
    entities: normalizeEntities,
    ids: normalizeIds
}

export type TMoviesState = {
    entities: {
        [key: string]: TMovieState
    },
    ids: number[],
    status: 'idle' | 'loading' | 'success' | 'error'
}

const initialState: TMoviesState = {
    entities: {},
    ids: [],
    status: 'idle'
};

export const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        loadData(state, action: PayloadAction<TMoviesState>) {
            state.entities = action.payload.entities;
            state.ids = action.payload.ids;
            state.status = action.payload.status;
        }
    }
});

// Action creators are generated for each reducer function
export const { loadData } = moviesSlice.actions

export default moviesSlice.reducer
