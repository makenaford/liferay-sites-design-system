import React, { useState } from "react";
import "./Carousel.css";
import { IconChevronLeft, IconChevronRight } from "../icons";

export interface CarouselControlsProps {
  count: number;
  index?: number;
  onIndexChange?: (i: number) => void;
}

export const CarouselControls = ({ count, index, onIndexChange }: CarouselControlsProps) => {
  const [internal, setInternal] = useState(0);
  const active = index ?? internal;
  const set = (i: number) => {
    const clamped = (i + count) % count;
    setInternal(clamped);
    onIndexChange?.(clamped);
  };

  return (
    <div className="demo-row">
      <div className="carousel-arrows">
        <button aria-label="Previous" onClick={() => set(active - 1)}>
          <IconChevronLeft width={18} height={18} />
        </button>
        <button aria-label="Next" onClick={() => set(active + 1)}>
          <IconChevronRight width={18} height={18} />
        </button>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={["line", i === active ? "active" : ""].filter(Boolean).join(" ")} />
        ))}
      </div>
    </div>
  );
};
