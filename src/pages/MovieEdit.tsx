import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHooks";
import MovieUpdateView from "../components/MovieUpsert/MovieUpdateView";
import AuthPage from "../components/AuthComponents/AuthPage";

const MovieEdit = () => {
    const { movieId } = useParams();
    const movies = useAppSelector(state => state.movies.entities);
    const movieTitle = movies[movieId ?? '']?.title ?? '';

    useEffect(() => {
        document.title = 'Edit movie '+ movieTitle
    }, [movieTitle]);

    return (
        <AuthPage>
            <MovieUpdateView />
        </AuthPage>
    );
}

export default MovieEdit;