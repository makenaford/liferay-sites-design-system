import React from "react";
import "./Card.css";
import { IconCalendar, IconPin } from "../icons";

export type CardSurface = "nobg" | "glass" | "horizontal";
export type CardSize = "desktop" | "mobile";

export interface CardBaseProps {
  image: string;
  title: string;
  className?: string;
  onLight?: boolean;
}

export interface CardHeroLabel {
  kind: "label";
  text: string;
}
export interface CardHeroEvent {
  kind: "event";
  date: string;
  location: string;
}
export interface CardHeroBlog {
  kind: "blog";
  date: string;
  readTime: string;
}
export type CardHero = CardHeroLabel | CardHeroEvent | CardHeroBlog;

const HeroSlot = ({ hero }: { hero: CardHero }) => {
  if (hero.kind === "label") return <div className="card__hero"><span className="card__label">{hero.text}</span></div>;
  if (hero.kind === "event") {
    return (
      <div className="card__hero">
        <div className="card__meta-row">
          <div className="card__meta-item">
            <IconCalendar />
            <span className="card__meta-date">{hero.date}</span>
          </div>
          <div className="card__meta-item">
            <IconPin />
            <span className="card__meta-loc">{hero.location}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="card__hero">
      <div className="card__meta-row">
        <span className="card__meta-date">{hero.date}</span>
        <span className="card__label">{hero.readTime}</span>
      </div>
    </div>
  );
};

export interface ResourceCardProps extends CardBaseProps {
  hero: CardHero;
  size?: CardSize;
  description?: string;
  logomark?: string;
}

/** The "No BG" resource card — default, events, blog, mobile and customer-story (logo overlay) variants. */
export const ResourceCard = ({ image, title, hero, size = "desktop", description, logomark, className = "", onLight }: ResourceCardProps) => {
  const isEvent = hero.kind === "event";
  const titleClass = size === "mobile" ? "card__title--h6-mobile" : "card__title--h6";

  return (
    <div className={["card", "card--nobg", isEvent ? "card--events" : "", size === "mobile" ? "card--mobile" : "", onLight ? "on-light" : "", className].filter(Boolean).join(" ")}>
      <div className="card__main">
        <div className={["card__image", logomark ? "card__image--logo" : ""].filter(Boolean).join(" ")}>
          <img src={image} alt="" />
          {logomark && (
            <>
              <div className="card__image-overlay" />
              <div className="card__image-logomark">{logomark}</div>
            </>
          )}
        </div>
        <div className="card__header">
          <HeroSlot hero={hero} />
          <h3 className={["card__title", titleClass].join(" ")}>{title}</h3>
          {description && <p className="card__desc">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export interface GlassCardProps extends CardBaseProps {
  hero: CardHero;
}
/** The glass-surface card — blurred background, single padded surface. */
export const GlassCard = ({ image, title, hero, className = "" }: GlassCardProps) => (
  <div className={["card", "card--glass", className].filter(Boolean).join(" ")}>
    <div className="card__main">
      <div className="card__image"><img src={image} alt="" /></div>
      <div className="card__header">
        <HeroSlot hero={hero} />
        <h3 className="card__title card__title--lg">{title}</h3>
      </div>
    </div>
  </div>
);

export interface HorizontalCardProps extends CardBaseProps {
  hero: CardHero;
  description: string;
}
/** Row layout: image and content flex 1:1, same glass surface treatment. */
export const HorizontalCard = ({ image, title, hero, description, className = "" }: HorizontalCardProps) => (
  <div className={["card", "card--horizontal", className].filter(Boolean).join(" ")}>
    <div className="card__main">
      <div className="card__image"><img src={image} alt="" /></div>
      <div className="card__content">
        <div className="card__header">
          <HeroSlot hero={hero} />
          <h3 className="card__title card__title--lg">{title}</h3>
          <p className="card__desc">{description}</p>
        </div>
      </div>
    </div>
  </div>
);
