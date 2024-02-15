import React, { useState } from 'react';
import filter from "../../assets/icons/filter.svg";

type SearchBarProps = {
    value: string;
    onChange: (param: { searchText: string }) => void,
    showFilter: boolean;
    showFilterNotification?: boolean;
    onFilterClick?: () => void,
}

const SearchBar = (props: SearchBarProps) => {
    const { value, onChange, showFilter, showFilterNotification = false, onFilterClick } = props;
    const [search, setSearch] = useState(value);

    const handleOnChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const text = (e.target as HTMLInputElement).value;
        setSearch(text);
        onChange({
            searchText: text
        });
    }

    let className = 'movies-search';
    if (showFilter) className += ' movies-search__filter';

    let classNameFilter = 'movies-search--filter-icon';
    if (showFilterNotification) classNameFilter += ' movies-search--filter-icon__nofitication';

    const handleOnFilterClick = () => {
        onFilterClick && onFilterClick();
    }

    return (
        <>
            <input
                type='search'
                className={className}
                value={search}
                onChange={handleOnChange}
                placeholder='Type here to search...' />
            {
                showFilter &&
                <div className={classNameFilter} onClick={handleOnFilterClick}>
                    <img src={filter} alt="Filter" />
                </div>
            }
        </>
    );
}

export default SearchBar;