import React, { useState } from "react";
import "./Dropdown.css";
import { IconCheck } from "../icons";

export interface DropdownOption {
  label: string;
}

export interface DropdownMenuProps {
  groupTitle?: string;
  options: DropdownOption[];
  activeLabel?: string;
  footerLabel?: string;
  searchPlaceholder?: string;
  onSelect?: (label: string) => void;
}

export const DropdownMenu = ({
  groupTitle,
  options,
  activeLabel,
  footerLabel,
  searchPlaceholder = "Search…",
  onSelect,
}: DropdownMenuProps) => {
  const [query, setQuery] = useState("");
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="dropdown-menu">
      <input
        className="input dropdown-search"
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {groupTitle && <div className="dropdown-group-title">{groupTitle}</div>}
      {filtered.map((o) => (
        <div
          key={o.label}
          className={["dropdown-item", o.label === activeLabel ? "active" : ""].filter(Boolean).join(" ")}
          onClick={() => onSelect?.(o.label)}
        >
          {o.label}
          {o.label === activeLabel && <IconCheck width={14} height={14} />}
        </div>
      ))}
      {footerLabel && (
        <>
          <div className="dropdown-divider" />
          <div className="dropdown-item">{footerLabel}</div>
        </>
      )}
    </div>
  );
};
