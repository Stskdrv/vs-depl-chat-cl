import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateOutlet = () =>  {
  const token = Cookies.get('token');
  const location = useLocation()

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  )
};

export default PrivateOutlet;
