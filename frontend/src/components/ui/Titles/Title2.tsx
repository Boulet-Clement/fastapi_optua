import { ReactNode } from "react";

interface Title2Props {
  children: ReactNode;
  className?: string;
}

export default function Title2({ children, className = "" }: Title2Props) {
  return (
    <h2 className={`text-xl font-bold ${className}`}>
      {children}
    </h2>
  );
}
