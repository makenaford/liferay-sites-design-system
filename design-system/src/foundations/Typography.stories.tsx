import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    docs: {
      description: { component: "Source Sans 3 across all weights — display, heading and body roles." },
    },
  },
};
export default meta;

const Row = ({ label, style, children }: { label: string; style: React.CSSProperties; children: React.ReactNode }) => (
  <div>
    <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
      {label}
    </div>
    <div style={style}>{children}</div>
  </div>
);

export const Scale: StoryObj = {
  render: () => (
    <div
      className="card-demo"
    >
      <Row label="Display / 40 / 700" style={{ fontSize: 40, fontWeight: 700 }}>Build with clarity</Row>
      <div className="divider-h" />
      <Row label="Heading / 24 / 700" style={{ fontSize: 24, fontWeight: 700 }}>Section heading text</Row>
      <div className="divider-h" />
      <Row label="Action / Button Large / 21 / 600" style={{ fontSize: 21, fontWeight: 600 }}>Button label text</Row>
      <div className="divider-h" />
      <Row label="Body / 16 / 400" style={{ fontSize: 16, fontWeight: 400, color: "var(--text-secondary)" }}>
        The quick brown fox jumps over the lazy dog. 0123456789
      </Row>
      <div className="divider-h" />
      <Row label="Caption / 12 / 500" style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)" }}>
        Caption / meta / helper text
      </Row>
    </div>
  ),
};
