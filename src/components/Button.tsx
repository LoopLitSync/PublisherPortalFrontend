interface ButtonProps {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button className="bg-[#8075FF] text-white px-4 py-2 rounded-lg">
      {text}
    </button>
  )
}

export default Button;