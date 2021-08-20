import { FunctionComponent, Fragment } from 'preact';
import {} from 'preact/compat';
import { useState } from 'preact/hooks';

interface InputProps {
  initialValue?: string;
  label?: string;
  placeholder?: string;
  onChange: (input: string) => void;
  type?: string;
}

const Input: FunctionComponent<InputProps> = ({ initialValue, label, placeholder, onChange, type }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: any) => {
    console.log(e);
    const value = e.target.value;
    setValue(value);
    onChange(value);
  };

  return (
    <Fragment>
      <div className="text-xs text-gray-700 pl-1">{label}</div>
      <input
        type={type || 'text'}
        className="border p-4 w-full border-gray-200 text-gray-900 rounded-xl bg-gray-500 bg-opacity-40 appearance-none leading-tight focus:outline-none focus:shadow-outline text-sm"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </Fragment>
  );
};

export default Input;
