/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import configs from './config';
import delay from './utils/delay';
import SplashScreen from './components/SplashScreen';

import MainLayout from './layout/MainLayout';
import Movies from './pages/Movies';
import Movie from './pages/Movie';
import MovieEdit from './pages/MovieEdit';
import MovieCreate from './pages/MovieCreate';
import NotFound from './pages/NotFound';

import fetchMovies, { fetchLastUpdatedAt, IFetchData } from "./api/fetchMovies";
import retryFetch from './utils/retryFetch';
import { getMoviesLS, setMoviesLS, getMoviesLastUpdatedAt } from "./utils/moviesLS";
import TMovie from './data/TMovie';
import { UpdateContextValueWrapper, UpdateContextSetValueWrapper, UpdateContextInitUpdateWrapper } from './contexts/UpdateContext';

import store from './store';
import { Provider } from 'react-redux';
import { TMoviesState, loadData, nomalizeMovies } from './store/moviesSlice';

import AuthenticationContext from './contexts/AuthenticationContext';

const App = () => {
    const [status, setStatus] = useState<string>('idle');
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);
    const timerId = useRef<number | undefined>(undefined);
    const timerCheckUpdatedId = useRef<number | undefined>(undefined);
    const refreshTime = configs.mainRefreshTime;
    const dispatch = store.dispatch;
    const setLastUpdatedAtDispatch = useContext(UpdateContextSetValueWrapper);
    const initUpdate = useContext(UpdateContextInitUpdateWrapper);
    const lastUpdatedAtContext = useContext(UpdateContextValueWrapper);

    // fetch movies and store data
    const updateMovies = async (shouldFetch: boolean): Promise<void> => {
        setStatus('loading');
        const moviesData: IFetchData = await retryFetch(
            fetchMovies,
            3,
            (num) => { setLoadingMessage(`Retry attempt No ${num}, please wait ...`) }
        );
        await delay(3000);

        if (!shouldFetch) return;

        if (moviesData.status === 'success') {
            const movies: TMovie[] = await (moviesData.data as Response).json();
            setStatus('success');
            // update local storage
            setMoviesLS(movies);
            // update last updated at context, reset should update whole data flag
            setLastUpdatedAtDispatch !== null && setLastUpdatedAtDispatch({
                value: new Date(Date.now()).toISOString(),
                initUpdate: false
            });

            // update redux store
            const payload: TMoviesState = {
                ids: nomalizeMovies.ids(movies),
                entities: nomalizeMovies.entities(movies),
                status: "success"
            }
            dispatch(loadData(payload));

            // set timeout to refresh the data after the time has passed
            if (timerId.current) {
                clearTimeout(timerId.current);
            }

            timerId.current = setTimeout(async (): Promise<void> => {
                await updateMovies(shouldFetch);
            }, refreshTime);
        } else {
            setStatus('error');
            setLoadingMessage('An error has occured, please try again later.')
        }
    }

    // fetch main data - the movies list
    useEffect(() => {
        let shouldFetch: boolean = true;

        // fetch first movies from local store cache
        // if there aren't any, or local store cache has expired, fetch from API
        const moviesLS = getMoviesLS();
        if (moviesLS.status === "OK") {
            const moviesResp: TMovie[] = moviesLS.movies;
            if (status !== 'success') setStatus('success');

            if (timerId.current) {
                clearTimeout(timerId.current);
            }

            // Set the time to update the cached movies
            const timeToUpdate: number = new Date(localStorage.getItem("moviesUpdatedAt") as string).getTime() + refreshTime;
            const timeNow: number = new Date(Date.now()).getTime();
            timerId.current = setTimeout(async (): Promise<void> => {
                await updateMovies(shouldFetch);
            }, (timeToUpdate - timeNow));

            // update redux store
            const payload: TMoviesState = {
                ids: nomalizeMovies.ids(moviesResp),
                entities: nomalizeMovies.entities(moviesResp),
                status: "success"
            };
            dispatch(loadData(payload));
        } else {
            updateMovies(shouldFetch);
        }

        if (timerCheckUpdatedId.current) {
            clearInterval(timerCheckUpdatedId.current);
        }

        return () => {
            shouldFetch = false;
            clearInterval(timerId.current);
        }
    }, []);

    // Init update of whole data on useContext flag being set
    useEffect(() => {
        let shouldFetch = true;

        if (initUpdate) {
            updateMovies(shouldFetch);
        }

        return () => {
            shouldFetch = false;
        }
    }, [initUpdate]);

    // check if server has been updated in the mean time every set interval
    useEffect(() => {
        if (timerCheckUpdatedId.current) clearInterval(timerCheckUpdatedId.current);

        timerCheckUpdatedId.current = setInterval(async (): Promise<void> => {
            const result = await fetchLastUpdatedAt();
            const stringResp = await (result.data as Response).json();
            const lastUpdatedAtTime = new Date(stringResp as string).getTime();
            const localLastUpdatedAtTime = new Date(getMoviesLastUpdatedAt() as string).getTime();
            let shouldUpdateData = (lastUpdatedAtTime - localLastUpdatedAtTime) > 0;
            if (lastUpdatedAtContext == stringResp) shouldUpdateData = false;

            if (result.status === 'success' && shouldUpdateData) {
                setLastUpdatedAtDispatch !== null && setLastUpdatedAtDispatch({
                    value: new Date(stringResp as string).toISOString()
                });
            }
        }, configs.pingUpdates);

        return () => {
            clearInterval(timerCheckUpdatedId.current);
        }
    }, [lastUpdatedAtContext, initUpdate]);

    return (
        status === 'loading' ?
            <SplashScreen message={loadingMessage}/> : 
            status === 'error' ?
                <SplashScreen isError={true} message={loadingMessage}/> :
                <Provider store={store}>
                    <AuthenticationContext>
                        <Router basename="/">
                            <Routes>
                                <Route path="/" element={<MainLayout />}>
                                    <Route path="login" element={<div style={{height: "1000px"}}>Login</div>} />
                                    <Route path="test" element={<div style={{height: "1000px"}}>Test</div>} />
                                    <Route index element={<Movies />} />
                                    <Route path="movie/:movieId" element={<Movie />} />
                                    <Route path="movie/edit/:movieId" element={<MovieEdit />} />
                                    <Route path="movie/create" element={<MovieCreate />} />
                                    <Route path="*" element={<NotFound />} />
                                </Route>
                            </Routes>
                        </Router>
                    </AuthenticationContext>
                </Provider>
    );
}

export default App;