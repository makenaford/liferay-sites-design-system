import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Breadcrumb, Tabs, PillTabs, NumberTabs, TOC } from "./Navigation";

const meta: Meta = {
  title: "Navigation/Overview",
};
export default meta;

export const Breadcrumbs: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Breadcrumb items={[{ label: "Library", href: "#" }, { label: "Components" }]} />
      <Breadcrumb items={[{ label: "Library", href: "#" }, { label: "Components", href: "#" }, { label: "Buttons" }]} />
      <Breadcrumb
        items={[
          { label: "Library", href: "#" },
          { label: "Foundations", href: "#" },
          { label: "Color", href: "#" },
          { label: "Primary" },
        ]}
      />
    </div>
  ),
};

export const TabsDemo: StoryObj = {
  name: "Tabs",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Tabs
        tabs={[
          { label: "Overview", content: "A short description of the component lives here, switching per tab." },
          { label: "Usage", content: "Guidance on when and how to use this pattern in product." },
          { label: "Accessibility", content: "Keyboard and screen-reader behaviour notes." },
        ]}
      />
      <div className="demo-row">
        <PillTabs options={["Monthly", "Yearly"]} />
        <NumberTabs count={3} />
      </div>
    </div>
  ),
};

export const TableOfContents: StoryObj = {
  render: () => (
    <TOC
      style={{ maxWidth: 220 }}
      items={[
        { label: "Introduction" },
        { label: "Getting started" },
        { label: "Design tokens" },
        { label: "Component index" },
        { label: "Accessibility" },
      ]}
      activeIndex={0}
    />
  ),
};
