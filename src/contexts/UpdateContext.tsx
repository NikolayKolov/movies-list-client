import React, { createContext, useState } from "react";
import { getMoviesLastUpdatedAt } from "../utils/moviesLS";

type UpdateContextValueType = string;
type UpdateContextInitUpdateType = boolean;
type UpdateContextStateObject = {
    value: UpdateContextValueType,
    initUpdate: UpdateContextInitUpdateType
}

type UpdateContextFunctionObject = {
    value?: UpdateContextValueType,
    initUpdate?: UpdateContextInitUpdateType
}

type UpdateContextSetValueType = (obj: UpdateContextFunctionObject) => void;

type UpdateContextPropsType = {
    children?: React.ReactNode
}

export const UpdateContextValueWrapper = createContext<UpdateContextValueType>('');
export const UpdateContextInitUpdateWrapper = createContext<UpdateContextInitUpdateType>(false);
export const UpdateContextSetValueWrapper = createContext<UpdateContextSetValueType | null>(null);

const UpdateContext = ({children}: UpdateContextPropsType) => {
    const initValue = getMoviesLastUpdatedAt() ?? '';
    const [update, setUpdate] = useState<UpdateContextStateObject>({
        value: initValue,
        initUpdate: false
    });

    const handleUpdate = (obj: { value?: UpdateContextValueType, initUpdate?: UpdateContextInitUpdateType }) => {
        setUpdate(prev => ({
            ...prev,
            ...obj
        }))
    }

    return (
        <UpdateContextSetValueWrapper.Provider value={handleUpdate}>
            <UpdateContextValueWrapper.Provider value={update.value}>
                <UpdateContextInitUpdateWrapper.Provider value={update.initUpdate}>
                    {children}
                </UpdateContextInitUpdateWrapper.Provider>
            </UpdateContextValueWrapper.Provider>
        </UpdateContextSetValueWrapper.Provider>
    );
}

export default UpdateContext;