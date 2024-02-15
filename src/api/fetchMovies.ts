export interface IFetchData {
    status: 'success' | 'error'
    data: Response | unknown
}

// shouldFail used for testing purposes, ingore in real
const fetchMovies = async (shouldFail: boolean = false): Promise<IFetchData> => {
    try {
        const res = await fetch('/api/movies');

        // Throw error on network error
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return {
            status: shouldFail ? 'error' : 'success',
            data: res
        };
    } catch(e) {
        return {
            status: 'error',
            data: e
        };
    }
}

export const fetchLastUpdatedAt = async () => {
    try {
        const res = await fetch('/api/movies/lastupdatedat');

        // Throw error on network error
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return {
            status: 'success',
            data: res
        };
    } catch(e) {
        return {
            status: 'error',
            data: e
        };
    }
}

export default fetchMovies;