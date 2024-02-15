import FacebookIcon from "../components/SVGIcons/Social/FacebookIcon";
import InstagramIcon from "../components/SVGIcons/Social/InstagramIcon";
import RedditIcon from "../components/SVGIcons/Social/RedditIcon";
import TwitterIcon from "../components/SVGIcons/Social/TwitterIcon";

const Footer = () => (
    <footer>
        <nav>
            <ul>
                <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                        <div className="icons">
                            <FacebookIcon />
                            <p>facebook</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <div className="icons">
                            <InstagramIcon />
                            <p>instagram</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="https://www.reddit.com/" target="_blank" rel="noopener noreferrer">
                        <div className="icons">
                            <RedditIcon />
                            <p>reddit</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                        <div className="icons">
                            <TwitterIcon />
                            <p>twitter</p>
                        </div>
                    </a>
                </li>
            </ul>
        </nav>
    </footer>
);

export default Footer;