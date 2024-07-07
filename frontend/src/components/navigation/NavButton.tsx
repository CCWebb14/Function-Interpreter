import { useNavigate } from 'react-router-dom';
import '../../styles/login-signup.css'
import '../../styles/buttons.css'

interface NavButtonProps {
    name: string;
    style: string;
    path?: string;
    onClick?: () => void;
}
/* Navigation Button
We can use this for any button that navigates to a different part of the app
    Props: 
    - name (string): the button label e.g. 'Login'
    - style (string): css styling for button e.g. 'login-button'
    - path (string): url path endpoint e.g. '/leaderboard'
*/
export default function NavButton({ name, style, path, onClick }: NavButtonProps) {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (onClick) {
            onClick();
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <div className={style} onClick={handleClick}>{name}</div>
    )
}