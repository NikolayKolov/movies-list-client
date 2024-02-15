import { useRef } from 'react';

export default function usePrevious<T>(value: T, different = false): T | undefined {
    // initialise the ref with previous and current values
    const ref = useRef({
        value: value,
        prev: <T | undefined> undefined,
    });

    const current = ref.current.value;

    // If different flag is set, check if passed value
    // is different from previous and only then update
    // Don't use for objects

    if (different) {
        if (value !== current) {
            ref.current = {
                value: value,
                prev: current,
            };
        }
    } else {
        ref.current = {
            value: value,
            prev: current,
        };
    }

    // return the previous value only
    return ref.current.prev;
}