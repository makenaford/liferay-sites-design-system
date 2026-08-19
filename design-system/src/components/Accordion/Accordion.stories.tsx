import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Accordion } from "./Accordion";

const meta: Meta = {
  title: "Disclosure/Accordion & FAQ",
};
export default meta;

export const Demo: StoryObj = {
  render: () => (
    <Accordion
      defaultOpenIndex={0}
      items={[
        {
          question: "What is the Solutions Library?",
          answer:
            "A shared set of foundations and components so every surface feels consistent, in both light and dark mode.",
        },
        {
          question: "How do I request a new component?",
          answer: "Open a request against the design-system backlog with the use case and any reference screens.",
        },
        {
          question: "Does the system support dark mode automatically?",
          answer: "Yes — every token is theme-aware, so components repaint automatically when the mode switches.",
        },
      ]}
    />
  ),
};
