import React, { useContext } from "react";
import { AuthenticationContextWrapper } from "../../contexts/AuthenticationContext";

type AuthComponentProps = {
    children: React.ReactNode
}

const AuthComponent = ({children}: AuthComponentProps) => {
    const [auth,] = useContext(AuthenticationContextWrapper);
    const isUserLoggedIn = !!auth?.username;

    if (!isUserLoggedIn) return null;

    return (
        <>
            {children}
        </>
    );
}

export default AuthComponent;