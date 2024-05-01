import './App.css'
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Messenger from './pages/messenger/Messenger';
import PrivateOutlet from './utils/PrivateOutlet';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '*',
    element: <PrivateOutlet />,
    children: [
      {
        index: true,
        element:  <Messenger />
      }
    ]
  },
  {
    path: '/messenger',
    element:  <Messenger />
  },
])

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App;
