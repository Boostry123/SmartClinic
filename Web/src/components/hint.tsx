interface HintProps {
  text: string;
  color?: string;
}

const Hint = ({ text, color = "indigo" }: HintProps) => {
  return (
    <div>
      <p className={`text-sm text-${color}-500 italic`}>{text}</p>
    </div>
  );
};

export default Hint;
