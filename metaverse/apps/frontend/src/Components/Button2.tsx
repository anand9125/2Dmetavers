interface ButtonProps {
    children: React.ReactNode; // Accepts children instead of label
    onClick: () => void;
    className?: string;
  }
  
  const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
      <button onClick={onClick} className={className}>
        {children} {/* Now renders children */}
      </button>
    );
  };
  
  export default Button;
  