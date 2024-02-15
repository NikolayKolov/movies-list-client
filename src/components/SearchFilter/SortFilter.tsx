/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type TSortFilterProps = {
    value: string;
    name: string;
    label: string;
    onChange: (...args: any[]) => any
}
const SortFilter = ({value, name, label, onChange}: TSortFilterProps) => {

    return (
        <div
            className={
                name === 'default' ?
                'movies-filters--control movies-filters--control__default' :
                'movies-filters--control'
            }
            data-value={value}
            data-name={name}
            onClick={(e) => onChange(e)}
        >
            {label}
            <span className="movies-filters--sort-controls">
                <p></p>
                <p></p>
            </span>
        </div>
    );
}

export default SortFilter;