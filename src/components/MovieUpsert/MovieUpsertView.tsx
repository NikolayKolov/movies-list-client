/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { UpdateContextSetValueWrapper } from "../../contexts/UpdateContext";
import { AuthenticationContextWrapper } from "../../contexts/AuthenticationContext";
import { TMovieState } from "../../store/moviesSlice";
import { validateField, validateFormData, ErrorType } from "./movieUpsertValidation";
import MovieForm from "./MovieForm";

type MovieUpdateProps = {
    type: 'update',
    movieId: number,
    movie: TMovieState
}

type MovieCreateProps = {
    type: 'create'
}

type MovieUpsertProps = MovieUpdateProps | MovieCreateProps;

const MovieUpsertView = (props: MovieUpsertProps) => {
    const { type } = props;
    let movieId: number| undefined, movie: TMovieState | undefined;

    if (type === 'update') {
        movieId = props.movieId;
        movie = props.movie;
    }

    const movieImages = movie !== undefined ? structuredClone(movie.images) : undefined;

    const resetFile = (fieldName: string) => {
        // if no initial file, can't reset
        if (movieImages === undefined) return;
        // clean up old file errors
        const newErrors = structuredClone(formData.errors);
        if ('posterImage' in newErrors) delete newErrors['posterImage'];

        setFormData(prev => ({
            ...prev,
            [fieldName]: null,
            errors: {
                ...newErrors
            }
        }));

        // make form submitable if no errors remain
        if (Object.keys(newErrors).length === 0) {
            setSubmitable(true);
            setFormStatus('');
        }
    }

    const [formData, setFormData] = useState(() => {
        if (type === 'create' || (type === 'update' && movie === undefined)) {
            return {
                title: '',
                director: '',
                distributor: '',
                imdbRating: 1,
                imdbVotes: 1,
                posterImage: null,
                errors: {}
            };
        } else {
            return {
                title: movie?.title ?? '',
                director: movie?.director ?? '',
                distributor: movie?.distributor ?? '',
                imdbRating: movie?.imdb.rating ?? 1,
                imdbVotes: movie?.imdb.votes ?? 1,
                posterImage: null,
                errors: {}
            };
        }
    });

    const [formStatus, setFormStatus] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSubmitable, setSubmitable] = useState<boolean>(true);

    const handleFormChange = async (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        const name = target.id;
        const fileValue = target.files && target.files[0];
        const value = name === 'posterImage' ? fileValue : target.value;

        let result; 
        if (name !== 'posterImage') result = validateField(name, value);
        else if (value === null) {
            // if the movie doesn't have a poster, that is a mistake that must be fixed
            if (movieImages === undefined) {
                result = {
                    error: true,
                    errorMessage: "Please attach a movie poster file"
                }
            } else {
                // if the value for user updated movie poster is empty,
                // but the movie already has one, it is OK, it will be kept the same
                result = true;
            }
        } else result = await validateField(name, value);

        if (result === true) {
            const newErrors = {...formData.errors};
            // if the validation result is OK for the field, delete it from errors object
            if (newErrors[name as keyof typeof newErrors]) delete newErrors[name as keyof typeof newErrors];

            setFormData({
                ...formData,
                [name]: value,
                errors: {
                    ...newErrors
                }
            });

            // make form submitable if no errors remain
            if (Object.keys(newErrors).length === 0) {
                setSubmitable(true);
                setFormStatus('');
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
                errors: {
                    ...formData.errors,
                    [name]: (result as ErrorType).errorMessage
                }
            });
            setSubmitable(false);
            setFormStatus('Please fix form errors');
        }
    }

    const setLastUpdatedAtDispatch = useContext(UpdateContextSetValueWrapper);
    const [auth,] = useContext(AuthenticationContextWrapper);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Network error is not relevant until form is resubmitted
        const newErrors = structuredClone(formData.errors);
        if (newErrors['networkError' as keyof typeof newErrors]) delete newErrors['networkError' as keyof typeof newErrors];

        if (Object.keys(newErrors).length) {
            setFormStatus('Please fix form errors');
            return;
        }

        const newFormData: any = structuredClone(formData);
        delete newFormData['errors'];
        // Don't check file if form is updating and previous file exists
        if (type === 'update' && newFormData['posterImage'] === null && movieImages !== undefined) {
            delete newFormData['posterImage'];
        }
        const isFormValid = await validateFormData(newFormData);
        if (isFormValid !== true) {
            setFormStatus('Please fix form errors');
            setFormData(prev => ({
                ...prev,
                errors: {
                    ...isFormValid
                }
            }));
            return;
        }

        const requestData = new FormData();
        const newFields = Object.keys(newFormData);
        newFields.forEach(field => {
            if (field !== 'posterImage') requestData.append(field, newFormData[field]);
            if (field === 'posterImage' && newFormData[field] !== null) requestData.append(field, newFormData[field]);
        });

        setLoading(true);
        setFormStatus('Loading, please wait');

        try {
            const fetchURL = type === 'update' ?
                `/api/movies/edit/${movieId}` :
                '/api/movies/create'
            const result = await fetch(fetchURL, {
                method: "POST",
                body: requestData,
                headers: {
                    Authorization: auth?.jwt ? `Bearer ${auth.jwt}` : ''
                }
            });
            const resultJSON = await (result as Response).json();
            if (!result.ok || resultJSON?.status === 'error') {
                // unauthorized
                if (result.status === 403) {
                    if (resultJSON.mess)
                    setFormStatus('User authorization error, please login again');
                    setFormData(prev => ({
                        ...prev,
                        errors: {
                            networkError: true
                        }
                    }));
                } else {
                    setFormStatus('Edit failed, please fix errors and try again later');
                    setFormData(prev => ({
                        ...prev,
                        errors: {
                            ...resultJSON
                        }
                    }));
                }

                throw new Error('Rethrow');
            }

            setFormStatus(type === 'update' ? 'Edit successful' : 'Successfuly created');
            setFormData(prev => ({
                ...prev,
                errors: {}
            }));
            setLastUpdatedAtDispatch !== null && setLastUpdatedAtDispatch({
                value: resultJSON.lastUpdatedAt
            });
        } catch(e) {
            console.log('handleSubmit error e', e)
            if ((e as Error).message !== 'Rethrow') {
                const statusFailure = (type === 'update' ? 'Edit ' : 'Creation ') + 'failed, please try again later';
                setFormStatus(statusFailure);
                setFormData(prev => ({
                    ...prev,
                    errors: {
                        networkError: true
                    }
                }));
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <MovieForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            isLoading={isLoading || (type === 'update' && movie === undefined)}
            isSubmitable={isSubmitable}
            statusMessage={formStatus}
            movieImages={movieImages}
            resetFile={resetFile} />
    );
}

export default MovieUpsertView;