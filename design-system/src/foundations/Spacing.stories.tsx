import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Spacing & Radius",
  parameters: {
    docs: { description: { component: "4px base spacing scale and a four-step corner radius scale." } },
  },
};
export default meta;

const spacingSteps = [4, 8, 12, 16, 24, 32, 48];
const radiusSteps: [string, string][] = [
  ["4", "var(--radius-xs)"],
  ["6", "var(--radius-sm)"],
  ["8", "var(--radius-md)"],
  ["12", "var(--radius-lg)"],
  ["Pill", "var(--radius-pill)"],
];

export const Scale: StoryObj = {
  render: () => (
    <div
      className="card-demo"
    >
      <div className="demo-row">
        <span className="demo-label">Spacing scale</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          {spacingSteps.map((s) => (
            <div key={s} style={{ width: s, height: s, background: "var(--primary)" }} />
          ))}
        </div>
      </div>
      <div className="demo-row">
        <span className="demo-label">Radius scale</span>
        {radiusSteps.map(([label, radius]) => (
          <div
            key={label}
            style={{
              width: 60,
              height: 60,
              borderRadius: radius,
              background: "var(--bg-sunken)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--text-tertiary)",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  ),
};
