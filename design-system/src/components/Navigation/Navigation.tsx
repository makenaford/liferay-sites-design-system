import React, { useState } from "react";
import "./Navigation.css";

/* ---------------- Breadcrumb ---------------- */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="breadcrumb">
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <React.Fragment key={item.label}>
          {i > 0 && <span className="sep">/</span>}
          {isLast || !item.href ? (
            <span className="current">{item.label}</span>
          ) : (
            <a href={item.href}>{item.label}</a>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

/* ---------------- Tabs (underline) ---------------- */
export interface TabItem {
  label: string;
  content: React.ReactNode;
}
export const Tabs = ({ tabs, defaultIndex = 0 }: { tabs: TabItem[]; defaultIndex?: number }) => {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={["tab", i === active ? "active" : ""].filter(Boolean).join(" ")}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div key={tab.label} className={["tab-panel", i === active ? "active" : ""].filter(Boolean).join(" ")}>
          {tab.content}
        </div>
      ))}
    </div>
  );
};

/* ---------------- Pill tabs ---------------- */
export const PillTabs = ({ options, defaultIndex = 0 }: { options: string[]; defaultIndex?: number }) => {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div className="pill-tabs">
      {options.map((opt, i) => (
        <button
          key={opt}
          className={["pill-tab", i === active ? "active" : ""].filter(Boolean).join(" ")}
          onClick={() => setActive(i)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

/* ---------------- Number tabs ---------------- */
export const NumberTabs = ({ count, defaultIndex = 0 }: { count: number; defaultIndex?: number }) => {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div className="number-tabs">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={["number-tab", i === active ? "active" : ""].filter(Boolean).join(" ")}
          onClick={() => setActive(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

/* ---------------- Table of contents ---------------- */
export interface TocItem {
  label: string;
  href?: string;
}
export const TOC = ({ items, activeIndex = 0, style }: { items: TocItem[]; activeIndex?: number; style?: React.CSSProperties }) => (
  <nav className="toc" style={style}>
    {items.map((item, i) => (
      <a key={item.label} href={item.href ?? "#"} className={i === activeIndex ? "active" : ""}>
        {item.label}
      </a>
    ))}
  </nav>
);
