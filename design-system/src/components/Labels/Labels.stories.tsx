import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Chip, Tag, Badge, LabelCTA } from "./Labels";

const meta: Meta = {
  title: "Actions/Chips, Tags & Labels",
};
export default meta;

export const AllChipStates: StoryObj = {
  render: () => (
    <div className="demo-row">
      <Chip>Default</Chip>
      <Chip state="selected">Selected</Chip>
      <Chip state="focused">Focused</Chip>
      <Chip state="disabled">Disabled</Chip>
      <Chip state="dragged">Dragging</Chip>
    </div>
  ),
};

export const TagsAndBadge: StoryObj = {
  render: () => (
    <div className="demo-row">
      <Tag variant="tonal">Neutral tonal</Tag>
      <Tag variant="outline">Neutral outline</Tag>
      <Tag variant="tonal" size="lg">Large tonal</Tag>
      <Badge>3</Badge>
    </div>
  ),
};

export const LabelCTAs: StoryObj = {
  render: () => (
    <div className="demo-row">
      <LabelCTA size="lg" variant="tonal">Tonal</LabelCTA>
      <LabelCTA size="lg" variant="gradient">Gradient</LabelCTA>
      <LabelCTA size="lg" variant="outline">Outline</LabelCTA>
      <LabelCTA size="md" variant="tonal">Medium</LabelCTA>
      <LabelCTA size="sm" variant="tonal">Small</LabelCTA>
    </div>
  ),
};
