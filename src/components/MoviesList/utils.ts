import { SearchFieldsType } from "./MoviesList";
import { TMovieState } from "../../store/moviesSlice";

export const compareStringSort = (a: string, b: string, isDesc = false): number => {
    if (a < b) return isDesc ? 1 : -1;
    if (a > b) return isDesc ? -1 : 1;
    else return 0;
}

export const searchInFields = (searchText: string, searchFields: SearchFieldsType, searchObject: TMovieState) => {
    let searchString = '';
    for (const field in searchFields) {
        const f = field as keyof SearchFieldsType;
        if (searchFields[f]) {
            searchString += searchObject[f];
        }
    }
    return searchString.toLowerCase().includes(searchText.toLowerCase());
}