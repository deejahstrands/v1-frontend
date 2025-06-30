import React from "react";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className = "", ...props }: SectionContainerProps) {
  return (
    <section
      className={`max-w-7xl mx-auto px-4 sm:px-6 xl:px-10 ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
} 