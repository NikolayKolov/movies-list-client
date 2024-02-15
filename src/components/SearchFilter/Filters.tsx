import React from "react";
import CheckBox from "./CheckBox";
import SortFilter from "./SortFilter";
import { OrderByType, SearchFiltersType, SearchFieldsType } from "../MoviesList/MoviesList";

type FilterProps = {
    filters: SearchFiltersType;
    onChange: (param: SearchFiltersType) => void,
}

const FieldLabels: { [key: string]: string } = {
    all: "All",
    title: "Title",
    director: "Director",
    distributor: "Distributor",
    default: "Default",
    rating: "Rating",
    votes: "Popularity"
}

const Filters = (props: FilterProps) => {
    const { filters, onChange } = props;
    const searchFields = structuredClone(filters.searchFields);
    let arraySearchFields = [...Object.keys(searchFields)];
    const arrayOrderByFields = [];
    let allChecked = false;

    allChecked = Object.keys(searchFields).every(el => searchFields[el as keyof typeof searchFields]);
    arraySearchFields = structuredClone(arraySearchFields);

    // Set up array for order by controls
    for (const f in filters.orderByFields) {
        arrayOrderByFields.push({
            name: f,
            label: FieldLabels[f],
            value: filters.orderByFields[f as keyof OrderByType]
        });
    }

    const handleSearchFilters = (name: string, value: boolean, searchFilters: SearchFieldsType): void => {
        const arrayProps = Object.keys(searchFilters);

        if (name === 'all') {
            // If all is being set to true (previous value is false), set all filters to true
            if (value) {
                arrayProps.forEach(field => {
                    searchFilters[field as keyof typeof searchFilters] = true;
                });

                onChange({
                    ...filters,
                    searchFields: {
                        ...searchFilters
                    }
                });
            } else {
                // if all is set to false (previous value is true), set only the first filter to true, all other to false
                arrayProps.forEach((field, index) => {
                    if (index === 0) searchFilters[field as keyof typeof searchFilters] = true;
                    else searchFilters[field as keyof typeof searchFilters] = false;
                });

                onChange({
                    ...filters,
                    searchFields: {
                        ...searchFilters
                    }
                });
            }
        } else {
            // If user selects an option different from "all"
            searchFilters[name as keyof typeof searchFilters] = value;
            const allFalse = arrayProps.every(field => {
                return searchFilters[field as keyof typeof searchFilters] === false;
            });

            // if all search fields would become false, the search woudn't work,
            // so make sure that at least one will remain true and checked
            if (allFalse) {
                value = true;
            }

            onChange({
                ...filters,
                searchFields: {
                    ...filters.searchFields,
                    [name]: value
                }
            });
        }
    }

    const switchSort = (value: string, isDefault = false): string => {
        return value === 'asc' ?
            isDefault ? 
                'asc' :
                'desc' :
            'asc';
    }

    const handleOrderByOptions = (name: string, value: string, searchFilters: OrderByType): void => {
        const arrayProps = Object.keys(searchFilters);
        arrayProps.forEach(f => {
            searchFilters[f as keyof OrderByType] = 'no';
        });

        const newValue = switchSort(value, name === 'default');
        onChange({
            ...filters,
            orderByFields: {
                ...searchFilters,
                [name]: newValue
            }
        })
    }

    // search filters
    const handleOnSearchChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const name = target.name, value = target.checked;
        handleSearchFilters(name, value, searchFields);
    }

    // sort filters
    const handleOnSortChange = (e: React.SyntheticEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        const name = target.dataset.name as string, value = target.dataset.value as string;

        const newSortFields = structuredClone(filters.orderByFields);
        handleOrderByOptions(name, value, newSortFields);
    }

    return (
        <div className="movies-filters--select">
                <div className="movies-filters--controls">
                    {/* Setting key to the name + value ensures the component rerenders on value change */}
                    <CheckBox key={'all' + allChecked} value={allChecked} label="All" name="all" onChange={handleOnSearchChange} />
                    {
                        arraySearchFields.map((el) => (
                            <CheckBox
                                key={el + searchFields[el as keyof typeof searchFields]}
                                value={searchFields[el as keyof typeof searchFields]}
                                label={FieldLabels[el]}
                                name={el}
                                onChange={handleOnSearchChange} />
                        ))
                    }
                </div>
            {
                arrayOrderByFields.length ? 
                    <div className="movies-filters--controls">
                        {
                            arrayOrderByFields.map((el) => (
                                <SortFilter 
                                    key={el.name + el.value}
                                    value={el.value}
                                    name={el.name}
                                    label={el.label}
                                    onChange={handleOnSortChange} />
                            ))
                        }
                    </div> :
                    null
            }
        </div>
    );
}

export default Filters;