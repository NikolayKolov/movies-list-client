import { useEffect } from "react";
import MovieCreateView from "../components/MovieUpsert/MovieCreateView";
import AuthPage from "../components/AuthComponents/AuthPage";

const MovieCreate = () => {
    useEffect(() => {
        document.title = 'Create new movie';
    }, []);

    return (
        <AuthPage>
            <MovieCreateView />
        </AuthPage>
    );
}

export default MovieCreate;