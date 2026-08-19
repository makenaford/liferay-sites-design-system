import React from "react";
import "./Selection.css";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "md" | "lg";
  indeterminate?: boolean;
  label?: React.ReactNode;
}
export const Checkbox = ({ size = "md", indeterminate, disabled, label, className = "", ...rest }: CheckboxProps) => (
  <label
    className={["checkbox", size === "lg" ? "lg" : "", disabled ? "disabled" : "", className].filter(Boolean).join(" ")}
  >
    {!indeterminate && <input type="checkbox" disabled={disabled} {...rest} />}
    <span className={["box", indeterminate ? "indeterminate" : ""].filter(Boolean).join(" ")} />
    {label}
  </label>
);

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "md" | "lg";
  label?: React.ReactNode;
}
export const Radio = ({ size = "md", disabled, label, className = "", ...rest }: RadioProps) => (
  <label
    className={["radio", size === "lg" ? "lg" : "", disabled ? "disabled" : "", className].filter(Boolean).join(" ")}
  >
    <input type="radio" disabled={disabled} {...rest} />
    <span className="circle" />
    {label}
  </label>
);
