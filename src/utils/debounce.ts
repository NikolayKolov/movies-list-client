/* eslint-disable @typescript-eslint/no-explicit-any */
type CallbackFunction = (...args: any[]) => any;

const debounce = (callback: CallbackFunction, delay = 250) => {
    let timeoutId: number;

    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

export default debounce;