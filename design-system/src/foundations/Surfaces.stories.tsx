import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Data & Content/Surfaces (Cards)",
  parameters: {
    docs: {
      description: {
        component: "The six surface styles used to build cards and containers throughout the library.",
      },
    },
  },
};
export default meta;

export const Demo: StoryObj = {
  render: () => (
    <div className="demo-row">
      <div className="surface glass">Glass</div>
      <div className="surface nobg">No BG</div>
      <div className="surface blue">Blue</div>
      <div className="surface grey">Grey</div>
      <div className="surface gradblue">Gradient Blue</div>
      <div className="surface gradpurple">Gradient Purple</div>
    </div>
  ),
};
