import { FunctionComponent } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import { UserContext } from '../../contexts/UserContext';
import UsageDisplay from './UsageDisplay';
import Greeting from '../layout/Greeting';
import Button from '../common/Button';
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES';

const Dashboard: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);

  const resetCounter = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_RESET_COUNTER })
  }

  return (
    <div className="w-full h-screen relative">
      <Greeting name={currentUser?.name} />
      <div className="bottom-1/2 absolute w-full">
        <UsageDisplay />
      </div>
      <div className="flex justify-center">
        <Button onClick={resetCounter}>Reset counter</Button>
      </div>
    </div>
  );
};

export default Dashboard;
