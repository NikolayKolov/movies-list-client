/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import ActionsIcon from "./SVGIcons/ActionsIcon";
import AuthComponent from "./AuthComponents/AuthComponent";
import MovieCardActions from "./MovieCardActions";
import { useNavigate } from "react-router-dom";
import TMovie from "../data/TMovie";
import useOnClickOutside from "../hooks/useOnClickOutside";

type TMovieCard = TMovie & {
    delay?: number;
    highlightText?: string;
    handleDelete: (...args: any[]) => any;
}

const MovieCard = (props: TMovieCard) => {
    const {
        id,
        title,
        images,
        imdb,
        delay,
        highlightText,
        handleDelete
    } = props;
    const [actionsOpen, setActions] = useState<boolean>(false);
    const articleElRef = useRef<HTMLDivElement | null>(null);
    const divElRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    // if the movie has a desktop thumb image, it should also have other images for main/mobile 
    const showImage = !!images?.thumbnailURL;
    const desktopImage = showImage && images.desktopURL;
    const mobileImage = showImage && images.mobileURL;
    const thumbnailURL = images?.thumbnailURL ?? 'pictures/image-not-available.svg';
    const movieRating = imdb.rating;

    const hanldeOnClick = () => {
        navigate(`/movie/${id}`);
    }

    let imgSrc;
    let imgSrcSet;
    let imgSrcSizes;
    
    if (showImage) {
        if (desktopImage && mobileImage) {
            imgSrc = mobileImage;
            imgSrcSet = `${mobileImage} 300w, ${desktopImage} 480w`;
            imgSrcSizes = '(max-width: 600px) 300px, 480px';
        } else if (desktopImage) {
            imgSrc = desktopImage;
        } else if (mobileImage) {
            imgSrc = mobileImage;
        } else {
            imgSrc = 'pictures/image-not-available.svg';
        }
    }

    let displayTitle = <span>{title}</span>;

    // Add text highlight for search parameter
    if (highlightText) {
        const re = new RegExp(highlightText, 'gi')
        const matches = title.matchAll(re);
        let startIndex = 0;
        const arrayElems: JSX.Element[] = [];
        for(const m of matches) {
            arrayElems.push(<>{title.slice(startIndex, m.index)}</>);
            arrayElems.push(<strong>{m[0]}</strong>);
            if (m.index !== undefined) startIndex = m.index + m[0].length;
        }

        if (startIndex < title.length) {
            arrayElems.push(<>{title.slice(startIndex, title.length)}</>);
        }

        displayTitle = <>{arrayElems.map((el, i) => (<React.Fragment key={i}>{el}</React.Fragment>))}</>
    }

    /* onLoad and onError img event handlers, can be used instead of useEffect
    const handleImgLoaded = () => {
        const divEl = divElRef.current as HTMLDivElement;
        divEl.classList.remove('movie-card--image-container__loading');
    }

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const divEl = divElRef.current as HTMLDivElement;
        const imageEl = e.target as HTMLImageElement;

        divEl.classList.remove('movie-card--image-container__loading');
        divEl.style.backgroundImage = "none";

        imageEl.setAttribute('src', 'pictures/image-not-available.svg');
        imageEl.removeAttribute('srcset');
        imageEl.removeAttribute('sizes');
        imageEl.classList.remove('movie-card--image');
        imageEl.classList.add('movie-card--image__missing');
    }*/

    useEffect(() => {
        const articleEl = articleElRef.current as HTMLDivElement;
        const divEl = divElRef.current as HTMLDivElement;
        const imgEl = divEl.querySelector('img.movie-card--image') as HTMLImageElement;

        // load default image in case image is missing
        const onError = () => {
            divEl.classList.remove('movie-card--image-container__loading');
            divEl.style.backgroundImage = "none";

            imgEl.setAttribute('src', 'pictures/image-not-available.svg');
            imgEl.removeAttribute('srcset');
            imgEl.removeAttribute('sizes');
            imgEl.classList.remove('movie-card--image');
            imgEl.classList.add('movie-card--image__missing');
        }

        const onLoad = () => {
            divEl.classList.remove('movie-card--image-container__loading');
            divEl.style.backgroundImage = "none";
            // clean up
            imgEl.removeEventListener('error', onError);
        };

        if (delay) {
            articleEl.style.animationDelay = delay.toString() + 'ms';
        }

        if (showImage) {            
            if (imgEl.complete) {
                imgEl.removeEventListener('load', onLoad);
                imgEl.removeEventListener('error', onError);
                divEl.classList.remove('movie-card--image-container__loading');
            } else {
                imgEl.addEventListener('load', onLoad);
                imgEl.addEventListener('error', onError);
            }
        }

        return () => {
            if (showImage) {
                if (imgEl.complete) {
                    imgEl.removeEventListener('load', onLoad);
                    imgEl.removeEventListener('error', onError);
                }
            }
        }
    }, []);

    let classNameActions = "actions-container";
    if (actionsOpen) {
        classNameActions += " actions-container__open";
    }

    useOnClickOutside(articleElRef, () => setActions(false));

    const handleShowActions = (e: React.SyntheticEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setActions(!actionsOpen);
    }

    const handleDeleteClick = (movieId: string) => {
        setActions(false);
        handleDelete(movieId);
    }

    return (
        <article className="movie-card" key={id} ref={articleElRef} onClick={hanldeOnClick}>
            {
                showImage ? 
                    <div
                        className="movie-card--image-container movie-card--image-container__loading"
                        ref={divElRef}
                        style={{backgroundImage: `url(/${thumbnailURL})`}}>
                        <img
                            src={imgSrc}
                            srcSet={imgSrcSet}
                            sizes={imgSrcSizes}
                            alt={title}
                            className="movie-card--image"
                            loading="lazy"
                            /* onLoad={handleImgLoaded}
                            onError={handleImgError} */ />
                    </div> :
                    <div
                        className="movie-card--image-container"
                        ref={divElRef}>
                        <img
                            src='pictures/image-not-available.svg'
                            alt='Image not available'
                            className="movie-card--image__missing" />
                    </div>
            }
            <AuthComponent>
                <div className="movie-card--actions" onClick={handleShowActions}>
                    <ActionsIcon />
                </div>
                <div className={classNameActions}>
                    <div>
                        <div className="actions-content">
                            <MovieCardActions movieId={id.toString()} handleDelete={handleDeleteClick} />
                        </div>
                    </div>
                </div>
            </AuthComponent>

            <div className="movie-info">
                <p className="movie-title" title={title}>{displayTitle}</p>
                <p className="movie-rating" title={movieRating.toString()} style={{"--rating": movieRating} as React.CSSProperties}></p>
            </div>
        </article>
    );
}

export default MovieCard;