import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Color",
  parameters: {
    docs: {
      description: {
        component: "Brand, neutral and semantic tokens. Values swap automatically between light and dark modes.",
      },
    },
  },
};
export default meta;

const swatches = [
  { name: "Primary", val: "--primary", bg: "var(--primary)" },
  { name: "Primary Soft", val: "--primary-soft-bg", bg: "var(--primary-soft-bg)" },
  { name: "Neutral Solid", val: "--neutral-solid-bg", bg: "var(--neutral-solid-bg)" },
  { name: "Sunken Surface", val: "--bg-sunken", bg: "var(--bg-sunken)" },
  { name: "Raised Surface", val: "--bg-raised", bg: "var(--bg-raised)" },
  { name: "Border Strong", val: "--border-strong", bg: "var(--border-strong)" },
  { name: "Success", val: "--success", bg: "var(--success)" },
  { name: "Danger", val: "--danger", bg: "var(--danger)" },
  { name: "Warning", val: "--warning", bg: "var(--warning)" },
  { name: "Gradient", val: "blue → purple", bg: "linear-gradient(135deg,#0B5FFF,#7C5CFF)" },
];

export const Tokens: StoryObj = {
  render: () => (
    <div className="card-demo">
      <div className="subgrid">
        {swatches.map((s) => (
          <div className="token-swatch" key={s.name}>
            <div className="fill" style={{ background: s.bg }} />
            <div className="meta">
              <div className="name">{s.name}</div>
              <div className="val">{s.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
