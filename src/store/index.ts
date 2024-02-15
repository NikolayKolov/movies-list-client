import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice";

const store = configureStore({
    reducer: {
        movies: moviesReducer
    }
});

// Export store types to be used by the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;