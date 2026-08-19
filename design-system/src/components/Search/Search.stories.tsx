import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SearchField } from "../TextField/TextField";
import { SearchResults } from "./Search";

const meta: Meta = {
  title: "Forms/Search",
};
export default meta;

export const Demo: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="demo-row">
        <SearchField placeholder="Search the library…" style={{ minWidth: 320 }} />
      </div>
      <SearchResults
        style={{ maxWidth: 520 }}
        focusedIndex={0}
        items={[
          { title: "Resource card", desc: "Composable card for events, blog posts and downloads." },
          { title: "Button", desc: "Primary and neutral actions in three sizes." },
          { title: "Accordion", desc: "Expand and collapse grouped content." },
        ]}
      />
    </div>
  ),
};
