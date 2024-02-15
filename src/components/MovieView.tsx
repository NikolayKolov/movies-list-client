import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHooks";
import openInNewTab from "../utils/openInNewWindow";
import { TMovieState } from "../store/moviesSlice";

const MovieView = () => {
    const { movieId } = useParams();
    const movies = useAppSelector(state => state.movies.entities);
    const id = movieId ?? '';
    const isNumber = /\d+/.test(id);

    let isOK = false;
    let isMobileImage = false;
    let isDesktopImage = false;
    let isMainImage = false;
    let isThumbImage = false;
    let movie: TMovieState | undefined = undefined;

    if (isNumber) {
        movie = movies[id] as TMovieState;
    }

    if (movie !== undefined) {
        isOK = true;
        if (movie.images?.desktopURL) {
            isDesktopImage = true;
        }

        if (movie.images?.mainURL) {
            isMainImage = true;
        }

        if (movie.images?.thumbnailURL) {
            isThumbImage = true;
        }

        if (movie.images?.mobileURL) {
            isMobileImage = true;
        }
    }

    const handleOpenImage = () => {
        isMainImage && openInNewTab('/' + movie?.images?.mainURL)
    }

    let className = 'image-container';
    if (isMainImage) className += " image-container__link";

    const mobileBackgroundStyle: React.CSSProperties | null = isThumbImage ? 
        {
            backgroundImage: `url("/${movie?.images?.thumbnailURL}")`
        } :
        null

    let imgSrc;
    let imgSrcSet;
    let imgSrcSizes;

    if (isDesktopImage && isMobileImage) {
        imgSrc = '/' + movie?.images?.desktopURL;
        imgSrcSet = `/${movie?.images?.mobileURL} 300w, /${movie?.images?.desktopURL} 480w`;
        imgSrcSizes = '(max-width: 1000px) 300px, 480px';
    } else if (isDesktopImage && !isMobileImage) {
        imgSrc = '/' + movie?.images?.desktopURL;
    } else if (!isDesktopImage && isMobileImage) {
        imgSrcSet = `/${movie?.images?.mobileURL} 300w, pictures/image-not-available.svg 480w`;
    } else {
        imgSrc = 'pictures/image-not-available.svg';
    }

    return (
        <>
            {
                isOK && movie !== undefined ?
                    <div className="movie-container">
                        <div className="image-container__mobile">
                            <div className={className} onClick={handleOpenImage}>
                                <img
                                    src={imgSrc}
                                    srcSet={imgSrcSet}
                                    sizes={imgSrcSizes}
                                    alt={movie.title} />
                                <p>Click on image to see larger version</p>
                            </div>
                            <div
                                className="image-container--background"
                                style={mobileBackgroundStyle as React.CSSProperties}>
                            </div>
                        </div>
                        
                        <article>
                            <div className="movie-detail">
                                <p className="movie-title">{movie.title}</p>
                            </div>
                            <div className="movie-detail">
                                <p className="movie-detail-name">Director:</p>
                                <p>{movie.director}</p>
                            </div>
                            <div className="movie-detail">
                                <p className="movie-detail-name">Distributor:</p>
                                <p>{movie.distributor}</p>
                            </div>
                            <div className="movie-detail">
                                <p className="movie-detail-name">IMDB Rating:</p>
                                <p>{Number(movie.imdb.rating).toFixed(1)}<sup>/10</sup></p>
                            </div>
                            <div className="movie-detail">
                                <p className="movie-detail-name">IMDB Votes:</p>
                                <p>{movie.imdb.votes.toLocaleString('en-GB')}</p> {/* To add a thousands separtor */}
                            </div>
                        </article>
                    </div> :
                    <div className="not-found">Movie not found</div>
            }
        </>
    );
}

export default MovieView;