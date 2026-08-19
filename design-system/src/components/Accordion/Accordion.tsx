import React, { useState } from "react";
import "./Accordion.css";
import { IconChevronDown } from "../icons";

export interface AccordionEntry {
  question: string;
  answer: string;
}

export const Accordion = ({ items, defaultOpenIndex = 0 }: { items: AccordionEntry[]; defaultOpenIndex?: number | null }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className={["accordion-item", isOpen ? "open" : ""].filter(Boolean).join(" ")}>
            <div className="accordion-head" onClick={() => setOpenIndex(isOpen ? null : i)}>
              {item.question}
              <IconChevronDown className="chevron" width={18} height={18} strokeWidth={2.5} />
            </div>
            <div className="accordion-body">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
