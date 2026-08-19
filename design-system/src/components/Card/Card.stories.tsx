import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ResourceCard, GlassCard, HorizontalCard } from "./Card";
import { DSTable } from "../Table/Table";

const IMG_A = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop";
const IMG_B = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop";
const IMG_C = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop";
const IMG_D = "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&h=400&fit=crop";

const meta: Meta = {
  title: "Data & Content/Card",
  parameters: {
    docs: {
      description: {
        component:
          "Pulled directly from the Resource component set in the Figma library (node 19097:39150) — 7 variants across 3 surface styles, 3 content types and 2 breakpoints.",
      },
    },
  },
};
export default meta;

export const Anatomy: StoryObj = {
  render: () => (
    <div className="anatomy-wrap">
      <div className="dark-stage" style={{ position: "relative", width: 320, flexShrink: 0 }}>
        <div className="anatomy-marker" style={{ top: 16, left: 16 }}>1</div>
        <div className="anatomy-marker" style={{ top: 206, left: 16 }}>2</div>
        <div className="anatomy-marker" style={{ top: 242, left: 16 }}>3</div>
        <div className="anatomy-marker" style={{ top: 280, left: 16 }}>4</div>
        <ResourceCard image={IMG_A} title="Card title goes here" hero={{ kind: "label", text: "Label" }} className="" />
      </div>
      <div className="anatomy-legend">
        <div className="row"><div className="num">1</div><div className="txt"><strong>Card Image</strong><span>aspect-ratio 3:2 · radius 8px · object-fit cover</span></div></div>
        <div className="row"><div className="num">2</div><div className="txt"><strong>Card Hero (slot)</strong><span>Label CTA · meta row (icon+date, icon+location) · or date + duration</span></div></div>
        <div className="row"><div className="num">3</div><div className="txt"><strong>Title</strong><span>Heading/H6 SemiBold 24/1.25 (Desktop) · 23/24 (Mobile) · 21/1.25 on Glass</span></div></div>
        <div className="row"><div className="num">4</div><div className="txt"><strong>Description (optional)</strong><span>Paragraph/Default Regular 18/1.25 — Horizontal style only</span></div></div>
      </div>
    </div>
  ),
};

export const SpecTable: StoryObj = {
  render: () => (
    <div className="spec-table-wrap">
      <DSTable
        columns={["Style", "Surface", "card-main gap", "Padding", "Title style", "Radius"]}
        rows={[
          ["No BG — Default", "Transparent", "16px", "0", "H6 SemiBold, 24px / 1.25", "8px"],
          ["No BG — Events", "Transparent", "24px", "0", "H6 SemiBold, 24px / 1.25", "8px"],
          ["No BG — Blog", "Transparent", "16px", "0", "H6 SemiBold, 24px / 1.25", "8px"],
          ["No BG — Mobile", "Transparent", "12px", "0", "H6 SemiBold, 23px / 24px", "8px"],
          ["No BG — Customer Story", "Transparent (30% overlay + centered logo)", "16px", "0", "H6 SemiBold, 24px / 1.25", "8px"],
          ["Glass", "Blur 50px, tinted border + glow", "24px", "16px", "Large SemiBold, 21px / 1.25", "8px"],
          ["Horizontal", "Same glass surface, row layout", "24px", "16px", "21px / 1.25 + 18px description", "8px"],
        ]}
      />
    </div>
  ),
};

export const Variants: StoryObj = {
  render: () => (
    <div className="dark-stage">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
        <div className="variant-cell">
          <ResourceCard image={IMG_A} title="Designing with variables" hero={{ kind: "label", text: "Guide" }} />
          <div className="variant-caption">No BG · Default · Desktop</div>
        </div>
        <div className="variant-cell">
          <ResourceCard
            image={IMG_B}
            title="Design systems meetup"
            hero={{ kind: "event", date: "14–16 OCTOBER", location: "Mercure Bela Vista, São Paulo" }}
          />
          <div className="variant-caption">No BG · Events · Desktop</div>
        </div>
        <div className="variant-cell">
          <ResourceCard
            image={IMG_C}
            title="Building an accessible focus ring"
            hero={{ kind: "blog", date: "15 NOV 2025", readTime: "4 min read" }}
          />
          <div className="variant-caption">No BG · Blog · Desktop</div>
        </div>
        <div className="variant-cell">
          <GlassCard image={IMG_A} title="Designing with variables" hero={{ kind: "label", text: "Guide" }} />
          <div className="variant-caption">Glass · Default · Desktop</div>
        </div>
        <div className="variant-cell" style={{ maxWidth: 240 }}>
          <ResourceCard
            image={IMG_A}
            title="4 Best Practices to Design an Effective Site"
            hero={{ kind: "label", text: "Guide" }}
            size="mobile"
          />
          <div className="variant-caption">No BG · Default · Mobile</div>
        </div>
        <div className="variant-cell">
          <ResourceCard
            image={IMG_D}
            title="How Solutions Co. cut onboarding time by 60%"
            hero={{ kind: "label", text: "Customer Story" }}
            logomark="SOLUTIONS CO"
          />
          <div className="variant-caption">No BG · Customer Story (logo overlay) · Desktop</div>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <HorizontalCard
          image={IMG_A}
          title="Designing with variables"
          hero={{ kind: "label", text: "Guide" }}
          description="How theming and modes keep light and dark in sync."
        />
        <div className="variant-caption" style={{ textAlign: "left", marginTop: 8 }}>
          Horizontal · Glass · Desktop — row layout, image and content flex 1:1
        </div>
      </div>
    </div>
  ),
};
