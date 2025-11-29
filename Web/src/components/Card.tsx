import React from "react";

interface CardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const Card = ({ title, children, className = "" }: CardProps) => {
  return (
    <div
      className={`
        bg-white 
        rounded-2xl 
        border border-slate-200 
        shadow-sm 
        p-6 md:p-8
        hover:shadow-md 
        transition-shadow duration-300
        ${className}
      `}
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
