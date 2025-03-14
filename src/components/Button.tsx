interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button 
    className="bg-[#8075FF] text-white px-4 py-2 rounded-lg self-start"
    onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button;