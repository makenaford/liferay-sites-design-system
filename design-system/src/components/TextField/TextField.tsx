import React from "react";
import "./TextField.css";
import { IconSearch } from "../icons";

export interface FieldWrapProps {
  label?: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
const FieldWrap = ({ label, help, error, children, style }: FieldWrapProps) => (
  <div className="field" style={style}>
    {label && <label>{label}</label>}
    {children}
    {help && !error && <span className="help">{help}</span>}
    {error && <span className="error">{error}</span>}
  </div>
);

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  help?: string;
  error?: string;
}
export const TextField = ({ label, help, error, className = "", style, ...rest }: TextFieldProps) => (
  <FieldWrap label={label} help={help} error={error} style={style}>
    <input className={["input", error ? "error" : "", className].filter(Boolean).join(" ")} {...rest} />
  </FieldWrap>
);

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  help?: string;
  error?: string;
}
export const TextArea = ({ label, help, error, className = "", style, ...rest }: TextAreaProps) => (
  <FieldWrap label={label} help={help} error={error} style={style}>
    <textarea className={["textarea", error ? "error" : "", className].filter(Boolean).join(" ")} {...rest} />
  </FieldWrap>
);

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}
export const Select = ({ label, options, className = "", ...rest }: SelectProps) => (
  <FieldWrap label={label}>
    <select className={["input", className].filter(Boolean).join(" ")} {...rest}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </FieldWrap>
);

export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  style?: React.CSSProperties;
}
export const SearchField = ({ className = "", style, ...rest }: SearchFieldProps) => (
  <div className="field search-box" style={style}>
    <IconSearch />
    <input className={["input", className].filter(Boolean).join(" ")} {...rest} />
  </div>
);
