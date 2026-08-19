import React from "react";

export interface DSTableProps {
  columns: string[];
  rows: React.ReactNode[][];
}

/** Uses the shared `.ds-table` styles defined in src/styles/base.css */
export const DSTable = ({ columns, rows }: DSTableProps) => (
  <table className="ds-table">
    <thead>
      <tr>
        {columns.map((c) => (
          <th key={c}>{c}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
