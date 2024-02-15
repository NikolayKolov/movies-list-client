import { useRef, useState } from "react";
import Filters from "./Filters";
import SearchBar from "./SearchBar";
import debounce from "../../utils/debounce";
import { SearchFiltersType } from "../MoviesList/MoviesList";
import useOnClickOutside from "../../hooks/useOnClickOutside";

type SearchFilterProps = {
    filters: SearchFiltersType;
    onChange: (filters: SearchFiltersType) => void
}

const SearchFilter = ({ filters, onChange }: SearchFilterProps) => {
    const [isOpen, toggleFilters] = useState<boolean>(false);
    const ref = useRef(null);
    const handleOnChange = (newFilters: object) => {
        onChange({
            ...filters,
            ...newFilters
        });
    }

    const debouncedChange = debounce(handleOnChange, 300);

    let showFilter = false;
    // If filters object has more than 1 property and contains the property searchText,
    // show more filters options and button
    if (Object.keys(filters).length > 1 && Object.keys(filters).includes('searchText')) {
        showFilter = true;
    }

    const handleToggleFilters = () => {
        toggleFilters(!isOpen);
    }

    let className = 'movie-filters--section';
    if (isOpen) className+= ' movie-filters--section__open';

    const handleClickOutside = () => {
        if (isOpen) toggleFilters(false);
    }

    useOnClickOutside(ref, handleClickOutside);

    // Chech if search fields and order fields are set their default values
    const checkFiltersDefault = (filters: SearchFiltersType): boolean => {
        const searchFieldsDefault = Object.keys(filters.searchFields).every(
            field => (filters.searchFields[field as keyof typeof filters.searchFields])
        );

        const sortFieldsDefault = filters.orderByFields.default === 'asc';

        if (!(searchFieldsDefault && sortFieldsDefault)) return true;
        return false;
    }

    const areFiltersDefault = checkFiltersDefault(filters);

    return (
        <div className="movie-filters--container">
            <div className="movie-filters--expand-container" ref={ref}>
                <SearchBar
                    value={filters.searchText}
                    onChange={debouncedChange}
                    showFilter={showFilter}
                    onFilterClick={handleToggleFilters}
                    showFilterNotification={areFiltersDefault} />
                <div className={className}>
                    <div className="movie-filters--section-inner">
                        <Filters filters={filters} onChange={handleOnChange} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchFilter;