import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieCard from "../MovieCard";
import SearchFilter from "../SearchFilter";
import Modal from "../Modal/Modal";
import DeleteMovieModal from "../DeleteMovieModal";
import { useAppSelector } from "../../hooks/storeHooks";
import usePrevious from "../../hooks/usePrevious";
import { compareStringSort, searchInFields } from "./utils";
import { UpdateContextValueWrapper, UpdateContextSetValueWrapper } from "../../contexts/UpdateContext";
import { AuthenticationContextWrapper } from "../../contexts/AuthenticationContext";
import { getMoviesLastUpdatedAt } from "../../utils/moviesLS";
import RefreshIcon from "../SVGIcons/RefreshIcon";

const INIT_VISIBLE_MOVIES = 10;
const MOVIES_PER_LOAD = 10;

export type SearchFieldsType = {
    title: boolean;
    director: boolean;
    distributor: boolean;
}

type OrderByDefaultT = 'asc' | 'no';
type OrderByFieldT = 'asc' | 'desc' | 'no'

export type OrderByType = {
    default: OrderByDefaultT;
    title: OrderByFieldT;
    rating: OrderByFieldT;
    votes: OrderByFieldT; // asc = ascending, desc = descending, no = not used
}

export type SearchFiltersType = {
    searchText: string;
    searchFields: SearchFieldsType;
    orderByFields: OrderByType;
}

const MoviesList = () => {
    const [numberVisibleMovies, setNumberVisibleMovies] = useState<number>(INIT_VISIBLE_MOVIES);
    const [filters, setFilters] = useState<SearchFiltersType>({
        searchText: '',
        searchFields: {
            title: true,
            director: true,
            distributor: true,
        },
        orderByFields: {
            // order by default can only be asc or no, 'no' means don't use
            default: 'asc',
            title: 'no',
            rating: 'no',
            votes: 'no',
        }
    });
    const movieIds: number[] = useAppSelector(state => state.movies.ids);
    const movies = useAppSelector(state => state.movies.entities);
    const observer = useRef<IntersectionObserver | null>(null);
    const previousNumVisMovies = usePrevious(numberVisibleMovies, true);
    const { hash } = useLocation();
    const navigate = useNavigate();

    const [auth,] = useContext(AuthenticationContextWrapper);

    useEffect(()=> {
        document.title = 'Browse movies'
    }, []);
    // slice(1) removes the initial hash symbol at start
    const searchParams = new URLSearchParams(hash.slice(1));

    // Iterating the search parameters
    if (searchParams.size) {
        let updateFilters = false;
        const newFilters = structuredClone(filters);

        for (const p of searchParams) {
            const [paramName, paramValue] = p;
    
            // Update search text in state filters if different in URL hash
            if (paramName === 's' && paramValue !== filters.searchText) {
                updateFilters = true;
                newFilters.searchText = paramValue;
            }

            // Update search in text fields in state filters if different in URL hash
            if (paramName === 'searchIn') {
                if (paramValue.includes(',')) {
                    const arraySearchFields = paramValue.split(',');
                    let fieldsExist = false;
                    fieldsExist = arraySearchFields.some(field => (field in filters.searchFields));

                    if (fieldsExist) {
                        // Reset all field in newFilters.searchFields to false
                        const resetToFalseArr = Object.keys(newFilters.searchFields);
                        resetToFalseArr.map(field => (newFilters.searchFields[field as keyof SearchFieldsType] = false));
                        // set to true all valid fields in the URL hash
                        arraySearchFields.forEach(field => {
                            if (field in filters.searchFields && !filters.searchFields[field as keyof SearchFieldsType]) {
                                newFilters.searchFields[field as keyof SearchFieldsType] = true;
                                updateFilters = true;
                            }
                        });
                    }
                } else if (paramName in filters.searchFields && !filters.searchFields[paramName]) {
                    const resetToFalseArr = Object.keys(newFilters.searchFields);
                    resetToFalseArr.map(field => (newFilters.searchFields[field as keyof SearchFieldsType] = false));
                    newFilters.searchFields[paramName as keyof SearchFieldsType] = true;
                    updateFilters = true;
                }
            }
    
            // Update sort filers in state filters if different in URL hash
            if (paramName === 'sortField') {
                const paramSortOrder = searchParams.get('sortValue') ?? 'asc';

                if (paramValue in filters.orderByFields && filters.orderByFields[paramValue as keyof OrderByType] !== paramSortOrder) {
                    const resetToDefaultArr = Object.keys(newFilters.orderByFields);
                    resetToDefaultArr.map(field => (newFilters.orderByFields[field as keyof OrderByType] = 'no'));
                    // TypeScript doesn't understand the difference between default and other fields type
                    newFilters.orderByFields[paramValue as keyof OrderByType] = paramSortOrder as OrderByDefaultT;
                    updateFilters = true;
                }
            }
        }

        if (updateFilters) {
            setFilters({
                ...newFilters
            });
        }
    }

    // Infinite scroll movies list from Redux data
    const endMoviesListRef = useCallback((node: HTMLDivElement) => {
        if (!node) return;
        const maxLength = movieIds.length;
        if (observer.current === null) {
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && numberVisibleMovies < maxLength) {
                    setNumberVisibleMovies(prev => {
                        if ((prev + MOVIES_PER_LOAD) > maxLength) return maxLength;
                        else return prev + MOVIES_PER_LOAD;
                    });
                }
            });
        }
        observer.current.observe(node);
    }, [movieIds.length, numberVisibleMovies]);

    // When infinite scrolling, add a staggered delay in milliseconds for revealing each movie card
    const calculateDelay = (index: number, previousNumVisMovies?: number): number | undefined => {
        if (numberVisibleMovies == INIT_VISIBLE_MOVIES) {
            return 100 * index;
        }

        if (numberVisibleMovies > INIT_VISIBLE_MOVIES && index > (previousNumVisMovies as number)) {
            return 100 * (index - (previousNumVisMovies as number));
        }

        return undefined;
    }

    // Set new filter after filter change
    const handleFilterChange = (newFilters: SearchFiltersType) => {
        setFilters({
            ...newFilters
        });

        // Add search filters to href location hash
        let hashString = '#';
        const sortField = Object.keys(newFilters.orderByFields).find(field => {
            return newFilters.orderByFields[field as keyof OrderByType] !== 'no'
        });
        
        const searchText = newFilters.searchText;
        // Add search text hash only if there is one
        const addSearchText = searchText.length > 0;
        if (addSearchText) hashString = hashString + 's='+searchText;

        const searchFields = Object.keys(newFilters.searchFields).filter(field => (newFilters.searchFields[field as keyof SearchFieldsType]));
        const searchFieldsString = searchFields.join(',');
        // Add search in fields hash only if it is different from default value
        const addSearchFields = searchFields.length < Object.keys(newFilters.searchFields).length;
        if (addSearchFields) {
            if (hashString.length > 1) {
                hashString += '&';
            }
            hashString += 'searchIn=' + searchFieldsString;
        }

        const sortValue = newFilters.orderByFields[sortField as keyof OrderByType];
        // Add order by hash only if it is different from default value
        const addSort = sortField !== 'default';

        if (addSort) {
            if (hashString.length > 1) {
                hashString += '&';
            }
            hashString += 'sortField=' + sortField + '&sortValue=' + sortValue;
        }

        // add hash only if there is one, otherwise clear hash in href location
        if (hashString.length > 1) {
            navigate('/'+hashString);
        } else {
            navigate('/');
        }
    }

    // filter movies in list based on search criteria
    let filteredMovies = [...movieIds];

    if (filters.searchText.length) {
        filteredMovies = movieIds.filter(id => {
            return searchInFields(filters.searchText, filters.searchFields, movies[id]);
        });
    }

    // Sort the movies based on sort criteria
    filteredMovies = filteredMovies.sort((a, b) => {
        if (filters.orderByFields.default === 'asc') {
            // Default sort just sorts by movie ids
            return a - b;
        }

        // get the sort field and order
        let fieldName = '';
        let fieldOrder = '';
        const arraySorts = Object.keys(filters.orderByFields);
        for (let i = 0; i < arraySorts.length; i++) {
            const order = filters.orderByFields[arraySorts[i] as keyof OrderByType];
            if (order !== 'no') {
                fieldOrder = order;
                fieldName = arraySorts[i];
                break;
            }
        }

        // Get values for a and b for comparison to use the sort 
        let valueA: string | number = 0;
        let valueB: string | number = 0;

        if (fieldName === 'title') {
            valueA = movies[a][fieldName];
            valueB = movies[b][fieldName];
        } else {
            const movieA = movies[a].imdb;
            valueA = movieA[fieldName as keyof typeof movieA];
            const movieB = movies[b].imdb;
            valueB = movieB[fieldName as keyof typeof movieB];
        }

        // for numbers just subtract the values for sorting
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return fieldOrder === 'asc' ? (valueA - valueB) : (valueB - valueA);
        } else {
            return compareStringSort(valueA as string, valueB as string, fieldOrder === 'desc');
        }
    });

    // if refresh data icon should be shown
    const lastUpdatedAt = new Date(useContext(UpdateContextValueWrapper));
    const localLastUpdatedAt = new Date(getMoviesLastUpdatedAt() as string);
    // The getTime method returns time in miliseconds, get some tolerance
    const shouldUpdateData = (lastUpdatedAt.getTime() - localLastUpdatedAt.getTime()) > 100;
    const updateContext = useContext(UpdateContextSetValueWrapper);

    let classNameRefresh = 'movies-refresh';

    if (shouldUpdateData) {
        classNameRefresh += ' movies-refresh__show';
    }

    const handleUpdateDate = () => {
        if (!shouldUpdateData) return;
        // Begin update data in root component
        updateContext && updateContext({ initUpdate: true });
    }

    // Show modal here because CSS position: fixed doesn't work properly if 
    // ancestor element has CSS transform - such as component MovieCard
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteResult, setDeleteResult] = useState({status: 'idle'} as {status: 'idle' | 'deleting' | 'success' | 'error'});

    const handleDelete = (movieId: string) => {
        setDeleteModal(true);
        setDeleteId(Number(movieId));
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal(false);
        setDeleteId(0);
        setDeleteResult({status: 'idle'});
    }

    const handleMovieDelete = async () => {
        setDeleteResult({
            status: 'deleting'
        });
        try {
            const result = await fetch(`/api/movies/delete/${deleteId}`, {
                method: "POST",
                headers: {
                    Authorization: auth?.jwt ? `Bearer ${auth.jwt}` : ''
                }
            });
            if (!result.ok) throw new Error(`${result.status} ${result.statusText}`);
            const resultJSON = await (result as Response).json();
            updateContext && updateContext({value: resultJSON.lastUpdatedAt});
            setDeleteResult({
                status: 'success'
            });
        } catch(e) {
            console.log('MoviesList delete movie error', e);
            setDeleteResult({
                status: 'error',
            });
        }
    }

    let deleteMessage;
    const deleteTitle = deleteId && movies[deleteId].title;
    if (deleteId > 0) deleteMessage = `Are you sure you want to delete movie ${deleteTitle}?`;
    if (deleteResult.status === 'deleting') deleteMessage = `Deleting movie ${deleteTitle}, please wait`;
    if (deleteResult.status === 'error') deleteMessage = `Error deleting movie ${deleteTitle}, please try again later`;
    if (deleteResult.status === 'success') deleteMessage = `Successfully deleted movie ${deleteTitle}`;

    return (
        <>
            <Modal
                show={showDeleteModal}
                hideOnClickOutside={deleteResult.status !== 'deleting'}
                onClose={handleCloseDeleteModal}
                title='Delete movie'
                type='warning'>
                <DeleteMovieModal
                    message={deleteMessage}
                    status={deleteResult.status}
                    handleCloseDeleteModal={handleCloseDeleteModal}
                    handleMovieDelete={handleMovieDelete} />
            </Modal>
            <SearchFilter filters={filters} onChange={handleFilterChange} />
            <div className={classNameRefresh} onClick={handleUpdateDate}>
                <RefreshIcon />
                Refresh data
            </div>
            <div className="movies-grid">
                {
                    filteredMovies?.length ?
                        filteredMovies.map((id, index) => {
                            return index < numberVisibleMovies ?
                                <MovieCard
                                    key={id}
                                    id={id}
                                    delay={calculateDelay(index, previousNumVisMovies)}
                                    highlightText={filters.searchText}
                                    handleDelete={handleDelete}
                                    {...movies[id]} /> :
                                null
                        }) :
                        'No results to display'
                }
                {
                    filteredMovies?.length ?
                        <div className="movies-grid--end" ref={endMoviesListRef}></div> :
                        null
                }
                {
                    
                }
            </div>
        </>
    );
}

export default MoviesList;