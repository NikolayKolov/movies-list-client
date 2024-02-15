import { useEffect } from "react";

const ScrollToTop = () => {
    useEffect(() => {
        const body = document.querySelector('div#root');
        if (body === null) return;

        const scrollToTopEl = document.createElement('div');
        scrollToTopEl.classList.add('scroll-to-top');
        body.append(scrollToTopEl);
        const addedEl = document.querySelector('div.scroll-to-top');
        if (addedEl === null) return;

        const scrollToTop = () => {
            window.scrollTo(0, 0);
        }

        addedEl.addEventListener('click', scrollToTop);

        const handlePageScroll = () => {
            if (window.scrollY > 50) {
                addedEl.classList.toggle('scroll-to-top__show', true);
            } else {
                addedEl.classList.toggle('scroll-to-top__show', false);
            }
        };

        window.addEventListener('scroll', handlePageScroll);

        if (window.scrollY > 50) {
            handlePageScroll();
        }

        return () => {
            window.removeEventListener('scroll', handlePageScroll);
            addedEl.remove();
        }
    }, []);

    return (
        null
    )
}

export default ScrollToTop;