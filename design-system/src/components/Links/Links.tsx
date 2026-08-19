import React from "react";
import "./Links.css";
import { IconArrowRight } from "../icons";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "neutral" | "visited";
  disabled?: boolean;
}
export const Link = ({ variant = "primary", disabled, className = "", children, ...rest }: LinkProps) => (
  <a
    className={["link", variant !== "primary" ? variant : "", className].filter(Boolean).join(" ")}
    aria-disabled={disabled || undefined}
    {...rest}
  >
    {children}
  </a>
);

export const LinkInline = ({ className = "", children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={["link-inline", className].filter(Boolean).join(" ")} {...rest}>
    {children}
    <IconArrowRight />
  </a>
);

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}

/** Simple pagination with first/last, prev/next and a collapsed middle range. */
export const Pagination = ({ page, pageCount, onPageChange }: PaginationProps) => {
  const go = (p: number) => onPageChange?.(Math.min(Math.max(p, 1), pageCount));
  const pages = [1, 2, 3];

  return (
    <div className="pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => go(page - 1)}>
        ‹ Prev
      </button>
      {pages.map((p) => (
        <button key={p} className={["page-btn", p === page ? "active" : ""].filter(Boolean).join(" ")} onClick={() => go(p)}>
          {p}
        </button>
      ))}
      <button className="page-btn" disabled>…</button>
      <button className="page-btn" onClick={() => go(pageCount)}>
        {pageCount}
      </button>
      <button className="page-btn" disabled={page >= pageCount} onClick={() => go(page + 1)}>
        Next ›
      </button>
    </div>
  );
};
