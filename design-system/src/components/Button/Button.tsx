import React from "react";
import "./Button.css";

export type ButtonColor = "primary" | "neutral";
export type ButtonStyle = "solid" | "outline" | "rounded";
export type ButtonSize = "lg" | "md" | "sm";
/** Force-render a pseudo-state for documentation/screenshots. Leave undefined for real interactive states. */
export type ButtonForceState = "hover" | "focus" | "active";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonStyle;
  size?: ButtonSize;
  forceState?: ButtonForceState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = ({
  color = "primary",
  variant = "solid",
  size = "md",
  forceState,
  leftIcon,
  rightIcon,
  className = "",
  children,
  ...rest
}: ButtonProps) => {
  const classes = [
    "btn",
    `btn-${color}`,
    `btn-${variant}`,
    `btn-${size}`,
    forceState ? `force-${forceState}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
}

export const IconButton = ({ className = "", children, ...rest }: IconButtonProps) => (
  <button className={["btn", "btn-icon", className].filter(Boolean).join(" ")} {...rest}>
    {children}
  </button>
);

export const HelpTextButton = ({ className = "", children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={["btn-help", className].filter(Boolean).join(" ")} {...rest}>
    {children}
  </button>
);
