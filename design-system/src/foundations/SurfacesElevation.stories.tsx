import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Surfaces & Elevation",
  parameters: {
    docs: {
      description: {
        component: "Page background layers and the glass-morphism card treatment used across the library.",
      },
    },
  },
};
export default meta;

export const Layers: StoryObj = {
  render: () => (
    <div
      className="card-demo"
    >
      <div className="demo-row">
        <div className="token-swatch" style={{ width: 160 }}>
          <div className="fill" style={{ background: "var(--bg)" }} />
          <div className="meta"><div className="name">Page BG</div></div>
        </div>
        <div className="token-swatch" style={{ width: 160 }}>
          <div className="fill" style={{ background: "var(--bg-raised)" }} />
          <div className="meta"><div className="name">Raised</div></div>
        </div>
        <div className="token-swatch" style={{ width: 160 }}>
          <div className="fill" style={{ background: "var(--bg-sunken)" }} />
          <div className="meta"><div className="name">Sunken</div></div>
        </div>
        <div className="surface glass">Glass</div>
      </div>
    </div>
  ),
};
