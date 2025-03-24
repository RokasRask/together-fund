import useLogout from '../Hooks/useLogout';
import '../Style/loader.scss';

export default function Logout() {

    useLogout();

    return (
        <div className='loader-container'>
        <div class="loader"></div>
        </div>
    );
}