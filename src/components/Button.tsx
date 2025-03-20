import React, { ReactNode } from 'react';

interface ButtonProps {

  onClick?: () => void;

  children: ReactNode;

}

const Button: React.FC<ButtonProps> = ({onClick, children}) => {
  return (
    <button 
    className="bg-[#8075FF] hover:bg-[#7265ff] text-white px-4 py-2 rounded-lg self-start"
    onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;