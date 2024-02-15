type TMovieImages = {
    thumbnailURL?: string;
    desktopURL?: string;
    mobileURL?: string;
    mainURL?: string;
}

type TMovie = {
    id: number;
    title: string;
    director: string;
    distributor: string;
    photoURL?: string;
    thumbnailURL?: string;

    images?: TMovieImages,

    imdb: {
        rating: number;
        votes: number
    }
}

export default TMovie;