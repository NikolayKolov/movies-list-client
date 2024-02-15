import React, { createContext, useState } from "react";
import { getUserJWT } from "../utils/usersLS";

type AuthenticationStateObject = {
    username: string,
    jwt: string,
}

type UpdateContextPropsType = {
    children?: React.ReactNode
}

export const AuthenticationContextWrapper = createContext<[
    AuthenticationStateObject,
    React.Dispatch<AuthenticationStateObject>] | []>([]);

const AuthenticationContext = ({children}: UpdateContextPropsType) => {
    const userJWTLS = getUserJWT();
    let initUserJWT = {
        username: '',
        jwt: ''
    };
    if (userJWTLS.jwt !== null && userJWTLS.username !== null) {
        initUserJWT = {
            username: userJWTLS.username,
            jwt: userJWTLS.jwt
        }
    }
    const [auth, setAuth] = useState<AuthenticationStateObject>(initUserJWT);

    return (
        <AuthenticationContextWrapper.Provider value={[auth, setAuth]}>
            {children}
        </AuthenticationContextWrapper.Provider>
    );
}

export default AuthenticationContext;