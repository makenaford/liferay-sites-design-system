import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button, IconButton, HelpTextButton } from "./Button";
import { IconRefresh, IconArrowRight, IconSettings } from "../icons";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  argTypes: {
    color: { control: "radio", options: ["primary", "neutral"] },
    variant: { control: "radio", options: ["solid", "outline", "rounded"] },
    size: { control: "radio", options: ["lg", "md", "sm"] },
    forceState: { control: "radio", options: [undefined, "hover", "focus", "active"] },
  },
  args: { children: "Button" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: { color: "primary", variant: "solid", size: "md" },
};

export const PrimarySolid: Story = {
  render: () => (
    <div className="demo-row">
      <Button size="lg">Button</Button>
      <Button size="md">Button</Button>
      <Button size="sm">Button</Button>
      <Button size="md" disabled>Disabled</Button>
    </div>
  ),
};

export const States: Story = {
  name: "States (solid primary, large)",
  render: () => (
    <div className="demo-row">
      <Button size="md">Default</Button>
      <Button size="md" forceState="hover">Hover</Button>
      <Button size="md" forceState="focus">Focus</Button>
      <Button size="md" forceState="active">Pressed</Button>
      <Button size="md" disabled>Disabled</Button>
    </div>
  ),
};

export const PrimaryOutlineGlass: Story = {
  render: () => (
    <div className="demo-row">
      <Button variant="outline" size="lg" leftIcon={<IconRefresh />} rightIcon={<IconArrowRight />}>
        Button
      </Button>
      <Button variant="outline" size="md">Button</Button>
      <Button variant="outline" size="sm">Button</Button>
    </div>
  ),
};

export const PrimaryRounded: Story = {
  render: () => (
    <div className="demo-row">
      <Button variant="rounded" size="lg">Get started</Button>
      <Button variant="rounded" size="md">Get started</Button>
    </div>
  ),
};

export const Neutral: Story = {
  render: () => (
    <div className="demo-row">
      <Button color="neutral" size="md">Neutral solid</Button>
      <Button color="neutral" variant="outline" size="md">Neutral outline</Button>
    </div>
  ),
};

export const IconAndHelp: Story = {
  name: "Icon button & help text",
  render: () => (
    <div className="demo-row">
      <IconButton aria-label="Settings">
        <IconSettings />
      </IconButton>
      <HelpTextButton>What&apos;s this?</HelpTextButton>
    </div>
  ),
};
