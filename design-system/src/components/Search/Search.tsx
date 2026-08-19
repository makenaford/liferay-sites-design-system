import React from "react";
import "./Search.css";

export interface SearchResultItem {
  title: string;
  desc: string;
}

export interface SearchResultsProps {
  items: SearchResultItem[];
  focusedIndex?: number;
  style?: React.CSSProperties;
}

export const SearchResults = ({ items, focusedIndex, style }: SearchResultsProps) => (
  <div style={style}>
    {items.map((item, i) => (
      <div key={item.title} className={["search-result", i === focusedIndex ? "focus" : ""].filter(Boolean).join(" ")}>
        <div className="title">{item.title}</div>
        <div className="desc">{item.desc}</div>
      </div>
    ))}
  </div>
);
