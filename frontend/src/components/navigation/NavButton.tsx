import { useNavigate } from 'react-router-dom';
import '../../styles/login.css'
import '../../styles/buttons.css'

interface NavButtonProps {
    name: string;
    style: string;
    path: string;
}
/* Navigation Button
We can use this for any button that navigates to a different part of the app
    Props: 
    - name (string): the button label e.g. 'Login'
    - style (string): css styling for button e.g. 'login-button'
    - path (string): url path endpoint e.g. '/leaderboard'
*/
export default function NavButton({ name, style, path }: NavButtonProps) {
    const navigate = useNavigate();

    // TODO: AUTHENTICATION?
    const handleLogin = (e: any) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <button className={style} onClick={(e) => handleLogin(e)}>{name}</button>
    )
}