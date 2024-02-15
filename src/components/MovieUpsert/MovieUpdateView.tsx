import MovieUpsertView from "./MovieUpsertView";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHooks";
import { TMovieState } from "../../store/moviesSlice";

const MovieUpdateView = () => {
    const { movieId } = useParams();
    const movies = useAppSelector(state => state.movies.entities);
    const id = movieId ?? '';
    const isNumber = /\d+/.test(id);
    let movie: TMovieState | undefined = undefined;

    if (isNumber) {
        movie = movies[id] as TMovieState;
    }

    return (
        <>
            {
                movie !== undefined ? 
                    <MovieUpsertView
                        type='update'
                        movieId={Number(movieId)}
                        movie={movie} /> :
                    <div className="not-found">
                        Movie not found
                    </div>
            }
        </>
    );
}

export default MovieUpdateView;