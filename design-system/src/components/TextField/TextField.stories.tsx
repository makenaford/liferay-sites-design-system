import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TextField, TextArea } from "./TextField";

const meta: Meta = {
  title: "Forms/Text Fields",
};
export default meta;

export const States: StoryObj = {
  render: () => (
    <>
      <div className="demo-row">
        <TextField label="Label" placeholder="Placeholder text" />
        <TextField label="Filled" defaultValue="Filled value" />
        <TextField label="Disabled" defaultValue="Can't edit this" disabled />
        <TextField label="Error" defaultValue="Invalid entry" error="This field is required" />
      </div>
      <div className="demo-row">
        <TextArea label="Message" placeholder="Write a longer note…" style={{ minWidth: 320 }} />
      </div>
    </>
  ),
};
