import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import personImg from '../assets/person.png';
import Cookies from 'js-cookie';

const Header = () => {
    const navigate = useNavigate();

    const name = Cookies.get('name');

    const handleLogOut = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <div className="h-[60px] w-[100%] bg-blue-500 rounded-m flex items-center">
            <div className="flex-[10] text-2xl text-white flex align-middle gap-3 ml-6">
                <img src={logo} alt="logo" className="h-[30px] w-[30px]" />
                Chatio
            </div>
            <div className="flex-[1] text-white flex items-center gap-2">
                <img className="h-[35px] border-2 border-grey-600 rounded-full object-cover" src={personImg} alt="preson" />
                <span className="font-normal">{name}</span>
            </div>
            <div className="flex-[1] text-white items-center">
                <button
                    className="w-[80px] h-[40px] bg-blue-600 border-2 border-gray-300 active:bg-blue-800 rounded-xl text-white"
                    onClick={handleLogOut}
                >
                   Logout
                </button>
            </div>
        </div>
    )
}

export default Header;