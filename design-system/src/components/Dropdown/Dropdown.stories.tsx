import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DropdownMenu } from "./Dropdown";
import { Select } from "../TextField/TextField";

const meta: Meta = {
  title: "Forms/Dropdown",
};
export default meta;

export const Demo: StoryObj = {
  render: () => (
    <div className="demo-row" style={{ alignItems: "flex-start" }}>
      <Select
        label="Simple select"
        options={["Choose an option", "North America", "Europe", "Asia Pacific"]}
      />
      <DropdownMenu
        groupTitle="Regions"
        options={[{ label: "North America" }, { label: "Europe" }, { label: "Asia Pacific" }]}
        activeLabel="North America"
        footerLabel="Manage regions…"
      />
    </div>
  ),
};
