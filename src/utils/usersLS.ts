const getUserJWT = () => {
    const loggedInUser = localStorage.getItem("userLoggedIn");
    const jwt = localStorage.getItem("jwt");

    return {
        username: loggedInUser,
        jwt
    }
}

const setUserJWT = (username: string, jwt: string) => {
    localStorage.setItem('userLoggedIn', username);
    localStorage.setItem("jwt", jwt);
}

const clearUserJWT = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("jwt");
}

export {
    getUserJWT,
    setUserJWT,
    clearUserJWT
}