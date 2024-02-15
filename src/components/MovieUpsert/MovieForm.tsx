/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
type MovieFormProps = {
    formData: any;
    onChange: (...args: any[]) => any;
    onSubmit: (...args: any[]) => any;
    resetFile?: (...args: any[]) => any;
    isLoading?: boolean;
    isSubmitable?: boolean;
    statusMessage?: string;
    movieImages?: any;
}

const MovieForm = (props: MovieFormProps) => {
    const { formData, onChange, onSubmit, isLoading = false, isSubmitable = true, statusMessage, movieImages, resetFile } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const urlBlobRef = useRef('');

    const onCancel = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Check if can returt to previous page from history
        // If not, go to home page
        const canGoback = location.key !== 'default';
        if (canGoback) navigate(-1);
        else navigate('/');
    }

    const handleFormChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onChange && onChange(e);
    }

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit && onSubmit(e);
    }

    let statusClassName = 'movie-form--status';
    if (statusMessage?.length) {
        if (isLoading) statusClassName += ' movie-form--status__loading';
        else if (Object.keys(formData.errors).length > 0) statusClassName += ' movie-form--status__error';
        else statusClassName += ' movie-form--status__success';
    }

    const originalPosterAvailable = movieImages?.desktopURL !== undefined;
    let previewSrc: any;
    if (formData.posterImage !== null && formData.posterImage instanceof File) {
        urlBlobRef.current = URL.createObjectURL(formData.posterImage);
        previewSrc = urlBlobRef.current;
    } else {
        if (urlBlobRef.current !== '') URL.revokeObjectURL(urlBlobRef.current);

        if (movieImages?.desktopURL !== undefined) {
            previewSrc = '/' + movieImages.desktopURL;
        } else {
            previewSrc = '/pictures/image-not-available.svg';
        }
    }

    const disableReset = typeof previewSrc === 'string' && previewSrc === '/' + movieImages?.desktopURL;

    const resetPoster = () => {
        if (disableReset) return;

        if (resetFile !== undefined) {
            if (fileRef.current !== null) fileRef.current.value = '';
            resetFile('posterImage');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="movie-form" noValidate>
            <div className={formData.errors['title'] ? "form-row form-row__error" : "form-row"}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    placeholder="Enter movie title"
                    onChange={handleFormChange}
                    disabled={isLoading} />
                <p className="form-row--error">{formData.errors['title']}</p>
            </div>
            <div className={formData.errors['director'] ? "form-row form-row__error" : "form-row"}>
                <label htmlFor="director">Director</label>
                <input
                    type="text"
                    id="director"
                    value={formData.director}
                    placeholder="Enter movie director"
                    onChange={handleFormChange}
                    disabled={isLoading} />
                <p className="form-row--error">{formData.errors['director']}</p>
            </div>
            <div className={formData.errors['distributor'] ? "form-row form-row__error" : "form-row"}>
                <label htmlFor="distributor">Distributor</label>
                <input
                    type="text"
                    id="distributor"
                    value={formData.distributor}
                    placeholder="Enter movie distributor"
                    onChange={handleFormChange}
                    disabled={isLoading} />
                <p className="form-row--error">{formData.errors['distributor']}</p>
            </div>
            <div className={formData.errors['imdbRating'] ? "form-row form-row__error" : "form-row"}>
                <label htmlFor="imdbRating">IMDB Rating</label>
                <input
                    type="number"
                    inputMode="numeric"
                    step={0.1}
                    min={1}
                    max={10}
                    id="imdbRating"
                    value={formData.imdbRating}
                    placeholder="Enter movie IMDB Rating"
                    onChange={handleFormChange}
                    disabled={isLoading} />
                <p className="form-row--error">{formData.errors['imdbRating']}</p>
            </div>
            <div className={formData.errors['imdbVotes'] ? "form-row form-row__error" : "form-row"}>
                <label htmlFor="imdbVotes">IMDB Votes</label>
                <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    className="hide-arrows"
                    id="imdbVotes"
                    value={formData.imdbVotes}
                    placeholder="Enter movie IMDB Votes"
                    onChange={handleFormChange}
                    disabled={isLoading} />
                <p className="form-row--error">{formData.errors['imdbVotes']}</p>
            </div>
            <div className={formData.errors['posterImage'] ? "form-row form-row__error" : "form-row"}>
                <label htmlFor="posterImage">Film Poster</label>
                <div className="movie-form--input-poster">
                    <div className="input-poster--img-buttons">
                        <label htmlFor="posterImage">
                            {
                                originalPosterAvailable ?
                                    'Change movie poster' :
                                    'Add movie poster'
                            }
                        </label>
                        {
                            originalPosterAvailable && 
                                <label
                                    data-disabled={disableReset ? 'true' : 'false'}
                                    onClick={resetPoster}>
                                    Return initial poster
                                </label>
                        }
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        id="posterImage"
                        onChange={handleFormChange}
                        disabled={isLoading}
                        accept=".jpeg,.jpg" />
                    <img className="movie-form--preview-poster" src={previewSrc} alt='Poster preview' />
                </div>
                <p className="form-row--error">{formData.errors['posterImage']}</p>
            </div>
            <div className="form-row--actions">
                <button onClick={onCancel} disabled={isLoading}>Cancel</button>
                <button type="submit" disabled={isLoading || !isSubmitable}>Submit</button>
            </div>
            <div className={statusClassName}>
                <span>
                    {statusMessage}
                </span>
                <span className="movie-form--status-ellipsis"></span>
            </div>
            
        </form>
    );
}

export default MovieForm;