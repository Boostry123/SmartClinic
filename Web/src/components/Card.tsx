import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ title, children, className = "", onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white 
        rounded-2xl 
        border border-slate-200/60 
        shadow-sm 
        p-5 md:p-6
        hover:shadow-md hover:border-indigo-100
        transition-all duration-300
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {title && <div className="mb-4">{title}</div>}
      {children}
    </div>
  );
};

export default Card;
