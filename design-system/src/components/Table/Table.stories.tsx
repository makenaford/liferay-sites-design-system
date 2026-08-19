import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DSTable } from "./Table";
import { Tag } from "../Labels/Labels";

const meta: Meta = {
  title: "Data & Content/Table",
};
export default meta;

export const Demo: StoryObj = {
  render: () => (
    <div className="card-demo" style={{ padding: 0, overflow: "hidden" }}>
      <DSTable
        columns={["Component", "Category", "Status", "Updated"]}
        rows={[
          ["Button", "Actions", <Tag variant="tonal">Stable</Tag>, "2 days ago"],
          ["Accordion", "Disclosure", <Tag variant="tonal">Stable</Tag>, "1 week ago"],
          ["Facets", "Navigation", <Tag variant="outline">Beta</Tag>, "3 weeks ago"],
          ["Resource Card", "Content", <Tag variant="tonal">Stable</Tag>, "Yesterday"],
        ]}
      />
    </div>
  ),
};
