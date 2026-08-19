import React from "react";
import "./Labels.css";

export type ChipState = "default" | "selected" | "focused" | "disabled" | "dragged";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  state?: ChipState;
}
export const Chip = ({ state = "default", className = "", children, ...rest }: ChipProps) => (
  <span
    className={["chip", className].filter(Boolean).join(" ")}
    data-state={state === "default" ? undefined : state}
    {...rest}
  >
    {children}
  </span>
);

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "tonal" | "outline";
  size?: "md" | "lg";
}
export const Tag = ({ variant = "tonal", size = "md", className = "", children, ...rest }: TagProps) => (
  <span
    className={["tag", `tag-${variant}`, size === "lg" ? "tag-lg" : "", className].filter(Boolean).join(" ")}
    {...rest}
  >
    {children}
  </span>
);

export const Badge = ({ className = "", children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={["badge", className].filter(Boolean).join(" ")} {...rest}>
    {children}
  </span>
);

export interface LabelCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "tonal" | "outline" | "gradient";
  size?: "sm" | "md" | "lg";
}
export const LabelCTA = ({ variant = "tonal", size = "md", className = "", children, ...rest }: LabelCTAProps) => (
  <button
    className={["label-cta", `label-cta-${size}`, `label-cta-${variant}`, className].filter(Boolean).join(" ")}
    {...rest}
  >
    {children}
  </button>
);
