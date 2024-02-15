import React, { useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";

const Header = React.memo(() => {
    useEffect(() => {
        const header = document.querySelector('header') as HTMLElement;

        const handleHeaderScroll = () => {
            if (window.scrollY > 30) {
                !header.classList.contains('header__small') && header.classList.add('header__small');
            } else {
                header.classList.contains('header__small') && header.classList.remove('header__small');
            }
        };

        window.addEventListener('scroll', handleHeaderScroll);

        if (window.scrollY > 30) {
            handleHeaderScroll();
        }

        return () => {
            window.removeEventListener('scroll', handleHeaderScroll);
        }
    }, []);

    return (
        <header>
            <Navigation />
        </header>
    );
});

export default Header;