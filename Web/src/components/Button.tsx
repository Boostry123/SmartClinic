interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  onClick?: () => void;
  className?: string;
  color?: "indigo" | "gray" | "red";
  disabled?: boolean;
}

const Button = ({
  type = "button",
  text,
  onClick,
  className = "",
  color = "indigo",
  disabled = false,
}: ButtonProps) => {
  // Map colors to specific Tailwind classes
  const colorClasses = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    gray: "bg-gray-600 hover:bg-gray-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  const baseStyles =
    "text-white transition-colors font-semibold py-2 px-4 rounded";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${colorClasses[color]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default Button;
