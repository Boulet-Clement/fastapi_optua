import { ReactNode } from "react";

interface Title1Props {
  children: ReactNode;
  className?: string;
}

export default function Title1({ children, className = "" }: Title1Props) {
  return (
    <h1 className={`text-2xl font-bold ${className}`}>
      {children}
    </h1>
  );
}
