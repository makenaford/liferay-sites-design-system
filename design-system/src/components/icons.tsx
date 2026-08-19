import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  ...props,
});

export const IconRefresh = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 12a8 8 0 0 1 8-8M20 12a8 8 0 0 1-8 8" />
    <path d="M4 4v4h4M20 20v-4h-4" />
  </svg>
);

export const IconArrowRight = (props: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...props })}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconSettings = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const IconChevronLeft = (props: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...props })}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const IconChevronRight = (props: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...props })}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const IconChevronDown = (props: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...props })}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconCheck = (props: IconProps) => (
  <svg {...base({ strokeWidth: 3, ...props })}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconSearch = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const IconCalendar = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconPin = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
