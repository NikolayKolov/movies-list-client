import React from "react";

interface ISplashScreenProps {
    message?: string;
    isError?: boolean;
}

const SplashScreen = ({
        message = "Loading site data, please wait ...",
        isError = false
    }: ISplashScreenProps) => {
    
    let loadingClassName = 'splash-screen--animation';
    let messageClassName = 'splash-screen--message';

    if (isError) {
        loadingClassName += ' splash-screen--animation__error';
        messageClassName += ' splash-screen--message__error';
    }

    return (
        <div className="splash-screen">
            <div className="splash-screen--center">
                <div className={loadingClassName}>
                    <div>
                        <span className="animation__pulse"></span>
                    </div>
                    <div>
                        <span className="animation__pulse"></span>
                    </div>
                    <div>
                        <span className="animation__pulse"></span>
                    </div>
                    <div>
                        <span className="animation__pulse"></span>
                    </div>
                    <div>
                        <span className="animation__pulse"></span>
                    </div>
                </div>
                <p className={messageClassName}>
                    {message}
                </p>
            </div>
        </div>
    );
}

export default SplashScreen;