import React, { ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  color?: string
}

const Button: React.FC<ButtonProps> = ({onClick, children, disabled}) => {
  return (
    <button 
    className={`${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#8075FF] hover:bg-[#7265ff]"} text-white px-4 py-2 rounded-lg self-start transition-colors`}
    onClick={onClick}
    disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button;