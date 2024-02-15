/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type TChBoxProps = {
    value: boolean;
    label: string;
    name: string;
    onChange: (...args: any[]) => any
}

const CheckBox = ({value, label, name, onChange}: TChBoxProps) => {

    return (
        <label
            htmlFor={name}
            className={
                name === 'all' ?
                    'movies-filters--control movies-filters--control__default' :
                    'movies-filters--control'
            }>
            <input
                type='checkbox'
                id={name}
                name={name}
                checked={value}
                onChange={(e: React.SyntheticEvent<HTMLInputElement>) => onChange(e)} />
            {label}
        </label>
    );
}

export default CheckBox;