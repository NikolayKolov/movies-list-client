import { IFetchData } from "../api/fetchMovies";
import delay from "./delay";

type onRetryFn = (_?: number) => void;

const retryFetch = async (
    fetch: () => Promise<IFetchData>,
    retries: number = 3,
    onRetry?: onRetryFn,
    currentRetry: number = 1
): Promise<IFetchData> => {
    const res: IFetchData = await fetch();
    if (res.status === 'success') {
        return res;
    }
    
    if (retries > 0) {
        // Retry after 1 second - default delay value
        await delay();
        onRetry && onRetry(currentRetry);
        retries--;
        currentRetry++;
        return await retryFetch(fetch, retries, onRetry, currentRetry);
    }

    return res;
}

export default retryFetch