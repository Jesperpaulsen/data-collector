import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import Button from '../common/button';
import Input from '../common/input';

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full">
      <div className="text-6xl text-center">Waste Collector</div>
      <div className="flex justify-center pt-10">
        <div className="w-56">
          <Input label="Email" placeholder="Enter your email" onChange={setEmail} />
        </div>
      </div>
      <div className="flex justify-center pt-2">
        <div className="w-56">
          <Input label="Password" placeholder="Enter your password" type="password" onChange={setPassword} />
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <Button onClick={() => console.log('Log in')}>Log In</Button>
      </div>
    </div>
  );
};

export default Login;
