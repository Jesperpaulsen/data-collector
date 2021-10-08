import { FunctionComponent } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import { UserContext } from '../../contexts/UserContext';
import UsageDisplay from './UsageDisplay';
import Greeting from '../layout/Greeting';

const Dashboard: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="w-full h-screen relative">
      <Greeting name={currentUser?.name} />
      <div className="bottom-1/2 absolute w-full">
        <UsageDisplay />
      </div>
    </div>
  );
};

export default Dashboard;
