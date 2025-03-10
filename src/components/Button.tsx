import React from "react";
// npm i styled-components


interface ButtonProps {
  label: string;
  onClick: () => void;
}



const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;