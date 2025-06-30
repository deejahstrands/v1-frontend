import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "tertiary";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    icon,
    iconRight,
    className = "",
    children,
    asChild = false,
    ...props
  },
  ref
) {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles =
    variant === "primary"
      ? "bg-primary text-black hover:bg-primary/90 focus:ring-primary"
      : "bg-tertiary text-black hover:bg-tertiary/90 focus:ring-tertiary";

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    return React.cloneElement(child, {
      className: `${baseStyles} ${variantStyles} ${child.props.className || ""} ${className}`.trim(),
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
      {iconRight && <span className="ml-2 flex items-center">{iconRight}</span>}
    </button>
  );
}); 