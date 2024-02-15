/**
 * Initialize movies list and save it to local storage */

import TMovie from "../data/TMovie";
import configs from "../config";

type TMovieLSOK = {
    status: "OK";
    movies: Array<TMovie>;
}

type TMovieLSEXPIRED = {
    status: "EXPIRED";
    movies: null;
}

export type TMovieLS = TMovieLSOK | TMovieLSEXPIRED;

const getMoviesLS = (): TMovieLS => {
    const lastUpdatedAtLS: string | null = localStorage.getItem("moviesUpdatedAt");

    if (!lastUpdatedAtLS) {
        return {
            status: "EXPIRED",
            movies: null
        }
    }

    const lastUpdatedAtDate: number = new Date(lastUpdatedAtLS).getTime();
    const now: number = new Date().getTime();

    // the date in the app is updated at bulk every day, so a 12 hour max cache time
    const maxDifferenceInMS = configs.mainRefreshTime; // 12 hours = 1000 * 60 * 60 * 12
    // if stored data is too old, remove and return result
    if ((now - lastUpdatedAtDate) > maxDifferenceInMS) {
        localStorage.removeItem("moviesUpdatedAt");
        localStorage.removeItem("movies");
        return {
            status: "EXPIRED",
            movies: null
        };
    } else {
        const movies = JSON.parse(localStorage.getItem("movies") as string);
        return {
            status: "OK",
            movies
        };
    }
}

const setMoviesLS = (movies: TMovie[]): void => {
    const dateNow = new Date(Date.now()).toISOString();
    localStorage.setItem("moviesUpdatedAt", dateNow);
    localStorage.setItem("movies", JSON.stringify(movies));
}

const clearMoviesLS = (): void => {
    localStorage.removeItem("moviesUpdatedAt");
    localStorage.removeItem("movies");
}

const getMoviesLastUpdatedAt = (): string | null => {
    return localStorage.getItem("moviesUpdatedAt");
}

export {
    getMoviesLS,
    setMoviesLS,
    clearMoviesLS,
    getMoviesLastUpdatedAt
};