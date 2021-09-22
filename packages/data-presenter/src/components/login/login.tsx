import { FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { UserContext } from '../../contexts/UserContext';
import Auth from '../../services/Auth';
import User from '../../types/User';
import Button from '../common/button';
import Input from '../common/input';

const Login: FunctionComponent = () => {
  const {  } = useContext(UserContext)
  const login = () => {
    console.log('login')
    chrome.runtime.sendMessage({ type: 'signIn' }, (user) => {

    })
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
