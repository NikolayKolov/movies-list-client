import React, { useContext } from "react";
import { AuthenticationContextWrapper } from "../../contexts/AuthenticationContext";

type AuthPageProps = {
    children: React.ReactNode
}

const AuthPage = ({children}: AuthPageProps) => {
    const [auth,] = useContext(AuthenticationContextWrapper);
    const isUserLoggedIn = !!auth?.username;

    if (!isUserLoggedIn) return (
        <div className="not-found">
            Please log in to see content
        </div>
    );

    return (
        <>
            {children}
        </>
    );
}

export default AuthPage;