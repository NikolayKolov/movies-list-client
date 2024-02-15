/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { AuthenticationContextWrapper } from "../contexts/AuthenticationContext";

type LoginModalProps = {
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    handleCloseLoginModal: (...args: any[]) => any;
    handleLogin: (...args: any[]) => any;
    handleLogout: (...args: any[]) => any;
}

const LoginModal = (props: LoginModalProps) => {
    const { status, message = '', handleLogin, handleLogout, handleCloseLoginModal } = props;
    const [auth, ] = useContext(AuthenticationContextWrapper);

    const isLoggedIn = !!auth?.username;

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoggedIn) handleLogout && handleLogout(e);
        else handleLogin && handleLogin(e);
    }

    let messageToDisplay = '';
    
    if (isLoggedIn) messageToDisplay = `Welcome, ${auth?.username}, you have successfully logged in`
    else messageToDisplay = message;

    return (
        <form className="login-modal" onSubmit={handleSubmit}>
            {
                isLoggedIn ?
                    null:
                    <>
                        <div className="form-row">
                            <label htmlFor="username">Username</label>
                            <input id='username' name='username' type='text' placeholder="Enter username" disabled={status === 'loading'} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="password">Password</label>
                            <input id='password' name='password' type='password' placeholder="Enter password" disabled={status === 'loading'} />
                        </div>
                    </>
            }
            {
                messageToDisplay &&
                <div className={status === 'error'? 'form-row form-row__error' : 'form-row'}>
                    {messageToDisplay}
                </div>
            }
            <div className="login--actions">
                <button onClick={handleCloseLoginModal} disabled={status === 'loading'}>
                    {
                        status === 'success' ? 'Close' : 'Cancel'
                    }
                </button>
                <button className="button__login" type="submit" disabled={status === 'loading'}>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </form>
    );
}

export default LoginModal;