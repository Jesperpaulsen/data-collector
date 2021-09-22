import { FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { UserContext } from '../../contexts/UserContext';
import Button from '../common/button';

const Login: FunctionComponent = () => {
  const {  } = useContext(UserContext)
  const login = () => {
    chrome.runtime.sendMessage({ type: 'signIn' })
  }

  return (
    <div className="w-full">
      <div className="text-6xl text-center pt-6">Data Collector</div>
      <div className="flex justify-center pt-14">
        <Button onClick={login}>Log In With Google</Button>
      </div>
    </div>
  );
};

export default Login;
