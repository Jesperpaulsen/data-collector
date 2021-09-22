import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';
import Dashboard from './components/dashboard/dashboard';
import Login from './components/login/login';
import { UserContext } from './contexts/UserContext';

const Router: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  return currentUser ? <Dashboard /> : <Login />;
};

export default Router;
