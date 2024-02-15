import React, { useContext, useRef, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import linksList from "../../data/LinksList.json";
import ThemeSelector from "./ThemeSelector";
import Modal from "../Modal/Modal";
import LoginModal from "../LoginModal";
//import delay from "../../utils/delay";
import { setUserJWT, clearUserJWT } from "../../utils/usersLS";
import { AuthenticationContextWrapper } from "../../contexts/AuthenticationContext";
import AuthComponent from "../AuthComponents/AuthComponent";

const Navigation = () => {
    const [openLoginModal, setLoginModal] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const chBoxRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [auth, setAuth] = useContext(AuthenticationContextWrapper);
    const isLoggedIn = !!auth?.username;

    // Close the mobile menu if it is opened
    // Otherwise react router will change the page,
    // but it will not be visible from under the mobile menu
    const handleNavigate = () => {
        if (chBoxRef.current!.checked) {
            chBoxRef.current?.click();
        }
    }

    const handleAction = (e: React.SyntheticEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!openLoginModal) setLoginModal(true);
    }

    const handleCloseModal = (e: React.SyntheticEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setLoginModal(false);
        setLoginState('idle');
        setLoginMessage('');
    }

    const handleLogoClick = (e: React.SyntheticEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/');
    }

    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setLoginState('loading');
        setLoginMessage('Authenticating, please wait');
        const username = e.target.username.value;
        const password = e.target.password.value;
        const requestData = new FormData();
        requestData.append('username', username);
        requestData.append('password', password);
        try {
            const loginResult = await fetch('/api/users/login', {
                method: "POST",
                body: requestData
            });
            // for testing purposes
            //await delay(3000);
            const resultJSON = await (loginResult as Response).json();
            if (!loginResult.ok) {
                setLoginState('error');
                setLoginMessage(resultJSON.error);
            } else {
                setLoginState('success');
                setLoginMessage('');
                setUserJWT(username, resultJSON.jwt);
                setAuth && setAuth({username,jwt:resultJSON.jwt});
            }
        } catch(e) {
            setLoginState('error');
            setLoginMessage('A network error occured, please try again later');
        }
    }

    const handleLogOut = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        clearUserJWT();
        setAuth && setAuth({ username: '', jwt: ''});
    }

    return (
        <>
            <Modal
                title={isLoggedIn? "Logout" : "Login"}
                show={openLoginModal}
                onClose={handleCloseModal}
                hideOnClickOutside={loginState !== 'loading'}>
                <LoginModal
                    status={loginState}
                    message={loginMessage}
                    handleCloseLoginModal={handleCloseModal}
                    handleLogin={handleLogin}
                    handleLogout={handleLogOut} />
            </Modal>
            <div className="header--container">
                <span className="header--logo" onClick={handleLogoClick}>Movies</span>
                <div className="header--container__right">
                    <ThemeSelector />
                    <nav className="links">
                        <input type="checkbox" className="hamburger-button--chbox" id="hamburger-btn" ref={chBoxRef} />
                        <label className="hamburger-button" htmlFor="hamburger-btn">
                            <span className="hamburger-icon">
                                <span className="hamburger--line"></span>
                            </span>
                        </label>
                        <ul>
                            {
                                linksList.map((link) => {
                                    let linkCssClass = 'header--link__normal';
                                    if (link?.styling === 'action') {
                                        linkCssClass = 'header--link__special';
                                    }
                                    const displayLink = (
                                        <li key={link.href}>
                                            <NavLink
                                                to={link.href}
                                                onClick={link?.styling === 'action'? handleAction : handleNavigate}
                                                className={({ isActive }) => {
                                                    return isActive ?
                                                        linkCssClass + " header--link__selected" : 
                                                        linkCssClass;
                                                }}>
                                                {
                                                    link.href === 'auth' ?
                                                        isLoggedIn ? "log out" : "log in" :
                                                        link.text
                                                }
                                            </NavLink>
                                        </li>
                                    );
                                    if (link.visibilityGuest) {
                                        return (
                                            displayLink
                                        );
                                    } else {
                                        return (
                                            <AuthComponent key={link.href}>
                                                {displayLink}
                                            </AuthComponent>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )

}

export default Navigation;