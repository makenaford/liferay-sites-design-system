import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Data & Content/Divider, Aspect Ratio & Focus",
};
export default meta;

export const Demo: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="demo-row">
        <span className="demo-label">Divider</span>
        <div style={{ flex: 1, minWidth: 200 }}><div className="divider-h" /></div>
        <div className="divider-v" />
        <div style={{ flex: 1, minWidth: 200 }}><div className="divider-gradient" /></div>
      </div>
      <div className="demo-row">
        <span className="demo-label">Aspect ratio</span>
        <div className="aspect" style={{ width: 160, aspectRatio: "16/9" }}>16:9</div>
        <div className="aspect" style={{ width: 120, aspectRatio: "1/1" }}>1:1</div>
        <div className="aspect" style={{ width: 100, aspectRatio: "3/4" }}>3:4</div>
      </div>
      <div className="demo-row">
        <span className="demo-label">Focus ring</span>
        <div className="focus-demo">Idle</div>
        <div className="focus-demo ring">Focused</div>
      </div>
    </div>
  ),
};
