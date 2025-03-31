interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ id, type, value, onChange, className, placeholder }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border rounded ${className}`}
      placeholder={placeholder}
    />
  );
};

export default Input;
