import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Checkbox, Radio } from "./Selection";

const meta: Meta = {
  title: "Forms/Checkbox & Radio",
};
export default meta;

export const Checkboxes: StoryObj = {
  render: () => (
    <div className="demo-row">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Large" size="lg" defaultChecked />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
};

export const Radios: StoryObj = {
  render: () => (
    <div className="demo-row">
      <Radio name="r1" label="Option A" />
      <Radio name="r1" label="Option B" defaultChecked />
      <Radio name="r2" label="Large" size="lg" defaultChecked />
      <Radio label="Disabled" disabled />
    </div>
  ),
};
