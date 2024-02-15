/**
 * Theme management
 * First check the local storage - if the user has set it, use this theme.
 * Otherwise, check the default theme in the index.html file.
 * If it is not set, check the system theme - if it is dark, set the theme to dark.
 * Otherwise, set it to light.
 * 
 * The theme is CSS3 and is managed by setting the data attribute data-theme on
 * the body HTML element.
 * It is set to default to 'dark' in the index.html file body element.
 * 
 * Every time the user changes a theme, it is set to local storage and the body element.
 */ 

const getThemeSystem = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return isDark ? 'dark' : 'light';
}

const getThemeLS = () => {
    return localStorage.getItem("theme");
}

const getAppTheme = () => {
    const lsTheme = getThemeLS();
    if (lsTheme) return lsTheme;

    const divRoot = document.body.querySelector('div#root') as HTMLDivElement;
    const bodyTheme = divRoot.dataset.theme;
    if (bodyTheme) return bodyTheme;

    const systemTheme = getThemeSystem();
    return systemTheme;
}

const setAppTheme = (theme: string): void => {
    localStorage.setItem("theme", theme);
    const divRoot = document.body.querySelector('div#root') as HTMLDivElement;
    divRoot.dataset.theme = theme;
}

export {
    getAppTheme,
    setAppTheme
}