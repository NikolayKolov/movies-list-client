import moviesList from "../data/MoviesListInit.json";
import TMovie from "../data/TMovie";

// DO NOT USE
const fetchMovies = (shouldFail: boolean = false): Promise<void | TMovie[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('Fake fetch set to fail'));
            } else {
                resolve(moviesList);
            }
        }, 3000);
    }).then((response) => {
        // fake async processing of response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(response as TMovie[] | PromiseLike<TMovie[]>);
            }, 1000);
        });
    });
}

export default fetchMovies;