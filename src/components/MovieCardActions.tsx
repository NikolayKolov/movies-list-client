/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";

type MovieCardActionsProps = {
    movieId: string;
    handleDelete: (...args: any[]) => any;
}

const MovieCardActions = ({movieId, handleDelete}: MovieCardActionsProps) => {
    const navigate = useNavigate();

    const handleEdit = (e: React.SyntheticEvent<HTMLParagraphElement>) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/movie/edit/${movieId}`);
    }

    const handleDeleteClick = (e: React.SyntheticEvent<HTMLParagraphElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleDelete(movieId);
    }

    return (
        <>
            <div className="movie-actions">
                <p onClick={handleEdit}>Edit</p>
                <p onClick={handleDeleteClick}>Delete</p>
            </div>
        </>
    );
}

export default MovieCardActions;