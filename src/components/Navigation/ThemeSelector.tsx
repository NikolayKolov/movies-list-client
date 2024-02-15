import React, { useEffect, useId, useRef, useState } from "react";
import themesList from "../../data/ThemesList.json";
import { getAppTheme, setAppTheme } from "../../utils/theme";
import ITheme from "../../data/ITheme";
import usePrevious from "../../hooks/usePrevious";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const ThemeSelector = () => {
    const [theme, setTheme] = useState<string>(getAppTheme);
    const [isOpen, setOpen] = useState<boolean>(false);
    const themeId = useId();
    const selectorRef = useRef(null);

    const previousTheme = usePrevious(theme);
    useOnClickOutside(selectorRef, () => setOpen(false));

    useEffect(() => {
        setAppTheme(getAppTheme());
    }, []);

    const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = e.target.value;

        if (newTheme === theme) {
            setOpen(!isOpen);
            return;
        }

        // in theory shouldn't be possible, but check still
        if (newTheme === previousTheme) {
            setOpen(!isOpen);
            return;
        }

        setTheme(e.target.value);
        setAppTheme(e.target.value);
        setOpen(false);
    }

    const onOpen = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(!isOpen);
    }

    let spanClass = 'theme-select';
    spanClass += isOpen ? ' theme-select__opened' : ' theme-select__closed';

    const themes = themesList.map((elem: ITheme) => {
        if (theme === elem.value) {
            return (
                <div key={themeId + elem.value} className={'content--elem__first theme__' + elem.value} onClick={onOpen}>
                    <label htmlFor={themeId + elem.value}>
                        <input
                            type="radio"
                            name="theme"
                            value={elem.value}
                            id={themeId + elem.value}
                            disabled={true}
                            onChange={onThemeChange}
                            checked={theme === elem.value}/>
                        <span>{elem.label}</span>
                    </label>
                </div>
            );
        } else {
            return (<div key={themeId + elem.value} className={'theme__' + elem.value}>
                <label htmlFor={themeId + elem.value}>
                    <input
                        type="radio"
                        name="theme"
                        value={elem.value}
                        id={themeId + elem.value}
                        onChange={onThemeChange} />
                        <span>{elem.label}</span>
                </label>
            </div>)
        }
    });

    return (
        <div className='theme--container__relative' ref={selectorRef}>
            <div className='theme--container__absolute'>
                <div className={spanClass}>
                    <div>
                        <div className='theme-select--content' key={themeId}>
                            {themes}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThemeSelector;