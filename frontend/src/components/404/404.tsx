import '../../styles/notfound.css';
import notfoundimg from './notfound.png';
import { Link } from 'react-router-dom';

export default function NotFound() {

    return (
        <div className="container">
            <img src={notfoundimg} alt="404 Error Page" className="error-image" />
            <Link to="/" className="home-button">
                Go Home
            </Link>
        </div>
    );
}