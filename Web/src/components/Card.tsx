// CardComponent.tsx
import React from "react";
import type { ReactNode } from "react";

interface CardComponentProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${className ?? ""}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{children}</p>
    </div>
  );
};

export default CardComponent;
