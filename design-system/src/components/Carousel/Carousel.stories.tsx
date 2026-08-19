import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CarouselControls } from "./Carousel";

const meta: Meta = {
  title: "Data & Content/Carousel",
};
export default meta;

export const Demo: StoryObj = {
  render: () => <CarouselControls count={4} />,
};
