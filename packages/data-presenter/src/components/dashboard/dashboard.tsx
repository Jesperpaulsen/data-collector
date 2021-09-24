import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';
import { UserContext } from '../../contexts/UserContext';

const Dashboard: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="w-full h-screen relative">
      <div className="text-2xl pt-10 pl-5">
        <div>Good evening, {currentUser?.name}!</div>
        <div>We're currently collecting your data.</div>
      </div>
      <div className="bottom-1/2 absolute w-full">
        <div className="flex justify-center">
          <div className="text-center px-6">
            <div className="text-6xl font-medium">48 GB</div>
            <div className="text-xs font-light">Amount of data collected today</div>
          </div>
          <div className="text-center px-6">
            <div className="text-6xl font-medium">48 GB</div>
            <div className="text-xs font-light">Amount of data collected today</div>
          </div>
          <div className="text-center px-6">
            <div className="text-6xl font-medium">48 GB</div>
            <div className="text-xs font-light">Amount of data collected today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
