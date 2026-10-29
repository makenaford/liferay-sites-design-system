import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import type { ReactNode } from 'react'
import {
  Avatar,
  Box,
  Button as MantineButton,
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
} from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { CapabilityMap } from '../components/CapabilityMap'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Footer } from '../components/Footer'
import { Form } from '../components/Form'
import { GradientText, highlightPhrase } from '../components/GradientText'
import { Hero, type HeroMediaSource } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { List } from '../components/List'
import { Progress } from '../components/Progress'
import bubbleFull from '../../assets/bubbles/bubble_center.webm'
import bubbleFullLight from '../../assets/bubbles/bubble_center_light.webm'
import bubbleCorner from '../../assets/bubbles/bubble_corner.webm'
import bubbleCornerLight from '../../assets/bubbles/bubble_corner_light.webm'
import { Marquee } from '../components/Marquee'
import { ContentMedia, Section as SDSSection, SectionTitle, type SectionProps } from '../components/Section'
import { Stat, StatBar, CountUp } from '../components/Stat'
import { Tabs } from '../components/Tabs'
import { TableOfContents } from '../components/TableOfContents'
import { Select, Textarea, TextInput } from '../components/Input'
import {
  IconArrowDown,
  IconBarbell,
  IconFileCode,
  IconSparkles,
  IconListCheck,
  IconWorld2,
  IconBuilding5,
  IconSettings6,
  IconSafetyCertificate,
  IconRocket,
  IconHeartHand,
  IconBriefcase,
  IconHeadphone2,
  IconTrophy,
  IconRefundDollar,
  IconScale,
  IconPlugin,
  IconShareForward,
  IconGitCompare,
  IconCheck,
  IconDown,
  IconDashboard,
  IconDirectionArrow,
  IconPigMoney,
  IconTag,
  IconArrowLeft,
  IconArrowUp,
  IconArrowRight,
  IconBracketsAngle,
  IconBuilding2,
  IconClose,
  IconDepartment,
  IconGroup,
  IconMonitor,
  IconPresentation1,
  IconGlassCertifications,
  IconGlassCommerce,
  IconGlassCourses,
  IconGlassCustomerPortals,
  IconGlassDam,
  IconGlassCdn,
  IconGlassDocumentation,
  IconGlassGlobalServices,
  IconGlassLearningPaths,
  IconGlassSupport,
  IconGlassEnterpriseWebsites,
  IconGlassFinancialServices,
  IconGlassEnergyAndUtilities,
  IconGlassHealthcare,
  IconGlassManufacturing,
  IconGlassPublicSector,
  IconGlassSolutionsPartnerPortals2,
  IconGlassSolutionsSupplierPortals3,
  IconGlassIndustriesFinancialServices2,
  IconGlassIndustriesManufacturing2,
  IconGlassIndustriesGovernment,
  IconGlassIndustriesEnergyAndSupply,
  IconGlassIndustriesHealthcare2,
  IconGlassIndustriesIntegration,
  IconGlassProductModulesIntegration,
  IconGlassGeneralPersonalization,
  IconGlassGeneralPartners,
  IconGlassGeneralAi,
  IconGlassUserBadge,
  IconGlassUserCubes,
  IconGlassUserScreen,
  IconGlassIntranets,
  IconGlassMail,
  IconGlassPartnerPortals,
  IconGlassAddUser,
  IconGlassAi,
  IconGlassAiHub,
  IconGlassUserValidation,
  IconGlassAnalytics,
  IconGlassCloudNative,
  IconGlassCms,
  IconGlassCmp,
  IconGlassContentPerformance,
  IconGlassDxp,
  IconGlassDsr,
  IconGlassIntegration,
  IconGlassLdp,
  IconGlassLowCode,
  IconGlassPim,
  IconGlassPersonalization,
  IconGlassPremiumSecurity,
  IconGlassSearch,
  IconGlassSites,
  IconGlassSupplierPortals,
  IconSearch,
  IconTime,
  IconShoppingCart1,
  IconUser1,
} from '../icons'
import { PRODUCT_MAP_MAX_HEIGHT } from './product-map'
import { VENDOR_LOGOS } from './vendor-logos'
import { CUSTOMER_THUMBNAILS, customerThumbnailAlt } from './customer-thumbnails'
import { MeshBackdrop, Quotee, VendorTile, Wordmark, unit, StarRating } from './shared'
import classes from '../theme/components.module.css'
import { isVideo } from './page-schema'
import {
  ResultCount,
  StoryFilterBar,
  matchesSelection,
  type StorySelection,
} from './story-filters'
import type {
  ArticleBlock,
  BlogPostSpec,
  CardSpec,
  GlassIconName,
  HeroSpec,
  ImageRef,
  LinkRef,
  IconName,
  PageSpec,
  PanelSpec,
  SectionSpec,
  StatSpec,
  StorySpec,
} from './page-schema'

/**
 * Renders a `PageSpec`.
 *
 * **Every measurement in this file is deliberate and belongs to a section type**, not to the page that
 * uses it: the carousel bleeds because a customer-story band bleeds, the goals grid is four columns at
 * a 32px gap because that is what `Type=Card Grid` is. None of it reaches the data. That is the whole
 * argument — see `page-schema.ts`.
 *
 * The interactions are real, not simulated. A tab bar here is the library's `Tabs`, so it focuses,
 * takes arrow keys and swaps its panel exactly as it will in production.
 */

const ICONS: Record<IconName, ReactNode> = {
  'arrow-right': <IconArrowRight />,
  'arrow-down': <IconArrowDown />,
  'brackets-angle': <IconBracketsAngle />,
  presentation: <IconPresentation1 />,
  user: <IconUser1 />,
  monitor: <IconMonitor />,
  department: <IconDepartment />,
  building: <IconBuilding2 />,
  group: <IconGroup />,
  cart: <IconShoppingCart1 />,
  search: <IconSearch />,
  close: <IconClose />,
  'direction-arrow': <IconDirectionArrow />,
  dashboard: <IconDashboard />,
  'pig-money': <IconPigMoney />,
  tag: <IconTag />,
  barbell: <IconBarbell />,
  'file-code': <IconFileCode />,
  sparkles: <IconSparkles />,
  'list-check': <IconListCheck />,
  world: <IconWorld2 />,
  'office-building': <IconBuilding5 />,
  settings: <IconSettings6 />,
  'safety-certificate': <IconSafetyCertificate />,
  rocket: <IconRocket />,
  'heart-hand': <IconHeartHand />,
  briefcase: <IconBriefcase />,
  headphone: <IconHeadphone2 />,
  trophy: <IconTrophy />,
  'refund-dollar': <IconRefundDollar />,
  scale: <IconScale />,
  plugin: <IconPlugin />,
  'share-forward': <IconShareForward />,
  'git-compare': <IconGitCompare />,
}

const GLASS: Record<GlassIconName, (size: number) => ReactNode> = {
  'financial-services': (s) => <IconGlassFinancialServices width={s} height={s} />,
  'enterprise-websites': (s) => <IconGlassEnterpriseWebsites width={s} height={s} />,
  'customer-portals': (s) => <IconGlassCustomerPortals width={s} height={s} />,
  'supplier-portals': (s) => <IconGlassSupplierPortals width={s} height={s} />,
  'partner-portals': (s) => <IconGlassPartnerPortals width={s} height={s} />,
  intranets: (s) => <IconGlassIntranets width={s} height={s} />,
  commerce: (s) => <IconGlassCommerce width={s} height={s} />,
  mail: (s) => <IconGlassMail width={s} height={s} />,
  search: (s) => <IconGlassSearch width={s} height={s} />,
  sites: (s) => <IconGlassSites width={s} height={s} />,
  dxp: (s) => <IconGlassDxp width={s} height={s} />,
  pim: (s) => <IconGlassPim width={s} height={s} />,
  personalization: (s) => <IconGlassPersonalization width={s} height={s} />,
  dsr: (s) => <IconGlassDsr width={s} height={s} />,
  cms: (s) => <IconGlassCms width={s} height={s} />,
  cmp: (s) => <IconGlassCmp width={s} height={s} />,
  'content-performance': (s) => <IconGlassContentPerformance width={s} height={s} />,
  ldp: (s) => <IconGlassLdp width={s} height={s} />,
  'ai-hub': (s) => <IconGlassAiHub width={s} height={s} />,
  analytics: (s) => <IconGlassAnalytics width={s} height={s} />,
  'cloud-native': (s) => <IconGlassCloudNative width={s} height={s} />,
  security: (s) => <IconGlassPremiumSecurity width={s} height={s} />,
  'add-user': (s) => <IconGlassAddUser width={s} height={s} />,
  'user-validation': (s) => <IconGlassUserValidation width={s} height={s} />,
  ai: (s) => <IconGlassAi width={s} height={s} />,
  'low-code': (s) => <IconGlassLowCode width={s} height={s} />,
  integration: (s) => <IconGlassIntegration width={s} height={s} />,
  documentation: (s) => <IconGlassDocumentation width={s} height={s} />,
  courses: (s) => <IconGlassCourses width={s} height={s} />,
  'learning-paths': (s) => <IconGlassLearningPaths width={s} height={s} />,
  certifications: (s) => <IconGlassCertifications width={s} height={s} />,
  support: (s) => <IconGlassSupport width={s} height={s} />,
  'global-services': (s) => <IconGlassGlobalServices width={s} height={s} />,
  dam: (s) => <IconGlassDam width={s} height={s} />,
  database: (s) => <IconGlassCdn width={s} height={s} />,
  manufacturing: (s) => <IconGlassManufacturing width={s} height={s} />,
  'public-sector': (s) => <IconGlassPublicSector width={s} height={s} />,
  'energy-and-utilities': (s) => <IconGlassEnergyAndUtilities width={s} height={s} />,
  healthcare: (s) => <IconGlassHealthcare width={s} height={s} />,
  'partner-portals-2': (s) => <IconGlassSolutionsPartnerPortals2 width={s} height={s} />,
  'supplier-portals-3': (s) => <IconGlassSolutionsSupplierPortals3 width={s} height={s} />,
  'financial-services-2': (s) => <IconGlassIndustriesFinancialServices2 width={s} height={s} />,
  'manufacturing-2': (s) => <IconGlassIndustriesManufacturing2 width={s} height={s} />,
  government: (s) => <IconGlassIndustriesGovernment width={s} height={s} />,
  'energy-and-supply': (s) => <IconGlassIndustriesEnergyAndSupply width={s} height={s} />,
  'healthcare-2': (s) => <IconGlassIndustriesHealthcare2 width={s} height={s} />,
  'industries-integration': (s) => <IconGlassIndustriesIntegration width={s} height={s} />,
  'module-integration': (s) => <IconGlassProductModulesIntegration width={s} height={s} />,
  'general-personalization': (s) => <IconGlassGeneralPersonalization width={s} height={s} />,
  partners: (s) => <IconGlassGeneralPartners width={s} height={s} />,
  'general-ai': (s) => <IconGlassGeneralAi width={s} height={s} />,
  'user-cubes': (s) => <IconGlassUserCubes width={s} height={s} />,
  'user-badge': (s) => <IconGlassUserBadge width={s} height={s} />,
  'user-screen': (s) => <IconGlassUserScreen width={s} height={s} />,
}

/** A figure with its unit tight against it, and the arrow the file draws on a fall. */
/**
 * `index` is the key, not the label.
 *
 * A stat row can legitimately repeat one — the customer-story cell draws `845 / Months to launch` three
 * times over — and keying by the label made React drop two of the three. Position is what actually
 * identifies a figure in a row that never reorders.
 */
/** A value that is just a number, separators allowed — `1,200` yes, `24/7` and `A+` no. */
const countable = (value: string) => /^\d[\d,]*(\.\d+)?$/.test(value.trim())

/**
 * `size` and `iconSide` are for the `Key Metrics` panel, whose `Stats Item` draws the arrow after the
 * figure (`Show Stat Icon Right`) at the small size; everywhere else the arrow leads.
 */
function renderStat(
  stat: StatSpec,
  align?: 'center',
  index = 0,
  {
    size,
    iconSide = 'left',
    unitSize,
  }: { size?: 'sm'; iconSide?: 'left' | 'right'; /** The unit's px size — 32 beside a 64px figure. */ unitSize?: number } = {},
) {
  const icon =
    stat.sentiment === 'negative' ? <IconArrowDown /> : stat.sentiment === 'positive' ? <IconArrowUp /> : undefined
  return (
    <Stat
      key={index}
      align={align}
      size={size}
      value={
        <>
          {stat.prefix ? unit(stat.prefix, unitSize) : null}
          {/*
           * Counted when the figure is a number, printed when it is not.
           *
           * `StatSpec.value` is a string, and most of them are figures — but not all: a spec is free to
           * say `24/7` or `A+`, and counting up to those means nothing. Parsing is the test, so a page
           * gets the animation by writing a number rather than by remembering a flag.
           */}
          {countable(stat.value) ? <CountUp value={Number(stat.value.replace(/,/g, ''))} /> : stat.value}
          {stat.suffix ? unit(stat.suffix, unitSize) : null}
        </>
      }
      label={stat.label}
      /* A win points up regardless of which way the number went; see `sentiment` in the schema. */
      leftSection={iconSide === 'left' ? icon : undefined}
      rightSection={iconSide === 'right' ? icon : undefined}
    />
  )
}

/* ------------------------------------------------------------------ the hero */

/**
 * The hero's media column.
 *
 * A video here is not a picture in a frame: the LRDC hero animation carries an alpha channel, so
 * `.heroMedia` blurs the bubble gradient behind it rather than boxing it in. Under
 * `prefers-reduced-motion` it still renders, paused on its first frame — the content is the point, and
 * dropping it would leave the hero half empty.
 */
function HeroMedia({ media }: { media: ImageRef }) {
  const reducedMotion = useReducedMotion()
  const scheme = useComputedColorScheme('dark')
  const [failed, setFailed] = useState(false)

  /*
   * One file per canvas where the media carries alpha, the same pick `Hero` makes for its bubble.
   *
   * `srcLight` is optional and usually absent — an opaque picture is the same picture in both schemes.
   * It matters for the hero animation, whose chrome is translucent: the light page bleeds through it,
   * so the dark export arrives grey. `?? media.src` is the whole fallback, so media that needs no
   * second file says nothing.
   */
  const src = scheme === 'light' ? (media.srcLight ?? media.src) : media.src

  /*
   * Footage lives in the git-ignored `media/` folder, so "the file is not there" is the *normal* case
   * on a fresh clone and on the deployed Storybook — not an edge case. Falling back to the still keeps
   * the hero a hero instead of an empty column.
   */
  const showStill = !isVideo(src) || (failed && media.poster)

  if (showStill) {
    return (
      <Image
        src={failed ? media.poster! : src}
        alt={media.alt}
        ratio={media.ratio ?? '4:3'}
        radius="md"
      />
    )
  }

  return (
    <video
      /*
       * Keyed on the source, because a `src` swap on a playing `video` is not reliably picked up —
       * switching scheme would otherwise leave the previous canvas's footage on screen.
       */
      key={src}
      src={src}
      poster={media.poster}
      autoPlay={!reducedMotion}
      muted
      loop
      playsInline
      /* A posterless video that has not buffered draws nothing, so there must be a first frame. */
      preload="auto"
      onError={() => setFailed(true)}
      aria-hidden
      tabIndex={-1}
    />
  )
}

/**
/**
 * A still or a clip, in a box of the given ratio.
 *
 * `HeroMedia` is not reusable here and it was a mistake to try: its `<video>` carries no sizing at all,
 * because inside the hero `.heroVideo` gives it one. Dropped into a content column it renders at its
 * natural 1200x866 and takes the page's width with it. This gives the element the same `aspect-ratio`,
 * radius and `object-fit` that `Image` gives a still, so a row that swaps a photo for a clip does not
 * also change the shape of the column.
 */
export function PanelMedia({ media }: { media: ImageRef }) {
  const reducedMotion = useReducedMotion()
  const [failed, setFailed] = useState(false)

  if (!isVideo(media.src) || failed) {
    /*
     * `fill`, because the box around this already has a ratio — see `.mediaFade`. Asking the image for
     * one too would give the box two opinions about its height, and the one that won would depend on
     * which media the open row happened to carry.
     */
    return <Image src={failed && media.poster ? media.poster : media.src} alt={media.alt} fill fit="contain" radius="md" />
  }

  return (
    <video
      src={media.src}
      poster={media.poster}
      /* Held on its first frame rather than dropped: the footage is the content of the row. */
      autoPlay={!reducedMotion}
      muted
      /*
       * Once, on entering the row — not on a loop.
       *
       * A clip that restarts every few seconds competes with the row that is open: the reader's eye is
       * pulled back to the picture each time it begins again, and these are 6 to 17 seconds long, so a
       * loop is a fresh interruption before most people have finished the paragraph. It plays through
       * and holds its last frame, and it plays again when the row is opened again — the crossfade mounts
       * a fresh element each time, so entering a row it has seen before starts it from the beginning.
       */
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
      aria-label={media.alt}
      tabIndex={-1}
      style={{
        display: 'block',
        /* Size and fit come from `.mediaFade`, which gives every layer the same box. */
        /*
         * The `screen` that blends the black ground away is on the *layer* in `CrossfadeMedia`, not
         * here. It was here, and it stopped working the moment the crossfade arrived: the fade is a CSS
         * animation, an animation creates a stacking context, and `animation-fill-mode: both` keeps
         * that context for good — so the video was blending against its own transparent wrapper rather
         * than against the page, and pure black over transparent is pure black.
         */
        borderRadius: 'var(--mantine-radius-md)',
      }}
    />
  )
}

/**
 * `PanelMedia`, with the swap between two of them faded rather than cut.
 *
 * Keeping the outgoing layer mounted is the whole trick, and it is why this is a component rather than
 * a class on the element: a fade needs both pictures on screen at once, and React has thrown the old
 * one away by the time any CSS could run.
 *
 * **There is no blending here any more, and that is the point.** The clips arrived as a photograph
 * inset in black padding, and three commits went into hiding that padding with `mix-blend-mode:
 * screen` — which kept breaking, because a blend composites against the nearest stacking context and
 * every ancestor is free to become one. It broke on the fade's own animation, then again on
 * `stickyMedia`.
 *
 * The padding is cropped out of the files instead. Nothing left to hide, so nothing to blend, so
 * nothing an ancestor can break — and the clips are no longer lightened by the page colour while the
 * still beside them is not, which is the second thing the blend was quietly costing.
 */
export function CrossfadeMedia({ media }: { media: ImageRef }) {
  const [layers, setLayers] = useState<{ id: number; media: ImageRef }[]>([{ id: 0, media }])
  const nextId = useRef(0)

  useEffect(() => {
    setLayers((prev) => {
      const current = prev[prev.length - 1]
      if (current.media.src === media.src) return prev
      nextId.current += 1
      /* At most two: the one going out and the one coming in. A third would fade over an unfinished fade. */
      return [current, { id: nextId.current, media }]
    })
  }, [media])

  const incoming = layers[layers.length - 1]
  const outgoing = layers.length > 1 ? layers[0] : undefined

  return (
    <div className={classes.mediaFade}>
      {outgoing ? (
        <div className={classes.mediaFadeOut} aria-hidden>
          <PanelMedia media={outgoing.media} />
        </div>
      ) : undefined}
      <div
        key={incoming.id}
        className={classes.mediaFadeIn}
        /* The fade is over, so the layer underneath has nothing left to show. */
        onAnimationEnd={() => setLayers((prev) => prev.slice(-1))}
      >
        <PanelMedia media={incoming.media} />
      </div>
    </div>
  )
}

/**
 * The hero's form card — Figma's `Form` instance, in the column `media` would otherwise fill.
 *
 * Every slot here is one the `Form` component already draws, which is the point of it existing: the
 * heading pair, `Form.Row` per row, the terms *above* the button because they are agreed to by pressing
 * it, and the footnote under. Nothing about the card's surface, padding or breakpoints is decided here.
 */
function HeroFormCard({ spec }: { spec: NonNullable<HeroSpec['formCard']> }) {
  return (
    <Form
      title={spec.title}
      description={spec.description}
      terms={spec.terms}
      submit={
        <Button size="md" fullWidth>
          {spec.submit}
        </Button>
      }
      footnote={spec.footnote}
      onSubmit={(event) => event.preventDefault()}
    >
      {spec.rows.map((row, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Form.Row key={i}>
          {row.map((field) =>
            field.type === 'textarea' ? (
              <Textarea key={field.label} label={field.label} required={field.required} autosize minRows={3} />
            ) : field.type === 'select' ? (
              <Select key={field.label} label={field.label} required={field.required} data={field.options ?? []} />
            ) : (
              <TextInput
                key={field.label}
                label={field.label}
                required={field.required}
                type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
              />
            ),
          )}
        </Form.Row>
      ))}

      {spec.consent ? (
        /*
         * Mantine's `Checkbox` — the library has no wrapper for one, and the theme styles Mantine's
         * directly, so a pass-through here would be a component whose whole body is a re-export.
         */
        <Checkbox label={spec.consent} />
      ) : null}
    </Form>
  )
}

function renderHero(hero: HeroSpec, bubble?: BubbleOverride) {
  const background = hero.background ?? 'corner'

  return (
    <Hero
      /*
       * The bubble that goes with the background — both exports of it, since each canvas has its own
       * and the hero picks between them. A page says which shape it wants; which files those are is not
       * a page's business.
       */
      background={background}
      align={hero.align}
      data-layout={hero.layout && hero.layout !== 'default' ? hero.layout : undefined}
      drawn={bubble?.css || undefined}
      video={bubble?.video ?? (background === 'full' ? bubbleFull : bubbleCorner)}
      videoLight={bubble?.videoLight ?? (background === 'full' ? bubbleFullLight : bubbleCornerLight)}
      banner={hero.banner ? <SolutionFinder banner={hero.banner} /> : undefined}
      breadcrumb={hero.breadcrumbs?.length ? <Breadcrumbs trail={hero.breadcrumbs} /> : undefined}
      label={
        hero.logo ? (
          <img className={classes.heroLogo} src={hero.logo.src} alt={hero.logo.alt} />
        ) : hero.label ? (
          <Label variant="gradient" size="lg">
            {hero.label}
          </Label>
        ) : undefined
      }
      /*
       * The page's own arrival. A rendered page is a marketing page by definition — it is what this
       * renderer is for — so the hero's entrance is on here rather than left to each spec to remember,
       * the same way sections carry their reveal.
       */
      entrance
      title={
        <h1 style={hero.titleMaxWidth ? { maxWidth: hero.titleMaxWidth } : undefined}>
          {hero.title.text}
          {hero.title.highlight ? (
            <>
              {' '}
              <GradientText>{hero.title.highlight}</GradientText>
            </>
          ) : null}
        </h1>
      }
      description={
        hero.description || hero.points?.length ? (
          <>
            {hero.description ? (
              <p>
                {hero.description.text}
                {hero.description.emphasis ? (
                  <>
                    {' '}
                    <Text span inherit fw={700} c="var(--sds-surfaces-text-primary)">
                      {hero.description.emphasis}
                    </Text>
                  </>
                ) : null}
              </p>
            ) : null}
            {hero.points?.length ? (
              /* The value props: a UI icon in a small glass tile, and the answer beside it. */
              <ul className={classes.heroPoints}>
                {hero.points.map((point) => (
                  <li key={point.text}>
                    {point.icon ? (
                      <span className={classes.heroPointIcon} aria-hidden>
                        {ICONS[point.icon]}
                      </span>
                    ) : null}
                    {point.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : undefined
      }
      form={
        hero.form ? (
          <TextInput
            aria-label="Work email"
            type="email"
            placeholder={hero.form.placeholder}
            containedButton={
              /* Small, so the label and padding suit the 32px the field's 8px inset leaves. */
              <Button size="sm" rightSection={<IconArrowRight />}>
                {hero.form.submit}
              </Button>
            }
          />
        ) : hero.search ? (
          <HeroSearch search={hero.search} />
        ) : undefined
      }
      actions={
        hero.buttons?.length || hero.action || hero.links?.length ? (
          <>
            {hero.buttons?.map((button) => (
              /*
               * Mantine's `Button` rather than the library's, on its own advice: the wrapper is
               * deliberately non-polymorphic, and a hero CTA has to be an anchor. The theme keys on
               * `Button`, so the appearance is identical either way.
               */
              <MantineButton
                key={button.label}
                component="a"
                href={button.href}
                /* The file draws Medium in every hero, so this is the type's, not the page's. */
                size="md"
                variant={button.variant === 'outline' ? 'outline' : 'filled'}
              >
                {button.label}
              </MantineButton>
            ))}
            {hero.action ? (
              <Link href={hero.action.href} size="md" rightSection={<IconArrowRight />}>
                {hero.action.label}
              </Link>
            ) : null}
            {hero.links?.map((link) => (
              <Link key={link.label} href={link.href} size="md" rightSection={<IconArrowRight />}>
                {link.label}
              </Link>
            ))}
          </>
        ) : undefined
      }
      proof={
        hero.proof ? (
          renderProof(hero.proof)
        ) : hero.readTime ? (
          <Label variant="glass" size="md">
            {hero.readTime}
          </Label>
        ) : hero.byline || hero.tags?.length ? (
          <Stack gap={12}>
            {hero.byline ? <Byline byline={hero.byline} /> : null}
            {hero.tags?.length ? (
              <Group gap={8}>
                {hero.tags.map((tag) => (
                  <Label key={tag} variant="glass" size="sm">
                    {tag}
                  </Label>
                ))}
              </Group>
            ) : null}
          </Stack>
        ) : undefined
      }
      /* A form card takes the media column: the file draws one or the other there, never both. */
      media={
        hero.formCard ? (
          <HeroFormCard spec={hero.formCard} />
        ) : hero.media ? (
          <HeroMedia media={hero.media} />
        ) : undefined
      }
    />
  )
}

/**
 * The site search a hero carries in place of an email field — the Learn home page's.
 *
 * A real `search` input, not a lookalike: it takes the field's glass treatment from `.heroForm` like
 * the email field does, and it is a form so Enter submits. Nothing is wired behind it — the action is
 * `#`, the same as every link a template draws.
 *
 * The topics are links rather than `Chip`s. A chip toggles and carries a close glyph; these go
 * somewhere, so each is an anchor around a `Label`, which is the read-only pill in this library.
 */
function HeroSearch({ search }: { search: NonNullable<HeroSpec['search']> }) {
  return (
    <form role="search" action="#" className={classes.heroSearch} onSubmit={(e) => e.preventDefault()}>
      <TextInput
        type="search"
        aria-label="Search Liferay Learn"
        placeholder={search.placeholder}
        leftSection={<IconSearch />}
      />
      {search.popular?.length ? (
        <Group gap={8} justify="center">
          <Text span size="sm" c="var(--sds-surfaces-text-secondary)">
            Popular:
          </Text>
          {search.popular.map((topic) => (
            <a key={topic.label} href={topic.href} className={classes.heroTopic}>
              <Label variant="glass" size="sm">
                {topic.label}
              </Label>
            </a>
          ))}
        </Group>
      ) : null}
    </form>
  )
}

/** The hero's trail: links up to the last entry, which is this page and so is text. */
function Breadcrumbs({ trail }: { trail: LinkRef[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={classes.heroBreadcrumbs}>
        {trail.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`}>
            {i < trail.length - 1 ? (
              <a href={crumb.href}>{crumb.label}</a>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * The blog hero's `Author` `Type=Row`: a 36px portrait 16px from the name, then the date and read time,
 * each behind a 4px `dot divider`, 12 apart and all 16px semibold in `Surfaces/Text/Primary`. It takes the
 * proof slot — a post has an author where a landing page has a rating.
 */
function Byline({ byline }: { byline: NonNullable<HeroSpec['byline']> }) {
  return (
    <div className={classes.heroByline}>
      <span className={classes.heroBylineAuthor}>
        <Avatar src={byline.avatar?.src} alt="" name={byline.name} size={36} color="blue" variant="filled" />
        {byline.name}
      </span>
      {[byline.date, byline.readTime].filter(Boolean).map((part) => (
        <span key={part} className={classes.heroBylinePart}>
          {part}
        </span>
      ))}
    </div>
  )
}

function renderProof(proof: NonNullable<HeroSpec['proof']>) {
  /* With badges the rating is one block beside them; without, its two lines flow in the proof row as before. */
  const Wrap = proof.badges?.length ? 'div' : Fragment
  const rating = proof.rating ? (
    <Wrap>
      <Group gap={8} wrap="nowrap">
        <Text fz={28} fw={700} lh={1}>
          {proof.rating.score}
        </Text>
        {/*
         * The score as drawn, not rounded to whole stars. `Math.round` turned 4.6 into five filled
         * stars — a better rating than the number beside it claimed.
         */}
        <StarRating value={Number(proof.rating.score) || 0} max={proof.rating.outOf} />
      </Group>
      <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
        {proof.rating.source}
      </Text>
    </Wrap>
  ) : null

  return (
    <>
      {proof.badges?.length ? (
        /* The rating on the left and the analyst badges on the right, 48 tall, as the Gartner section draws them. */
        <div className={classes.heroProofRow}>
          {rating}
          <Group gap={8} wrap="nowrap" className={classes.heroProofBadges}>
            {proof.badges.map((badge) => (
              <img key={badge.src} src={badge.src} alt={badge.alt} />
            ))}
          </Group>
        </div>
      ) : (
        rating
      )}
      {proof.marks?.length ? (
        <Group gap={8} wrap="wrap">
          {proof.marks.map((mark) => (
            <Label key={mark} variant="glass" size="sm" radius="sm">
              {mark}
            </Label>
          ))}
        </Group>
      ) : null}
    </>
  )
}

/**
 * The hero's solution finder. A pill at the drawn width that stops being a pill once the row wraps,
 * and fields that go full width there — all of it the banner kind's, none of it the page's.
 */
function SolutionFinder({ banner }: { banner: NonNullable<HeroSpec['banner']> }) {
  return (
    /*
     * Not interactive: this card is a container for the selects and button inside it. With the default
     * on, a hover lift and focus ring would fire on the bar itself while the real controls sit within
     * it — an affordance pointing at nothing, wrapped around things that have their own.
     */
    <Card
      surface="glass"
      interactive={false}
      padding="none"
      radius="pill"
      w="100%"
      maw={1000}
    >
      <Group gap={16} px={16} py={8} align="center">
        {/*
         * 18px, a literal: the typography scale has no 18px step — `Paragraph/Large` is 21 and
         * the one below it is 16 — which is the same gap the Accordion's condensed label records.
         */}
        <Text fz={18} fw={600} pl={8} flex={{ base: '1 1 100%', md: '1 1 auto' }}>
          {banner.label}
        </Text>
        {banner.fields.map((field) => (
          <Select
            key={field.label}
            aria-label={field.label}
            radius="xl"
            w={{ base: '100%', md: field.width ?? 200 }}
            defaultValue={field.options[0]}
            data={field.options}
          />
        ))}
        <Button
          variant="rounded"
          size="sm"
          w={{ base: '100%', md: 'auto' }}
          rightSection={<IconArrowRight />}
        >
          {banner.action}
        </Button>
      </Group>
    </Card>
  )
}

/* ------------------------------------------------------------------ the sections */

/**
 * One card in a grid. Which decoration it leads with is the card's own — an image, a glass icon, or a
 * tag — and each brings the padding the file draws with it: an image card pads all round, an icon or
 * tag card takes the default.
 */
function GridCard({
  card,
  surface,
  header,
}: {
  card: CardSpec
  surface?: 'glass'
  header?: 'vertical' | 'horizontal'
}) {
  /*
   * A picture over an icon is the Solutions Library's `Type=Industry`: the picture sits *inside* the
   * card's 20px, rounded on its own, with the glass icon under it. A picture alone keeps the older cell's
   * face — run to the card's edges, only the text inset.
   */
  /* Partner Pages' ecosystem cards inset their picture the same way, over a quote or a story and its link. */
  const inset = Boolean(card.image && (card.icon || card.cta || card.attribution))
  /*
   * A card is a target when it has an `href`, and a panel otherwise — but a panel holding links (or a
   * list and a figure) is still the file's glass surface, just not one that lifts as a whole.
   */
  const glass = Boolean(
    surface === 'glass' || card.href || card.cta || card.links?.length || card.points?.length || card.stats?.length,
  )

  return (
    <Card
      component={card.href ? 'a' : 'div'}
      href={card.href}
      /*
       * The link decides the kind of card. With one, it is a target and wears glass; without, it is a
       * panel and wears `static`. Previously both were glass and only the hover differed, so a card
       * with nowhere to go looked exactly like one that had somewhere.
       */
      surface={glass ? 'glass' : 'static'}
      interactive={card.href ? undefined : false}
      /*
       * `content`, not `all`: the image runs to the card's edges and only the text is inset. `all` pads
       * the image too, which put a 20px frame of card around every thumbnail and made the picture look
       * like it had been pasted in rather than like it was the card's face.
       */
      padding={card.image && !inset ? 'content' : undefined}
      image={
        card.image ? (
          <Image src={card.image.src} alt={card.image.alt} ratio="3:2" radius={inset ? 'sm' : undefined} />
        ) : undefined
      }
      headerAlign={header === 'horizontal' ? 'horizontal' : undefined}
      hero={
        card.icon ? (
          GLASS[card.icon](card.points || card.links || header === 'horizontal' ? 48 : 40)
        ) : card.tag ? (
          <Label variant="gradient" size="md">
            {card.tag}
          </Label>
        ) : undefined
      }
      title={card.title || undefined}
      description={
        card.attribution ? (
          <>
            {card.description}
            {/* Who said it: the name in semibold, then the role, on the line under the quote. */}
            <span className={classes.cardAttribution}>
              <strong>{card.attribution.name}</strong>
              {card.attribution.role ? `, ${card.attribution.role}` : null}
            </span>
          </>
        ) : (
          card.description
        )
      }
      main={
        card.points?.length ? (
          /* `Type=Portal`'s `Main List Item` run: a 24px check, then the line, 16 apart. */
          <List marker="check" spacing={16}>
            {card.points.map((point) => (
              <List.Item key={point}>{point}</List.Item>
            ))}
          </List>
        ) : card.links?.length ? (
          <Stack gap={16} align="flex-start">
            {card.links.map((link) => (
              <Link key={link.label} href={link.href} size="md" rightSection={<IconArrowRight />}>
                {link.label}
              </Link>
            ))}
          </Stack>
        ) : undefined
      }
      bottom={
        card.progress !== undefined ? (
          <Progress value={card.progress} label={`${card.title} progress`} />
        ) : card.action ? (
          <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
            {card.action.label}
          </Button>
        ) : card.cta ? (
          <Link href={card.cta.href} size="md" rightSection={<IconArrowRight />}>
            {card.cta.label}
          </Link>
        ) : card.stats?.length ? (
          /* `Type=Industry`'s `Stats Bar`: the figures side by side, ruled apart. */
          /* The full-size figure and small-caps label the frame draws, not the catalog card's compact one. */
          <StatBar className={classes.cardStats}>
            {card.stats.map((stat, i) => renderStat(stat, undefined, i))}
          </StatBar>
        ) : card.stat ? (
          /* The catalog card's `Stats Bar`: one figure under a full-width rule. Full size on a Portal card. */
          <div className={classes.cardStat}>
            {renderStat(card.stat, undefined, 0, card.points?.length ? {} : { size: 'sm' })}
          </div>
        ) : undefined
      }
    />
  )
}

/**
 * `Section`, with the scroll reveal already on.
 *
 * A template page *is* the sequence the reveal was written for — every section here opted into it one by
 * one, which made it a thing to remember rather than a property of the page. It is the default at this
 * layer instead: a new section type gets the same arrival as the ten around it without asking, and a
 * section that genuinely should not move passes `reveal={false}`. The component's own default stays off,
 * because an app shell or a docs page has no such sequence to join.
 */
function Section({ reveal = true, ...props }: SectionProps) {
  return <SDSSection reveal={reveal} {...props} />
}

/** `Type=Card Grid` — four columns at a 32px section gap, optionally behind a pill bar. */
function CardGridSection({ spec }: { spec: Extract<SectionSpec, { type: 'cardGrid' }> }) {
  const [tab, setTab] = useState(spec.tabs?.[0]?.value ?? '')
  const cards = spec.tabs ? (spec.tabs.find((t) => t.value === tab)?.content ?? []) : (spec.cards ?? [])
  const grid = (row: CardSpec[]) => (
    <SimpleGrid cols={{ base: 1, sm: 2, md: spec.columns ?? 4 }} spacing={24}>
      {row.map((card, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <GridCard key={`${card.title}-${i}`} card={card} surface={spec.surface} header={spec.cardHeader} />
      ))}
    </SimpleGrid>
  )

  return (
    <Section
      /* 24 to the cards when the section is rows under headings, as the ecosystem frame draws it. */
      gap={spec.groups?.length ? 24 : 32}
      title={
        <SectionTitle
          align={spec.align}
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
          actions={
            spec.tabs ? (
              /* Explicit width: a pill bar is its own `inline-size` container and collapses in a row. */
              <Tabs variant="pills" w={{ base: '100%', md: 520 }} value={tab} onChange={(v) => setTab(v ?? '')}>
                <Tabs.List grow>
                  {spec.tabs.map((t) => (
                    <Tabs.Tab key={t.value} value={t.value} leftSection={t.icon ? ICONS[t.icon] : undefined}>
                      {t.label}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            ) : undefined
          }
        />
      }
    >
      {spec.groups?.length ? (
        <Stack gap={64}>
          {grid(cards)}
          {spec.groups.map((group) => (
            <div key={group.title} className={classes.cardGridGroup}>
              <h3 className={classes.cardGridGroupTitle}>{group.title}</h3>
              {grid(group.cards)}
            </div>
          ))}
        </Stack>
      ) : (
        grid(cards)
      )}
    </Section>
  )
}

/** `Type=Resources` — three columns at the drawn 24px gap, icon- or tag-led cards. */
function ResourceGridSection({ spec }: { spec: Extract<SectionSpec, { type: 'resourceGrid' }> }) {
  return (
    <Section
      title={
        <SectionTitle
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
          actions={
            spec.action ? (
              <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
                {spec.action.label}
              </Button>
            ) : undefined
          }
        />
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
        {spec.cards.map((card, i) => (
          // eslint-disable-next-line react/no-array-index-key
          spec.card === 'resource' ? (
            // eslint-disable-next-line react/no-array-index-key
            <ResourceCard key={`${card.title}-${i}`} card={card} />
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <GridCard key={`${card.title}-${i}`} card={card} />
          )
        ))}
      </SimpleGrid>
    </Section>
  )
}

/**
 * `Common Cards` `Type=Resource` — the same `Card` its Code Connect mapping draws: no surface and no
 * padding, so the picture is the card's face and the tag and title sit under it on the page itself.
 */
function ResourceCard({ card }: { card: CardSpec }) {
  return (
    <Card
      component={card.href ? 'a' : 'div'}
      href={card.href}
      interactive={Boolean(card.href)}
      surface="none"
      padding="none"
      image={
        card.image ? (
          <div className={classes.resourceCardImage}>
            <Image src={card.image.src} alt={card.image.alt} ratio="3:2" />
          </div>
        ) : undefined
      }
      hero={
        card.tag ? (
          <Label variant="gradient" size="sm">
            {card.tag}
          </Label>
        ) : undefined
      }
      title={card.title}
      description={card.description}
    />
  )
}

/* ------------------------------------------------------------------ the blog hub */

/** The heading every blog shelf shares: a title, an optional line, and `View All` on the trailing edge. */
function blogShelfTitle(spec: { title: string; description?: string; action?: LinkRef }) {
  return (
    <SectionTitle
      title={spec.title}
      description={spec.description}
      /* The shelves set `View All` level with the heading (node `25025:51284`). */
      actionsAlign="top"
      actions={
        spec.action ? (
          <MantineButton
            component="a"
            href={spec.action.href}
            variant="outline"
            /* `Size=Medium` — 48 tall, 18px label. */
            size="md"
            rightSection={<IconArrowRight />}
          >
            {spec.action.label}
          </MantineButton>
        ) : undefined
      }
    />
  )
}

/**
 * A post card's foot, as `Blog Hub` draws it: a 36px portrait, the name over the date, the read time
 * behind a clock — then the topics, 14px and dot-separated. `inline` puts the topics on the byline's
 * row, right-aligned, which is the lead card's wider foot; otherwise they take a row of their own.
 */
type BlogTagStyle = 'text' | 'pill' | 'caps'

/** A post's topics: dot-separated text or small caps, or a row of XS filled labels. */
function BlogTags({ tags, tagStyle = 'text' }: { tags?: string[]; tagStyle?: BlogTagStyle }) {
  return tags?.length ? (
    <ul className={classes.blogTags} data-style={tagStyle} aria-label="Topics">
      {tags.map((tag) => (
        <li key={tag}>
          {tagStyle === 'pill' ? (
            <Label variant="filled" size="xs">
              {tag}
            </Label>
          ) : (
            tag
          )}
        </li>
      ))}
    </ul>
  ) : null
}

type BlogBylineLayout = 'stacked' | 'inline'

function BlogByline({
  post,
  inline,
  tags = true,
  tagStyle,
  layout = 'stacked',
  avatarSize = 36,
}: {
  post: BlogPostSpec
  inline?: boolean
  tags?: boolean
  tagStyle?: BlogTagStyle
  layout?: BlogBylineLayout
  /** The stacked byline's portrait — 36 in the hub frame, 32 in `Common Cards` `Type=Blog`. */
  avatarSize?: number
}) {
  /*
   * `Common Cards` `Type=Blog` (node `24980:63861`): one row — a 28px portrait 8 from the name, then the
   * date and read time behind 4px dots. No clock; the read time is set semibold instead.
   */
  if (layout === 'inline') {
    return (
      <div className={classes.blogByline}>
        <div className={classes.blogBylineRow}>
          {post.author ? (
            <>
              <Avatar
                src={post.author.avatar?.src}
                alt=""
                name={post.author.name}
                size={28}
                color="blue"
                variant="filled"
                className={post.author.brand ? classes.blogAvatarBrand : undefined}
              />
              <span className={classes.blogBylineName}>{post.author.name}</span>
            </>
          ) : null}
          {post.date ? <span className={classes.blogBylineDate}>{post.date}</span> : null}
          {post.readTime ? <span className={classes.blogBylineReadInline}>{post.readTime}</span> : null}
        </div>
        {tags ? <BlogTags tags={post.tags} tagStyle={tagStyle} /> : null}
      </div>
    )
  }

  return (
    <div className={classes.blogByline} data-inline={inline || undefined}>
      <div className={classes.blogBylineAuthor}>
        {post.author ? (
          <Avatar
            src={post.author.avatar?.src}
            alt=""
            name={post.author.name}
            size={avatarSize}
            color="blue"
            variant="filled"
            className={post.author.brand ? classes.blogAvatarBrand : undefined}
          />
        ) : null}
        {post.author || post.date ? (
          <span className={classes.blogBylineWho}>
            {post.author ? <span className={classes.blogBylineName}>{post.author.name}</span> : null}
            {post.date ? <span className={classes.blogBylineDate}>{post.date}</span> : null}
          </span>
        ) : null}
        {post.readTime ? (
          <span className={classes.blogBylineRead}>
            <IconTime aria-hidden />
            {post.readTime}
          </span>
        ) : null}
      </div>
      {tags ? <BlogTags tags={post.tags} tagStyle={tagStyle} /> : null}
    </div>
  )
}

/**
 * One post. `vertical` is the grid's card and the shelf's lead — the picture bled to the edge, 20px
 * under it. `horizontal` is the shelf's stacked card: a 200x133 picture leading, the text beside it.
 * `glass` by default, because every one of them is a link; `plain` takes the surface and its padding
 * away and leaves the hover on the picture, as the resource card does.
 */
function BlogPostCard({
  post,
  align = 'vertical',
  card = 'glass',
  tagPosition = 'bottom',
  tagStyle = 'text',
  byline = 'stacked',
  inlineTags,
}: {
  post: BlogPostSpec
  align?: 'vertical' | 'horizontal'
  card?: 'glass' | 'plain' | 'overlay' | 'blog' | 'blogGlass'
  tagPosition?: 'top' | 'bottom'
  tagStyle?: BlogTagStyle
  byline?: BlogBylineLayout
  inlineTags?: boolean
}) {
  /*
   * The two `Common Cards` blog cells fix their topics as small caps over the title — the cell, not a
   * choice. `Blog- no padding` is plain; `Type=Blog` keeps the glass surface.
   */
  const blogCell = card === 'blog'
  const blogGlass = card === 'blogGlass'
  if (blogCell || blogGlass) {
    tagPosition = 'top'
    tagStyle = 'caps'
  }
  const top = tagPosition === 'top'
  const plain = card === 'plain' || blogCell
  /* The overlay has no row to sit its text beside, so a horizontal card falls back to glass. */
  const overlay = card === 'overlay' && align === 'vertical'
  return (
    <Card
      component="a"
      href={post.href}
      surface={plain ? 'none' : 'glass'}
      interactive
      align={align}
      imageSide="leading"
      padding={plain || overlay ? 'none' : align === 'vertical' ? 'content' : 'all'}
      className={classes.blogCard}
      data-blog-align={align}
      data-overlay={overlay || undefined}
      data-card={card}
      data-byline={byline}
      image={
        overlay ? (
          /* A bare image, so it fills the 4:5 card rather than holding `Image`'s 3:2 box inside it. */
          <img src={post.image.src} alt={post.image.alt} />
        ) : (
          <Image src={post.image.src} alt={post.image.alt} ratio="3:2" />
        )
      }
      hero={top ? <BlogTags tags={post.tags} tagStyle={tagStyle} /> : undefined}
      title={post.title}
      /* Pills take a row of their own under the byline, as the frame draws them, even on the lead card. */
      bottom={
        <BlogByline
          post={post}
          inline={inlineTags && !top && tagStyle === 'text'}
          tags={!top}
          tagStyle={tagStyle}
          layout={byline}
          avatarSize={blogGlass ? 32 : undefined}
        />
      }
    />
  )
}

/** `Featured Blogs`, `Most Recent Blogs` — three across at 24px, or two columns of compact rows. */
function BlogGridSection({ spec }: { spec: Extract<SectionSpec, { type: 'blogGrid' }> }) {
  return (
    <Section title={blogShelfTitle(spec)}>
      <SimpleGrid
        cols={spec.align === 'horizontal' ? { base: 1, md: 2 } : { base: 1, sm: 2, md: 3 }}
        spacing={spec.align === 'horizontal' ? 16 : 24}
        /* Rows 40 apart, so a second row of cards reads as a new row rather than more of the first. */
        verticalSpacing={spec.align === 'horizontal' ? 16 : 40}
      >
        {spec.posts.map((post) => (
          <BlogPostCard
            key={post.href}
            post={post}
            align={spec.align}
            card={spec.card}
            tagPosition={spec.tagPosition}
            tagStyle={spec.tagStyle}
            byline={spec.byline}
          />
        ))}
      </SimpleGrid>
    </Section>
  )
}

/** A topic shelf: the lead post beside a stack of the next ones, the two columns ending together. */
function BlogFeatureSection({ spec }: { spec: Extract<SectionSpec, { type: 'blogFeature' }> }) {
  return (
    <Section title={blogShelfTitle(spec)}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={24}>
        <BlogPostCard
          post={spec.lead}
          card={spec.card}
          tagPosition={spec.tagPosition}
          tagStyle={spec.tagStyle}
          byline={spec.byline}
          inlineTags
        />
        {/*
         * Cards with no surface have no edge to tell one row from the next, so the stack rules them off.
         * Each card sits in a row of its own so the rule belongs to the row, not to the card.
         */}
        <div
          className={classes.blogStack}
          data-divided={spec.card === 'plain' || spec.card === 'blog' || undefined}
        >
          {spec.posts.map((post) => (
            <div key={post.href} className={classes.blogStackRow}>
              <BlogPostCard
                post={post}
                card={spec.card}
                tagPosition={spec.tagPosition}
                tagStyle={spec.tagStyle}
                byline={spec.byline}
                align="horizontal"
              />
            </div>
          ))}
        </div>
      </SimpleGrid>
    </Section>
  )
}

/**
 * The 270x180 tile a customer-story card carries when there is no thumbnail for that customer — a drawn
 * stand-in, so a story can be written before its artwork exists. The eight the file draws have real
 * marks now; see `customer-thumbnails.ts`.
 */
const logoTile = (name: string) => {
  const hue = [...name].reduce((total, ch) => total + ch.charCodeAt(0), 0) % 360
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="360" viewBox="0 0 540 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${hue} 70% 34%)"/>
    <stop offset="1" stop-color="hsl(${hue} 80% 12%)"/>
  </linearGradient></defs>
  <rect width="540" height="360" fill="url(#g)"/>
  <text x="270" y="196" font-size="46" font-weight="700" text-anchor="middle"
        fill="#fff" font-family="Source Sans 3, sans-serif">${name}</text>
</svg>`)}`
}

function StoryCard({ story, surface = 'static' }: { story: StorySpec; surface?: 'glass' | 'static' }) {
  return (
    <Card
      /* A quote is content, not a destination — so even on glass it does not lift or take a pointer. */
      surface={surface}
      interactive={false}
      image={
        <Image
          src={CUSTOMER_THUMBNAILS[story.customer] ?? logoTile(story.customer)}
          alt={
            CUSTOMER_THUMBNAILS[story.customer]
              ? customerThumbnailAlt(story.customer)
              : story.customer
          }
          ratio="3:2"
          radius="sm"
        />
      }
      /* A testimonial without a figure leads straight into the quote. */
      top={
        story.value ? (
          <Stat
            value={
              <>
                {story.prefix ? unit(story.prefix) : null}
                {story.value}
                {story.suffix ? unit(story.suffix) : null}
              </>
            }
            label={story.label}
          />
        ) : undefined
      }
      description={`“${story.quote}”`}
      bottom={<Quotee name={story.name} title={story.role} />}
    />
  )
}

/** `Type=Carousel` — centre-titled, bleeding off both edges, arrows rather than dots. */
/**
 * `All Stories` — the whole catalog behind a filter bar.
 *
 * The selection lives here rather than in the bar, because the grid below is the thing it changes and
 * a bar that owned it would have to hand it back out anyway. `useMemo` on the filtered list, not on
 * taste: this runs on every keystroke of a checkbox against every card in the catalog.
 */
function StoryCatalogSection({ spec }: { spec: Extract<SectionSpec, { type: 'storyCatalog' }> }) {
  const [selection, setSelectionState] = useState<StorySelection>({})
  const [page, setPage] = useState(1)
  const matched = useMemo(
    () => spec.cards.filter((card) => matchesSelection(card.facets, selection)),
    [spec.cards, selection],
  )
  /* A new filter is a new list: page 3 of the old one means nothing in it. */
  const setSelection: typeof setSelectionState = (update) => {
    setSelectionState(update)
    setPage(1)
  }
  const pageSize = spec.pageSize ?? matched.length
  const pages = Math.max(1, Math.ceil(matched.length / Math.max(1, pageSize)))
  const current = Math.min(page, pages)
  const shown = spec.pageSize ? matched.slice((current - 1) * pageSize, current * pageSize) : matched

  return (
    <Section
      title={
        <Stack gap={16} w="100%">
          <Group justify="space-between" align="baseline" wrap="nowrap">
            <SectionTitle title={spec.title} />
            <ResultCount count={matched.length} total={spec.cards.length} />
          </Group>
          <StoryFilterBar
            filters={spec.filters}
            selection={selection}
            onSelectionChange={setSelection}
          />
        </Stack>
      }
    >
      {shown.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {shown.map((card, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <GridCard key={`${card.title}-${i}`} card={card} />
          ))}
        </SimpleGrid>
      ) : (
        /*
         * An empty result is a state, not a blank. Without it the page just ends after the filter bar
         * and reads as broken rather than as a filter that matched nothing.
         */
        <Text c="var(--sds-surfaces-text-secondary)" fz={18}>
          No stories match these filters.
        </Text>
      )}
      {spec.pageSize && matched.length ? (
        <CatalogPagination
          page={current}
          pages={pages}
          from={(current - 1) * pageSize + 1}
          to={(current - 1) * pageSize + shown.length}
          total={matched.length}
          onPage={setPage}
        />
      ) : null}
    </Section>
  )
}

/**
 * The catalog's `Pagination` (node `24581:100572`): `Showing 1 to 9` in primary and `of 68 entries` in
 * secondary on the left; on the right the carousel's 44x40 outline arrows either side of numbered
 * `Tabs Pill`s, the current page filled.
 *
 * Five numbers at most, centred on the current page where there is room, so the row never outgrows a
 * phone however long the list.
 */
function CatalogPagination({
  page,
  pages,
  from,
  to,
  total,
  onPage,
}: {
  page: number
  pages: number
  from: number
  to: number
  total: number
  onPage: (page: number) => void
}) {
  const span = Math.min(5, pages)
  const first = Math.min(Math.max(1, page - Math.floor(span / 2)), pages - span + 1)
  const numbers = Array.from({ length: span }, (_, i) => first + i)

  return (
    <nav className={classes.pager} aria-label="Pages">
      <p className={classes.pagerSummary} aria-live="polite">
        Showing {from} to {to} <span>of {total} entries</span>
      </p>
      <div className={classes.pagerControls}>
        <Button
          variant="outline"
          size="sm"
          className={classes.pagerArrow}
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <IconArrowLeft aria-hidden />
        </Button>
        {numbers.map((n) => (
          <UnstyledButton
            key={n}
            className={classes.pagerPage}
            data-active={n === page || undefined}
            aria-current={n === page ? 'page' : undefined}
            aria-label={`Page ${n}`}
            onClick={() => onPage(n)}
          >
            {n}
          </UnstyledButton>
        ))}
        <Button
          variant="outline"
          size="sm"
          className={classes.pagerArrow}
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        >
          <IconArrowRight aria-hidden />
        </Button>
      </div>
    </nav>
  )
}

function CustomerStoriesSection({
  spec,
}: {
  spec: Extract<SectionSpec, { type: 'customerStories' }>
}) {
  return (
    <Section
      bleed={spec.layout !== 'grid'}
      title={
        <SectionTitle
          align={spec.align ?? 'center'}
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
          actions={
            spec.action ? (
              /* Mantine's `Button`, as the hero's: a destination has to be an anchor. */
              <MantineButton component="a" href={spec.action.href} variant="outline" size="sm" rightSection={<IconArrowRight />}>
                {spec.action.label}
              </MantineButton>
            ) : undefined
          }
        />
      }
    >
      {spec.layout === 'grid' ? (
        /* Inside the content width, unlike the carousel, so the row lines up with the sections around it. */
        <SimpleGrid cols={{ base: 1, sm: 2, md: Math.min(spec.stories.length, 3) }} spacing={13} className={classes.storyGrid}>
          {spec.stories.map((story) => (
            <StoryCard key={story.customer} story={story} surface={spec.surface} />
          ))}
        </SimpleGrid>
      ) : (
        <Carousel label={spec.title} gutter={80} indicators="none" arrows>
          {spec.stories.map((story) => (
            <StoryCard key={story.customer} story={story} surface={spec.surface} />
          ))}
        </Carousel>
      )}
    </Section>
  )
}

/** `Logos scrolling section` — 64px monochrome logos, flush against the band above. */
function LogoMarqueeSection({ spec }: { spec: Extract<SectionSpec, { type: 'logoMarquee' }> }) {
  return (
    <Section spacing="none" pt={24}>
      <Marquee label={spec.label} monochrome size="lg">
        {spec.logos.map((name) => (
          <Wordmark key={name} name={name} />
        ))}
      </Marquee>
    </Section>
  )
}

/**
 * `Type=Tabbed- Content` — a centred title, a pill bar, and a panel the bar swaps.
 *
 * The 776px bar width is the type's, and it is explicit for the same reason as the card grid's: a pill
 * bar is its own `inline-size` container and collapses to nothing in a centred column.
 */
function TabbedContentSection({ spec }: { spec: Extract<SectionSpec, { type: 'tabbedContent' }> }) {
  const [tab, setTab] = useState(spec.tabs[0]?.value ?? '')
  const panel: PanelSpec | undefined = spec.tabs.find((t) => t.value === tab)?.content

  /*
   * Which accordion row is open, so the media can follow it.
   *
   * The accordion is left to own its own value rather than being driven from here: owning `value` is
   * what turns its autoplay off, and the panel opening itself row by row is the whole behaviour of this
   * section. So it reports through `onChange` — including its automatic advances — and this is a mirror
   * of its state rather than the source of it.
   *
   * Keyed by row, and reset when the tab changes: the panels have different rows, and a stale question
   * from the last tab matches nothing and would leave the media on the fallback.
   */
  const [openRow, setOpenRow] = useState<string | null>(null)
  const firstRow = panel?.items?.[0]?.question ?? null
  const activeRow = panel?.items?.find((item) => item.question === openRow) ?? panel?.items?.[0]
  const media = activeRow?.media ?? panel?.media

  if (spec.layout === 'columns') {
    return (
      <Section
        title={
          <SectionTitle
            align="center"
            title={highlightPhrase(spec.title, spec.titleHighlight, true)}
            description={spec.description}
          />
        }
      >
        {/*
         * The tracks side by side, 40 apart, each its label as a heading over its own accordion — read and
         * compared, so neither autoplays and each opens its first row. Stacked under 992.
         */}
        <SimpleGrid cols={{ base: 1, md: spec.tabs.length }} spacing={40} verticalSpacing={48}>
          {spec.tabs.map((track) => (
            <Stack key={track.value} gap={24}>
              <h3 className={classes.trackHeading}>{track.label}</h3>
              <Accordion size="lg" order={4} defaultValue={track.content.items?.[0]?.question}>
                {(track.content.items ?? []).map((item) => (
                  <Accordion.Item key={item.question} value={item.question}>
                    <Accordion.Control icon={item.icon ? ICONS[item.icon] : undefined}>
                      {item.question}
                    </Accordion.Control>
                    <Accordion.Panel>
                      <p>{item.answer}</p>
                      {item.list?.length ? (
                        <ul className={classes.accList}>
                          {item.list.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : null}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Stack>
          ))}
        </SimpleGrid>
      </Section>
    )
  }

  return (
    <Section
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      {/*
        * 24, which is what the file draws between the bar and the panel in *both* tabbed sections —
        * `Tabs Pill Menu` ends at 248 and `Content` starts at 272. The hand-written Home template used
        * 40 on one of them and 24 on the other; porting to data is what caught it.
        */}
      <Stack gap={24} align="center" w="100%">
        {/*
          * The bar's width is drawn, not measured — and it has to be, twice over.
          *
          * A pill bar is its own `inline-size` container, so `fit-content` collapses it to nothing in a
          * flex column: measured, it rendered as a 10px sliver. And `grow` shares whatever width it has
          * equally between the tabs, so a fixed 776 — the file's number for the Home page's *three*
          * tabs — cuts `Digital Commerce` off mid-word when a detail page puts five in it.
          *
          * So the width steps with the count: the file's 776 up to three, and 1080 beyond, which is
          * five labels at the same padding and still inside the 1280 column.
          */}
        {/* One tab is nothing to switch between, so the bar is left out and the panel stands alone. */}
        {spec.tabs.length > 1 ? (
        <Tabs
          variant="pills"
          /* An icon on each pill costs about 40 a tab, so three with icons need 900 to keep their labels whole. */
          w={{ base: '100%', md: spec.tabs.length > 3 ? 1080 : spec.tabs.some((t) => t.icon) ? 900 : 776 }}
          maw="100%"
          value={tab}
          onChange={(v) => {
            setTab(v ?? '')
            /* A new panel has different rows; keeping the old one would match nothing. */
            setOpenRow(null)
          }}
        >
          <Tabs.List grow={spec.tabs.length <= 3}>
            {spec.tabs.map((t) => (
              <Tabs.Tab key={t.value} value={t.value} leftSection={t.icon ? ICONS[t.icon] : undefined}>
                {t.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
        ) : null}

        {panel ? (
          <ContentMedia
            /*
             * Full width, always. The stack centres its children, which sizes them to their content — so
             * with every row closed the panel shrank to its shortest question and the media went with it.
             */
            w="100%"
            mediaSide={spec.mediaSide ?? 'right'}
            /* The accordion grows and shrinks as rows open; the picture stays where it can be seen. */
            stickyMedia
            /* A stat row under the media makes the column taller than 3:2, so the box takes its height. */
            mediaRatio={panel.stats?.length ? 'auto' : '3:2'}
            order={3}
            eyebrow={
              panel.label ? (
                <Label variant="gradient" size="sm">
                  {panel.label}
                </Label>
              ) : panel.eyebrow ? (
                GLASS[panel.eyebrow](40)
              ) : undefined
            }
            title={panel.title}
            description={panel.description}
            actions={
              panel.action ? (
                <Link href={panel.action.href} size="lg" rightSection={<IconArrowRight />}>
                  {panel.action.label}
                </Link>
              ) : undefined
            }
            media={
              media ? (
                /*
                 * One object, not two stacked. The container and the gap are what make the stat row
                 * read as belonging to the picture rather than sitting under it — see `.mediaStats`.
                 * Without stats there is nothing to contain, so the frame does not appear.
                 */
                <div className={panel.stats?.length ? classes.mediaStats : undefined}>
                  {/*
                   * `HeroMedia` rather than `Image`, because a row's media can be a clip: it plays the
                   * video, falls back to the poster or the still when the file is missing, and holds the
                   * first frame under `prefers-reduced-motion`. Keyed by `src`, so switching rows
                   * remounts the element and the new clip starts from its own first frame rather than
                   * inheriting the last one's playback position.
                   */}
                  <CrossfadeMedia media={media} />
                  {panel.stats?.length ? (
                    /* Keyed by the tab, so the figures count again when the panel changes. */
                    <StatBar key={tab} align="center">
                      {panel.stats.map((st, i) => renderStat(st, 'center', i))}
                    </StatBar>
                  ) : null}
                </div>
              ) : undefined
            }
          >
            {panel.points?.length ? <KeyPoints points={panel.points} /> : null}
            {panel.note ? (
              <p className={classes.panelNote}>
                <span>{panel.note.label}</span>
                {panel.note.text}
              </p>
            ) : null}
            {panel.proof ? (
              /* The tab's proof: the figure in the accent, what it measures, the customer, its story. */
              <p className={classes.panelProof}>
                <strong>{panel.proof.value}</strong> {panel.proof.label}
                <span aria-hidden> · </span>
                {panel.proof.customer}
                {panel.proof.href ? (
                  <>
                    {' '}
                    <Link href={panel.proof.href} size="sm" rightSection={<IconArrowRight />}>
                      {panel.proof.linkLabel ?? 'Read the story'}
                    </Link>
                  </>
                ) : null}
              </p>
            ) : null}
            {panel.items?.length ? (
              /*
               * The panel opens itself, row by row. A tabbed section is the page showing what it can do
               * rather than answering a question the reader arrived with — the FAQ block is the other
               * one, and it deliberately does not do this: someone reading an FAQ came for one answer.
               */
              <Accordion
                size="lg"
                order={4}
                autoplay
                /* The panel is showing what the platform does; the open row is what it is saying. */
                spotlight
                defaultValue={firstRow ?? undefined}
                onChange={(value) => setOpenRow(value)}
              >
                {panel.items.map((item) => (
                  <Accordion.Item key={item.question} value={item.question}>
                    <Accordion.Control icon={item.icon ? ICONS[item.icon] : undefined}>
                      {item.question}
                    </Accordion.Control>
                    <Accordion.Panel>
                      <p>{item.answer}</p>
                      {item.list?.length ? (
                        <ul className={classes.accList}>
                          {item.list.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : null}
                      {item.link ? (
                        <Link href={item.link.href} size="md" rightSection={<IconArrowRight />}>
                          {item.link.label}
                        </Link>
                      ) : null}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : null}
          </ContentMedia>
        ) : null}
      </Stack>
    </Section>
  )
}

/**
 * `Type=Full Card` — one horizontal card over a rule of tabs.
 *
 * `{tab}` in the card's title or a link label is replaced with the active tab, because the file draws
 * one card that the bar relabels rather than a card per industry. See the note in `page-schema.ts`.
 */
function FullCardSection({ spec }: { spec: Extract<SectionSpec, { type: 'fullCard' }> }) {
  const [tab, setTab] = useState(spec.tabs?.[0] ?? '')
  const fill = (text: string) => text.replace(/\{tab\}/g, tab)

  return (
    <Section
      gap={24}
      title={<SectionTitle title={highlightPhrase(spec.title, spec.titleHighlight, true)} />}
      footer={
        spec.tabs?.length ? (
          /* Full width so the bar fills the row and scrolls, rather than centring at its own width. */
          <Tabs w="100%" value={tab} onChange={(v) => setTab(v ?? '')}>
            <Tabs.List grow>
              {spec.tabs.map((name) => (
                <Tabs.Tab key={name} value={name}>
                  {name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        ) : undefined
      }
    >
      <Card
        align="horizontal"
        /* Its links do the work — see the nested-interactive note in Card's docs. */
        interactive={false}
        titleSize="full"
        hero={spec.card.icon ? GLASS[spec.card.icon](48) : undefined}
        title={fill(spec.card.title)}
        description={spec.card.description}
        main={
          spec.card.links?.length ? (
            <Stack gap={12} align="flex-start">
              {spec.card.links.map((link) => (
                <Link key={link.label} href={link.href} size="md" rightSection={<IconArrowRight />}>
                  {fill(link.label)}
                </Link>
              ))}
            </Stack>
          ) : undefined
        }
        secondary={
          spec.card.stats?.length ? <StatBar>{spec.card.stats.map((st, i) => renderStat(st, undefined, i))}</StatBar> : undefined
        }
        image={
          spec.card.media ? (
            <Image src={spec.card.media.src} alt={spec.card.media.alt} ratio="3:2" radius="md" />
          ) : undefined
        }
      />
    </Section>
  )
}

/**
 * The product constellation — *Everything You Need in One Platform*.
 *
 * `bleed`, unlike the media band's 1000 column: `names="outside"` is 8.2 tiles across, and a cap would be
 * paid for out of card size rather than out of the gutter. The title keeps the gutter — that is what
 * `bleed` means here — and only the figure runs to the edges.
 *
 * The glass icons come out of the same `GLASS` table every other section uses, at the size the tile
 * sets — `CapabilityMap` sizes what it is given, so nothing is passed here.
 *
 * `maxHeight` spends the window's height rather than the column's width, so the whole figure is visible
 * at once on a laptop instead of being scrolled through. See `PRODUCT_MAP_MAX_HEIGHT`.
 */
function CapabilityMapSection({ spec }: { spec: Extract<SectionSpec, { type: 'capabilityMap' }> }) {
  return (
    <Section
      bleed
      gap={40}
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      <CapabilityMap
        names="outside"
        clusters={spec.clusters.map((cluster) => ({
          label: cluster.label,
          items: cluster.items.map((item) => ({
            label: item.label,
            description: item.description,
            href: item.href,
            icon: GLASS[item.icon](48),
          })),
        }))}
        maxHeight={PRODUCT_MAP_MAX_HEIGHT}
        hubIcon={GLASS[spec.hub.icon](56)}
        hubLabel={spec.hub.label}
        hubHref={spec.hub.href}
      />
    </Section>
  )
}

/** A centred band holding one wide graphic. The column is capped at the drawn 1000. */
function MediaBandSection({ spec }: { spec: Extract<SectionSpec, { type: 'mediaBand' }> }) {
  return (
    <Section
      maxWidth={1000}
      gap={40}
      title={<SectionTitle align="center" title={spec.title} />}
    >
      {/*
        * No `src`, no `img`. An empty `src` resolves to the document's own URL, so the browser asks for
        * the page again — the section renders nothing until it has a graphic, which is also the honest
        * picture of a section nobody has filled in yet.
        */}
      {spec.image.src ? (
        <Image src={spec.image.src} alt={spec.image.alt} ratio="auto" fit="contain" />
      ) : null}
    </Section>
  )
}

/**
 * `Type=Integrations Section`, scrolling — a **deliberate divergence from the file.**
 *
 * Figma draws a static wrapping row of 64px glass tiles. A fixed row can only ever show as many
 * integrations as fit across, and the claim the section is making is that there are more than that, so
 * the row scrolls instead: `Marquee`, which brings a measured speed, the edge fade and the pause button
 * WCAG 2.2.2 requires, and a `MeshBackdrop` behind it. The tile stays the drawn 64 square and holds the
 * mark alone. Recorded in the README.
 *
 * Logos arrive as names. A name in the invented set draws its lockup; anything else falls back to the
 * initial tile, so a page carrying real vendor names still renders.
 */
/**
 * `Type=FAQ` — a centred title over an accordion, in a column narrower than the page's.
 *
 * 780 rather than the section's own 1280. A question and its answer are one line of prose each; at full
 * width the chevron ends up a hand's width from the question it belongs to, and the eye has to travel
 * the whole measure to find out whether a row is open.
 *
 * No `autoplay`, unlike the tabbed section's accordion. That one is the page showing what it can do and
 * opening itself is how it does the showing; someone reading an FAQ came for one answer, and moving it
 * out from under them after five seconds is the opposite of helping.
 */
/**
 * `Key Point Main List` — the checked list the detail pages put under a panel's paragraph.
 *
 * `List` with `marker="check"` is Figma's own `Type=Icon` cell, so the tick is the design's rather than
 * a character typed into the copy. Each point is a bold claim with an optional line under it, which is
 * how the file draws them: the claim is the thing being skimmed, the line is for whoever stopped.
 */
function KeyPoints({ points }: { points: { title: string; description?: string }[] }) {
  return (
    <List marker="check" spacing={16}>
      {points.map((point, i) => (
        /* Position, not the text: the file draws three points that all read `Key Point Main List`. */
        // eslint-disable-next-line react/no-array-index-key
        <List.Item key={i}>
          <Text fw={600}>{point.title}</Text>
          {point.description ? (
            <Text c="var(--sds-surfaces-text-secondary)">{point.description}</Text>
          ) : null}
        </List.Item>
      ))}
    </List>
  )
}

/**
 * `Type=Content Left Image` / `Content- Right Image` — the detail pages' workhorse.
 *
 * A label, a heading, a paragraph, the key points and a link on one side; a photograph on the other. It
 * is `ContentMedia`, which is the same component the tabbed section puts inside its panels — the
 * difference is that this one is the section rather than the thing a tab swaps.
 */
/**
 * `Type=Customer Story` — one story across the section, not a card.
 *
 * **No card frame.** It was a `Card align="horizontal"` and that was wrong twice over: the file draws
 * the logo and the words directly on the page, and a card around them says "this is one item in a set"
 * when it is the only thing in the section. `ContentMedia` is the same two columns without the border,
 * and it is what the neighbouring `Content Left Image` cell already uses — which is the tell that these
 * two cells are the same construction with different contents.
 *
 * The figures go in the body and the link in the actions, so the order is title, paragraph, figures,
 * link: the numbers are the claim and the link is what to do about it.
 */
function CustomerStorySection({ spec }: { spec: Extract<SectionSpec, { type: 'customerStory' }> }) {
  return (
    <Section>
      <ContentMedia
        mediaSide={spec.mediaSide ?? 'left'}
        mediaRatio="3:2"
        order={2}
        title={spec.title}
        description={spec.description}
        actions={
          spec.action ? (
            <Link href={spec.action.href} size="md" rightSection={<IconArrowRight />}>
              {spec.action.label}
            </Link>
          ) : undefined
        }
        media={
          spec.media ? (
            <Image src={spec.media.src} alt={spec.media.alt} ratio="3:2" radius="md" />
          ) : undefined
        }
      >
        {spec.stats?.length ? (
          <StatBar>{spec.stats.map((st, i) => renderStat(st, undefined, i))}</StatBar>
        ) : null}
      </ContentMedia>
    </Section>
  )
}

function ContentBlockSection({ spec }: { spec: Extract<SectionSpec, { type: 'contentBlock' }> }) {
  return (
    <Section>
      <ContentMedia
        mediaSide={spec.mediaSide ?? 'right'}
        mediaRatio="3:2"
        order={2}
        eyebrow={
          spec.label ? (
            <Label variant="gradient" size="sm">
              {spec.label}
            </Label>
          ) : undefined
        }
        title={highlightPhrase(spec.title, spec.titleHighlight, true)}
        description={spec.description}
        actions={
          spec.buttons?.length ? (
            <Group gap={16}>
              {spec.buttons.map((button) => (
                /* Mantine's `Button`, as the hero's: a CTA has to be an anchor. */
                <MantineButton
                  key={button.label}
                  component="a"
                  href={button.href}
                  size="md"
                  variant={button.variant === 'outline' ? 'outline' : 'filled'}
                >
                  {button.label}
                </MantineButton>
              ))}
            </Group>
          ) : spec.action ? (
            <Stack gap={8} align="flex-start">
              {spec.actionLead ? (
                <Text fz={18} lh={1.25} c="var(--sds-surfaces-text-secondary)">
                  {spec.actionLead}
                </Text>
              ) : null}
              <Link href={spec.action.href} size="md" rightSection={<IconArrowRight />}>
                {spec.action.label}
              </Link>
            </Stack>
          ) : undefined
        }
        media={
          spec.media ? (
            <Image src={spec.media.src} alt={spec.media.alt} ratio="3:2" radius="md" />
          ) : undefined
        }
      >
        {spec.points?.length ? <KeyPoints points={spec.points} /> : null}
      </ContentMedia>
    </Section>
  )
}

function FaqSection({ spec }: { spec: Extract<SectionSpec, { type: 'faq' }> }) {
  const side = spec.layout === 'side'
  const takeaways = spec.takeaways?.length ? (
    /* `Key takeaways` — what the answers add up to, for the reader who reads nothing else. */
    <div className={classes.faqTakeaways} data-layout={side ? 'side' : undefined}>
      <span className={classes.faqTakeawaysLabel}>Key takeaways</span>
      <List marker="check" spacing={12}>
        {spec.takeaways.map((line) => (
          <List.Item key={line}>{line}</List.Item>
        ))}
      </List>
    </div>
  ) : null
  const questions = (
    <Accordion size="lg" order={3} defaultValue={spec.items[0]?.question}>
      {spec.items.map((item) => (
        <Accordion.Item key={item.question} value={item.question}>
          <Accordion.Control>{item.question}</Accordion.Control>
          <Accordion.Panel>
            <p>{item.answer}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
  const footnotes = spec.footnotes?.length ? (
    <ol className={classes.footnotes}>
      {spec.footnotes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ol>
  ) : null

  return (
    <Section
      maxWidth={side ? undefined : 780}
      title={
        <SectionTitle
          align={side ? 'left' : 'center'}
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      {side ? (
        /* The questions 900 wide, the takeaways a 320 column 48 beside them; stacked under 992. */
        <div className={classes.faqSide}>
          <div>
            {questions}
            {footnotes}
          </div>
          {takeaways}
        </div>
      ) : (
        <>
          {takeaways}
          {questions}
          {footnotes}
        </>
      )}
    </Section>
  )
}

/**
 * `Type=Quick Links` — a left title over a grid of small horizontal cards.
 *
 * `align="horizontal"` on `Card` is what the file draws: an icon and a label on one line, at a card's
 * own height rather than a grid cell's. They are the page's exits, so every one is a link and the grid
 * is three across, wrapping to whatever the content needs.
 */
function QuickLinksSection({ spec }: { spec: Extract<SectionSpec, { type: 'quickLinks' }> }) {
  return (
    <Section
      gap={24}
      title={
        <SectionTitle
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          actions={
            spec.action ? (
              <MantineButton
                component="a"
                href={spec.action.href}
                variant="outline"
                size="md"
                rightSection={<IconArrowRight />}
              >
                {spec.action.label}
              </MantineButton>
            ) : undefined
          }
        />
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={16}>
        {spec.links.map((link) => (
          <Card
            key={link.label}
            component="a"
            href={link.href}
            surface="glass"
            padding="all"
            /*
             * The icon and the label share a line, which is the whole shape of this cell — a row of
             * exits, each one line tall. `hero` would stack them, because a hero is a block above a
             * title rather than something beside it, so the pair is composed in the title itself.
             */
            title={
              <Group gap={12} wrap="nowrap" align="center">
                {link.icon ? GLASS[link.icon](24) : null}
                <span>{link.label}</span>
              </Group>
            }
          />
        ))}
      </SimpleGrid>
    </Section>
  )
}

/**
 * `Type=Highlight Text` — one wide card on the brand gradient, led by a glass icon.
 *
 * `spacing="tight"`, which is the file's own 40px block padding on this cell and on `Quote`: it is a
 * paragraph lifted out of the page rather than a section of its own, so it sits closer to what comes
 * before and after than a section would.
 */
function HighlightTextSection({ spec }: { spec: Extract<SectionSpec, { type: 'highlightText' }> }) {
  if (spec.surface === 'glass') {
    return (
      <Section spacing="tight">
        {/* `Still Evaluating?` (node `205:12359`): one glass bar — icon, heading and line, then the ask. */}
        <div className={classes.highlightBar}>
          {spec.icon ? <span className={classes.highlightBarIcon}>{GLASS[spec.icon](64)}</span> : null}
          <div className={classes.highlightBarText}>
            <h2>{spec.title}</h2>
            <p>{spec.body}</p>
          </div>
          {spec.action ? (
            <MantineButton
              component="a"
              href={spec.action.href}
              variant="outline"
              size="md"
              rightSection={<IconArrowRight />}
            >
              {spec.action.label}
            </MantineButton>
          ) : null}
        </div>
      </Section>
    )
  }

  return (
    <Section spacing="tight">
      <Card
        /* `highlighted` is the card set's own gradient cell — the ground this section is drawn on. */
        surface="highlighted"
        padding="all"
        hero={spec.icon ? GLASS[spec.icon](40) : undefined}
        /* A real heading: the card is a section of its own, and its title is often the page's question. */
        title={<h2 className={classes.cardHeading}>{spec.title}</h2>}
        description={spec.body}
        bottom={
          spec.action ? (
            spec.action.style === 'button' ? (
              <MantineButton
                component="a"
                href={spec.action.href}
                size="md"
                rightSection={<IconArrowRight />}
              >
                {spec.action.label}
              </MantineButton>
            ) : (
              <Link href={spec.action.href} size="md" rightSection={<IconArrowRight />}>
                {spec.action.label}
              </Link>
            )
          ) : undefined
        }
      />
    </Section>
  )
}

/**
 * A `Stats Bar` as a band of its own — what `Contact Sales` puts directly under its hero.
 *
 * `spacing="tight"` for the same reason `Highlight Text` uses it, and no title: the figures are the
 * claim, and a heading over them would be a second one.
 */
/** One block of an article section's running content — see `ArticleBlock`. */
function ArticleBlockView({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className={classes.articleParagraph}>{block.text}</p>
    case 'list':
      return (
        <ol className={classes.articleList}>
          {block.items.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>{item}</li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <figure className={classes.articleQuote}>
          <span className={classes.articleQuoteMark} aria-hidden>
            “
          </span>
          <div className={classes.articleQuoteBody}>
            <blockquote>
              <p>{emphasise(block.text, block.emphasis)}</p>
            </blockquote>
            <figcaption>
              <span className={classes.articleQuoteName}>{block.name}</span>
              {block.role ? <span className={classes.articleQuoteRole}>{block.role}</span> : null}
            </figcaption>
          </div>
        </figure>
      )
    case 'image':
      return (
        <Image
          className={classes.articleImage}
          src={block.image.src}
          alt={block.image.alt}
          ratio={block.image.ratio ?? 'auto'}
          radius="lg"
        />
      )
    default:
      return null
  }
}

/** `text` with each of `phrases` wrapped in `strong`, in the order they appear. */
function emphasise(text: string, phrases: string[] = []) {
  if (!phrases.length) return text
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  return text.split(pattern).map((part, i) =>
    phrases.includes(part) ? (
      // eslint-disable-next-line react/no-array-index-key
      <strong key={i}>{part}</strong>
    ) : (
      part
    ),
  )
}

/**
 * The blog post's body: a sticky `TableOfContents` beside an 800px column of sections, then the call to
 * action and the author. The outline's rows are the section titles, and it follows the reader itself.
 */
function ArticleSection({ spec }: { spec: Extract<SectionSpec, { type: 'article' }> }) {
  /* Prefixed per instance, so two articles on one page cannot share an anchor. */
  const prefix = `article-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const ids = spec.sections.map((_, i) => `${prefix}-${i}`)

  return (
    <Section spacing="tight">
      <div className={classes.article} data-aside={spec.metrics ? 'metrics' : spec.featured ? 'featured' : undefined}>
        <div className={classes.articleOutline}>
          <TableOfContents
            label={spec.outlineLabel}
            items={spec.sections.map((section, i) => ({ label: section.nav ?? section.title, href: `#${ids[i]}` }))}
          />
        </div>

        <div className={classes.articleBody}>
          {spec.sections.map((section, i) => (
            <section key={ids[i]} id={ids[i]} className={classes.articleSection}>
              <h2 className={classes.articleHeading}>{section.title}</h2>
              {section.body?.map((paragraph, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={j} className={classes.articleParagraph}>
                  {paragraph}
                </p>
              ))}
              {section.points?.length ? <KeyPoints points={section.points} /> : null}
              {section.blocks?.map((block, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <ArticleBlockView key={j} block={block} />
              ))}
              {section.subsections?.map((sub, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={j} className={classes.articleSubsection}>
                  <h3 className={classes.articleSubheading}>{sub.title}</h3>
                  {sub.body.map((paragraph, k) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={k} className={classes.articleParagraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          ))}

          {spec.cta ? (
            <a href={spec.cta.href} className={classes.articleCta}>
              {spec.cta.label ? (
                <Label variant="glass" size="sm">
                  {spec.cta.label}
                </Label>
              ) : null}
              <span className={classes.articleCtaText}>
                <Text span fw={600} display="block">
                  {spec.cta.title}
                </Text>
                {spec.cta.description ? (
                  <Text span display="block" c="var(--sds-surfaces-text-secondary)">
                    {spec.cta.description}
                  </Text>
                ) : null}
              </span>
              <IconArrowRight aria-hidden className={classes.articleCtaArrow} />
            </a>
          ) : null}

          {/* Figma `Author` `Type=Card` (node `24223:173058`): a 48px portrait beside the name and title. */}
          {spec.author ? (
            <div className={classes.articleAuthor}>
              <Avatar
                src={spec.author.avatar?.src}
                alt=""
                name={spec.author.name}
                size={48}
                color="blue"
                variant="filled"
              />
              <div className={classes.articleAuthorText}>
                <span className={classes.articleAuthorName}>{spec.author.name}</span>
                {spec.author.title ? <span className={classes.articleAuthorTitle}>{spec.author.title}</span> : null}
              </div>
            </div>
          ) : null}
        </div>

        {/*
          * `Key Metrics` — a glass panel, 20 padding and 8 corners, its bold uppercase 14px title 8 over a stacked
          * `Stats Bar` (`Size=Small, Align=Vertical`).
          */}
        {spec.metrics ? (
          <aside className={classes.articleMetrics} aria-label={spec.metrics.title}>
            <span className={classes.articleMetricsTitle}>{spec.metrics.title}</span>
            <StatBar>{spec.metrics.stats.map((stat, i) => renderStat(stat, undefined, i, { size: 'sm', iconSide: 'right' }))}</StatBar>
          </aside>
        ) : spec.featured ? (
          <aside className={classes.articleFeatured} aria-label={spec.featured.tag ?? 'Featured'}>
            <Card
              component="a"
              href={spec.featured.href}
              surface="glass"
              padding="all"
              image={
                spec.featured.image ? (
                  <div className={classes.resourceCardImage}>
                    <Image src={spec.featured.image.src} alt={spec.featured.image.alt} ratio="3:2" />
                  </div>
                ) : undefined
              }
              hero={
                spec.featured.tag ? (
                  <Label variant="gradient" size="sm">
                    {spec.featured.tag}
                  </Label>
                ) : undefined
              }
              title={spec.featured.title}
            />
          </aside>
        ) : null}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ the partner pages */

/** `What Partners Are Saying` — quote cards: the accent mark, the words, who said them, their story. */
function QuotesSection({ spec }: { spec: Extract<SectionSpec, { type: 'quotes' }> }) {
  return (
    <Section
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      <SimpleGrid cols={{ base: 1, md: spec.quotes.length >= 3 ? 3 : 2 }} spacing={24}>
        {spec.quotes.map((item) => (
          <figure key={item.name} className={classes.quoteCard}>
            <span className={classes.quoteCardHead}>
              <span className={classes.quoteCardMark} aria-hidden>
                “
              </span>
              {item.logo ? <img className={classes.quoteCardLogo} src={item.logo.src} alt={item.logo.alt} /> : null}
            </span>
            <blockquote>
              <p>{item.quote}</p>
            </blockquote>
            <figcaption className={classes.quoteCardFoot}>
              <span>
                <span className={classes.quoteCardName}>{item.name}</span>
                {item.role ? <span className={classes.quoteCardRole}>{item.role}</span> : null}
              </span>
              {item.link ? (
                <Link href={item.link.href} size="md" rightSection={<IconArrowRight />}>
                  {item.link.label}
                </Link>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </SimpleGrid>
    </Section>
  )
}

/** One program-overview cell: a mark for the eye and words for everyone else. */
function TierCell({ value }: { value: boolean | string | { level: number } }) {
  if (typeof value === 'string') return <span className={classes.tierText}>{value}</span>
  if (typeof value === 'boolean') {
    return value ? (
      <span className={classes.tierYes}>
        <IconCheck aria-hidden />
        <span className={classes.visuallyHidden}>Included</span>
      </span>
    ) : (
      /* A quiet dash rather than a mark: the row reads as the ticks, and absence should not compete. */
      <span className={classes.tierNo}>
        <span aria-hidden>—</span>
        <span className={classes.visuallyHidden}>Not included</span>
      </span>
    )
  }
  /* The margin as stacked coins — one per level, overlapping, as the file draws them. */
  return (
    <span className={classes.tierLevel} aria-label={`Level ${value.level} of 4`} role="img">
      {Array.from({ length: value.level }, (_, i) => (
        <span key={i} aria-hidden>
          $
        </span>
      ))}
    </span>
  )
}

/**
 * `Partner Levels Designed for Growth` — the tiers as cards, then the program overview: one table per
 * view behind a pill bar, tiers across the top, rows grouped under their category. It scrolls sideways
 * inside itself on a phone rather than squeezing five columns.
 */
function TierTableSection({ spec }: { spec: Extract<SectionSpec, { type: 'tierTable' }> }) {
  const [view, setView] = useState(spec.tables[0]?.label ?? '')
  const table = spec.tables.find((t) => t.label === view) ?? spec.tables[0]
  const tiers = spec.tiers.map((tier) => tier.name)

  /*
   * The comparison, laid out once whether or not it folds. Fixed columns — the feature a third of the
   * width, the tiers sharing the rest equally — so the marks line up down every column, whatever the
   * length of a tier's name.
   */
  const comparison = table ? (
    <div className={classes.comparison}>
      {spec.overviewTitle || spec.tables.length > 1 ? (
        <Group justify="space-between" align="center" wrap="wrap" gap={16}>
          {spec.overviewTitle ? <h3 className={classes.tierOverviewTitle}>{spec.overviewTitle}</h3> : null}
          {spec.tables.length > 1 ? (
            /* Full width on a phone, so the two pills share the row instead of pushing past it. */
            <Tabs variant="pills" w={{ base: '100%', sm: 360 }} value={view} onChange={(v) => setView(v ?? view)}>
              <Tabs.List grow>
                {spec.tables.map((t) => (
                  <Tabs.Tab key={t.label} value={t.label}>
                    {t.tab ?? t.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          ) : null}
        </Group>
      ) : null}
      <div className={classes.comparisonScroll} data-variant="tiers">
        <table className={`${classes.comparisonTable} ${classes.tierTable}`}>
          <caption className={classes.visuallyHidden}>{table.label}</caption>
          <colgroup>
            <col className={classes.tierTableFeature} />
            {tiers.map((tier) => (
              <col key={tier} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{table.label}</th>
              {tiers.map((tier, i) => (
                <th key={tier} scope="col" data-tier={i}>
                  <span>{tier}</span>
                </th>
              ))}
            </tr>
          </thead>
          {table.groups.map((group) => (
            <tbody key={group.label}>
              <tr className={classes.tierGroup}>
                <th scope="colgroup" colSpan={tiers.length + 1}>
                  {/* Its own sticky box, so the label stays in view while a phone scrolls the tiers. */}
                  <span className={classes.tierGroupLabel}>{group.label}</span>
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <td key={i} data-tier={i}>
                      <TierCell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      {table.note ? <p className={classes.comparisonNote}>{table.note}</p> : null}
    </div>
  ) : null

  return (
    <Section
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      <Stack gap={48}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: spec.tiers.length }} spacing={24}>
          {spec.tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={classes.tierCard}
              data-tier={i}
              data-detailed={tier.points || tier.certified || tier.fee ? '' : undefined}
            >
              <span className={classes.tierName}>{tier.name}</span>
              {tier.points ? (
                /* `0 Points`, `10 + Points` — the score as a 49px figure, the unit beside it at 24. */
                <span className={classes.tierPoints}>
                  <strong>{tier.points}</strong> Points
                </span>
              ) : null}
              {tier.certified ? (
                <span className={classes.tierFact}>
                  <span>Certified</span>
                  {tier.certified}
                </span>
              ) : null}
              <p>{tier.description}</p>
              {tier.fee ? (
                <span className={classes.tierFee}>
                  <span className={classes.tierFactLabel}>Program Performance</span>
                  <span className={classes.tierFeeRow}>
                    <span>Annual Fee</span>
                    <strong>{tier.fee}</strong>
                  </span>
                </span>
              ) : null}
            </div>
          ))}
        </SimpleGrid>
        {spec.tiersNote ? <p className={classes.tierNote}>{spec.tiersNote}</p> : null}

        {comparison && spec.compareLabel ? (
          /* Folded away behind its own toggle, open to start — the cards above are the summary. */
          <details className={classes.compareFold} open>
            <summary>
              <IconGitCompare aria-hidden />
              <span>{spec.compareLabel}</span>
              <IconDown aria-hidden className={classes.compareFoldChevron} />
            </summary>
            {comparison}
          </details>
        ) : (
          comparison
        )}
      </Stack>
    </Section>
  )
}

/**
 * `A Partnership Model for Every Opportunity` — the case on the left, centred against the list; the
 * models on the right, each a 48px glass icon beside its name, what it is, and the boxed note on what
 * Liferay looks for, ruled off from the next.
 */
function PartnershipModelsSection({ spec }: { spec: Extract<SectionSpec, { type: 'partnershipModels' }> }) {
  return (
    <Section>
      <div className={classes.models}>
        <div className={classes.modelsCopy}>
          <SectionTitle title={highlightPhrase(spec.title, spec.titleHighlight, true)} description={spec.description} />
          {spec.note ? <p className={classes.modelsNote}>{spec.note}</p> : null}
          {spec.action ? (
            <MantineButton component="a" href={spec.action.href} size="md" className={classes.modelsAction}>
              {spec.action.label}
            </MantineButton>
          ) : null}
        </div>
        <ul className={classes.modelsList}>
          {spec.models.map((model) => (
            <li key={model.title} className={classes.model}>
              {model.icon ? (
                <span className={classes.modelIcon} aria-hidden>
                  {GLASS[model.icon](48)}
                </span>
              ) : null}
              <div className={classes.modelBody}>
                <h3 className={classes.modelTitle}>{model.title}</h3>
                <p className={classes.modelText}>{model.description}</p>
                {model.lookFor ? (
                  <p className={classes.modelLookFor}>
                    <span>{spec.lookForLabel ?? 'What we look for in a partner:'}</span>
                    {model.lookFor}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/**
 * `Path to Partnership` — the steps after applying, numbered down a rule, beside the application form.
 * With `backdrop: 'mesh'` the footer's colour field drifts behind it, so the ask closes the page lit;
 * `glow` keeps the colour to the top-right corner, drifting in the hero bubble's colours.
 */
function StepsFormSection({ spec }: { spec: Extract<SectionSpec, { type: 'stepsForm' }> }) {
  return (
    <Section
      className={spec.backdrop === 'mesh' ? classes.meshBand : spec.backdrop === 'glow' ? classes.glowBand : undefined}
    >
      {spec.backdrop === 'mesh' ? <Footer.Mesh className={classes.meshBandField} aria-hidden /> : null}
      {/* The corner glow, drifting in the hero bubble's colours on the dark canvas — see `.glowBandField`. */}
      {spec.backdrop === 'glow' ? <Footer.Mesh className={classes.glowBandField} aria-hidden /> : null}
      <div className={classes.stepsForm}>
        <div className={classes.stepsFormCopy}>
          <SectionTitle title={spec.title} description={spec.subtitle} />
          <ol className={classes.steps}>
            {spec.steps.map((step, i) => (
              <li key={step.title}>
                <span className={classes.stepNumber} aria-hidden>
                  {i + 1}
                </span>
                <span className={classes.stepBody}>
                  <span className={classes.stepTitle}>{step.title}</span>
                  <span className={classes.stepText}>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <HeroFormCard spec={spec.form} />
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ the solution page */

/**
 * `Built on Liferay` — real builds, large, in a sideways gallery. Each slide is a browser frame around
 * the screenshot (the address in its bar), then the solution tag, the customer and industry, what they
 * built, the features in it, and the way to their story.
 */
function BuildGallerySection({ spec }: { spec: Extract<SectionSpec, { type: 'buildGallery' }> }) {
  return (
    <Section
      bleed
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
      footer={
        spec.action ? (
          <Link href={spec.action.href} size="md" rightSection={<IconArrowRight />}>
            {spec.action.label}
          </Link>
        ) : undefined
      }
    >
      <Carousel label={spec.title} gutter={80} slideSize="min(620px, 86vw)" gap={24} indicators="none" arrows>
        {spec.builds.map((build) => (
          <article key={build.url} className={classes.buildCard}>
            <div className={classes.buildFrame}>
              <span className={classes.buildFrameBar} aria-hidden>
                <span />
                <span />
                <span />
                <span className={classes.buildFrameUrl}>{build.url}</span>
              </span>
              <Image src={build.image.src} alt={build.image.alt} ratio="16:9" />
            </div>
            <div className={classes.buildMeta}>
              <Label variant="gradient" size="sm">
                {build.tag}
              </Label>
              <span className={classes.buildCustomer}>{build.customer}</span>
              {build.industry ? <span className={classes.buildIndustry}>{build.industry}</span> : null}
            </div>
            <h3 className={classes.buildHeadline}>{build.headline}</h3>
            {build.features?.length ? (
              <Group gap={8} wrap="wrap">
                {build.features.map((feature) => (
                  <Label key={feature} variant="glass" size="sm">
                    {feature}
                  </Label>
                ))}
              </Group>
            ) : null}
            {build.link ? (
              <Link href={build.link.href} size="md" rightSection={<IconArrowRight />}>
                {build.link.label}
              </Link>
            ) : null}
          </article>
        ))}
      </Carousel>
    </Section>
  )
}

const VERDICT: Record<'yes' | 'partial' | 'no', string> = { yes: 'Yes', partial: 'Partial or add-on', no: 'No' }

/** One comparison cell: the mark for the eye, the word for everyone else. */
function Verdict({ value }: { value: 'yes' | 'partial' | 'no' }) {
  return (
    <span className={classes.verdict} data-value={value}>
      <span className={classes.verdictMark} aria-hidden>
        {value === 'yes' ? '✓' : value === 'partial' ? '◐' : '–'}
      </span>
      <span className={classes.verdictText}>{VERDICT[value]}</span>
    </span>
  )
}

/**
 * `Why Liferay` — the differentiators as glass icon cards, then the comparison: a real table, the
 * feature in the row header and Liferay's column first and lit, each cell a mark and its word. It
 * scrolls sideways inside itself on a phone rather than squeezing four columns of verdicts.
 */
function ComparisonSection({ spec }: { spec: Extract<SectionSpec, { type: 'comparison' }> }) {
  return (
    <Section
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      <Stack gap={48}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: spec.cards.length >= 4 ? 4 : 3 }} spacing={24}>
          {spec.cards.map((card) => (
            <Card
              key={card.title}
              surface="static"
              hero={card.icon ? GLASS[card.icon](40) : undefined}
              title={card.title}
              description={card.description}
            />
          ))}
        </SimpleGrid>
        <div className={classes.comparison}>
          <div className={classes.comparisonScroll}>
            <table className={classes.comparisonTable}>
              <caption>{spec.table.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {spec.table.columns.map((column, i) => (
                    <th key={column} scope="col" data-lead={i === 0 || undefined}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spec.table.rows.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {row.values.map((value, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <td key={i} data-lead={i === 0 || undefined}>
                        <Verdict value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {spec.table.links?.length ? (
            <Group gap={24} wrap="wrap">
              {spec.table.links.map((link) => (
                <Link key={link.label} href={link.href} size="md" rightSection={<IconArrowRight />}>
                  {link.label}
                </Link>
              ))}
            </Group>
          ) : null}
          {spec.table.note ? <p className={classes.comparisonNote}>{spec.table.note}</p> : null}
        </div>
      </Stack>
    </Section>
  )
}

/** `$737.5K`, `$1.2M` — the estimate as the card prints it. */
const money = (value: number) =>
  /* Rounded half-up from whole hundreds, not `toFixed`, which rounds 3.05 down to 3.0 in floating point. */
  value >= 1_000_000
    ? `$${Math.round(value / 100_000) / 10}M`
    : `$${Math.round(value / 100) / 10}K`

/**
 * The cost calculator. Two sliders and a horizon on the left; on the right the saving, the two totals
 * as bars, and the email that sends the PDF. Everything is worked out from the spec's model as the
 * inputs move — nothing is fetched, and nothing is sent from a story.
 */
function CostCalculatorSection({ spec }: { spec: Extract<SectionSpec, { type: 'costCalculator' }> }) {
  const [accounts, setAccounts] = useState(spec.accounts.value)
  const [tools, setTools] = useState(spec.tools.value)
  const [years, setYears] = useState(String(spec.horizons[0] ?? 3))
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const y = Number(years)
  const { stack: s, liferay: l } = spec.model
  const stack = s.oneTime + s.perYear * y + tools * (s.perTool + s.perToolPerYear * y) + accounts * s.perAccountPerYear * y
  const liferay = l.oneTime + l.perYear * y + accounts * l.perAccountPerYear * y
  const saving = Math.max(0, stack - liferay)
  const widest = Math.max(stack, liferay, 1)

  return (
    <Section
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      <div className={classes.calculator}>
        <div className={classes.calculatorInputs}>
          <label className={classes.calculatorField}>
            <span className={classes.calculatorFieldHead}>
              {spec.accounts.label}
              <strong>{accounts.toLocaleString('en-US')}</strong>
            </span>
            <input
              type="range"
              className={classes.calculatorRange}
              min={spec.accounts.min}
              max={spec.accounts.max}
              step={spec.accounts.step}
              value={accounts}
              onChange={(event) => setAccounts(Number(event.currentTarget.value))}
            />
          </label>
          <label className={classes.calculatorField}>
            <span className={classes.calculatorFieldHead}>
              {spec.tools.label}
              <strong>{tools}</strong>
            </span>
            <input
              type="range"
              className={classes.calculatorRange}
              min={spec.tools.min}
              max={spec.tools.max}
              step={1}
              value={tools}
              onChange={(event) => setTools(Number(event.currentTarget.value))}
            />
            {spec.tools.hint ? <span className={classes.calculatorHint}>{spec.tools.hint}</span> : null}
          </label>
          <div className={classes.calculatorField} role="group" aria-label="Time horizon">
            <span className={classes.calculatorFieldHead}>Time horizon</span>
            <Tabs variant="pills" value={years} onChange={(v) => setYears(v ?? years)}>
              <Tabs.List grow>
                {spec.horizons.map((h) => (
                  <Tabs.Tab key={h} value={String(h)}>
                    {h} years
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>
        </div>

        <div className={classes.calculatorResult} aria-live="polite">
          <span className={classes.calculatorEyebrow}>Estimated {y}-year savings</span>
          <span className={classes.calculatorSaving}>{money(saving)}</span>
          {[
            { label: s.label, value: stack, tone: 'stack' },
            { label: l.label, value: liferay, tone: 'liferay' },
          ].map((bar) => (
            <div key={bar.tone} className={classes.calculatorBar}>
              <span className={classes.calculatorFieldHead}>
                {bar.label}
                <strong>{money(bar.value)}</strong>
              </span>
              <span className={classes.calculatorTrack}>
                <span data-tone={bar.tone} style={{ width: `${(bar.value / widest) * 100}%` }} />
              </span>
            </div>
          ))}

          <p className={classes.calculatorPrompt}>{spec.report.prompt}</p>
          {sent ? (
            <p className={classes.calculatorSent} role="status">
              {spec.report.success}
            </p>
          ) : (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                  setError('Enter a valid work email, like name@company.com.')
                  return
                }
                setError(null)
                setSent(true)
              }}
            >
              <TextInput
                type="email"
                aria-label="Work email"
                placeholder={spec.report.placeholder}
                value={email}
                error={error ?? undefined}
                onChange={(event) => {
                  setEmail(event.currentTarget.value)
                  if (error) setError(null)
                }}
                containedButton={
                  <Button type="submit" size="sm" rightSection={<IconArrowRight />}>
                    {spec.report.submit}
                  </Button>
                }
              />
            </form>
          )}
          {spec.compare ? (
            <Link href={spec.compare.href} size="md" rightSection={<IconArrowRight />}>
              {spec.compare.label}
            </Link>
          ) : null}
          {spec.note ? <p className={classes.comparisonNote}>{spec.note}</p> : null}
        </div>
      </div>
    </Section>
  )
}

/**
 * The closing call to action on the page itself — the footer's band, with the page's own words: a
 * heading with its gradient phrase, a line, the email field and its button, the arrow links, and the
 * quieter way out underneath. A page with this turns the footer's band off.
 */
/** The panel's outline buttons — `Book a custom demo`. */
function renderCtaButtons(buttons: LinkRef[]) {
  return buttons.map((button) => (
    <MantineButton key={button.label} component="a" href={button.href} variant="outline" size="sm">
      {button.label}
    </MantineButton>
  ))
}

/** The way to stay in touch — after a lead such as `Not ready yet?`, or the quiet link on its own. */
function renderCtaAside(spec: Extract<SectionSpec, { type: 'closingCta' }>) {
  if (!spec.aside) return null
  return spec.asideLead ? (
    /* `Not ready yet?` in primary, then the way to stay in touch as a small link. */
    <Group gap={8} justify="center" wrap="wrap">
      <Text fz={16} fw={600} lh={1.25} c="var(--sds-surfaces-text-primary)">
        {spec.asideLead}
      </Text>
      <Link href={spec.aside.href} size="sm" rightSection={<IconArrowRight />}>
        {spec.aside.label}
      </Link>
    </Group>
  ) : (
    <Link href={spec.aside.href} size="sm" variant="secondary">
      {spec.aside.label}
    </Link>
  )
}

function ClosingCtaSection({ spec }: { spec: Extract<SectionSpec, { type: 'closingCta' }> }) {
  const content = (
    /*
     * 1000 wide, as `Page Action Section` draws its title block (node `25037:46647`); the heading and
     * line still keep `SectionTitle`'s own 900 measure, and the field its 600.
     */
    <Stack gap={24} align="center" maw={1000} mx="auto">
      <SectionTitle
        align="center"
        order={2}
        title={highlightPhrase(spec.title, spec.titleHighlight, true)}
        description={spec.description}
      />
      {/* The consent line sits 8px under the field, so the two are one group inside the 24px stack. */}
      <Stack gap={8} w="100%" maw={600}>
        <Box component="form" onSubmit={(event) => event.preventDefault()}>
          <TextInput
            type="email"
            aria-label="Work email"
            placeholder={spec.placeholder}
            containedButton={
              <Button type="submit" size="sm" rightSection={<IconArrowRight />}>
                {spec.submit}
              </Button>
            }
          />
        </Box>
        {spec.consent ? (
          /* `Paragraph/XX-Small` — 11/16 in primary text, the policy link underlined. */
          <Text fz={11} lh="16px" c="var(--sds-surfaces-text-primary)" className={classes.closingConsent}>
            {spec.consent.text}
            {spec.consent.link ? (
              <>
                {' '}
                <a href={spec.consent.link.href}>{spec.consent.link.label}</a>.
              </>
            ) : null}
          </Text>
        ) : null}
      </Stack>
      {spec.links?.length ? (
        <Group gap={24} justify="center" wrap="wrap">
          {spec.links.map((link) => (
            <Link key={link.label} href={link.href} size="md" rightSection={<IconArrowRight />}>
              {link.label}
            </Link>
          ))}
        </Group>
      ) : null}
      {spec.surface === 'card' && spec.buttons?.length && spec.aside ? (
        /*
         * The panel's foot (node `25113:53301`): the button at the field's start and `Not ready yet?` at
         * its end, one row the field's width. They stack once the row runs out of room.
         */
        <Group gap={16} wrap="wrap" w="100%" maw={600} className={classes.ctaCardFoot}>
          {renderCtaButtons(spec.buttons)}
          {renderCtaAside(spec)}
        </Group>
      ) : (
        <>
          {spec.buttons?.length ? (
            <Group gap={16} justify="center" wrap="wrap">
              {renderCtaButtons(spec.buttons)}
            </Group>
          ) : null}
          {renderCtaAside(spec)}
        </>
      )}
    </Stack>
  )

  if (spec.surface !== 'card') return <Section>{content}</Section>

  return (
    <Section>
      {/*
       * `Ready for the future?` (node `25092:74309`): the band in a rounded panel. With `mesh`, the
       * footer's drifting colour field fills it at full strength, unmasked — the panel *is* the colour,
       * where the footer only lets it rise up the foot of the page. It holds still under reduced motion.
       */}
      <div className={classes.ctaCard} data-backdrop={spec.backdrop}>
        {spec.backdrop === 'mesh' ? <Footer.Mesh className={classes.ctaCardMesh} aria-hidden /> : null}
        {content}
      </div>
    </Section>
  )
}

function StatsBarSection({ spec }: { spec: Extract<SectionSpec, { type: 'statsBar' }> }) {
  return (
    <Section
      spacing={spec.title ? undefined : 'tight'}
      title={
        spec.title ? <SectionTitle align="center" title={spec.title} description={spec.description} /> : undefined
      }
    >
      <StatBar align="center" className={spec.size === 'lg' ? classes.statsBarLarge : undefined}>
        {spec.stats.map((st, i) => renderStat(st, 'center', i, spec.size === 'lg' ? { unitSize: 32 } : {}))}
      </StatBar>
    </Section>
  )
}

function IntegrationsSection({ spec }: { spec: Extract<SectionSpec, { type: 'integrations' }> }) {
  return (
    <Section
      bleed
      gap={32}
      className={spec.backdrop ? classes.meshHost : undefined}
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
      /*
       * The call to action sits in the section's footer — Figma's `Call to Action` cell, centred by the
       * Section — rather than beside the heading. Below the strip it reads as the thing to do after
       * looking at the logos.
       */
      footer={
        spec.action ? (
          <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
            {spec.action.label}
          </Button>
        ) : undefined
      }
    >
      {spec.backdrop ? <MeshBackdrop tone={spec.backdrop} /> : null}
      <Marquee label="Integrations" gap={16} logoWidth={64} size="lg" speed={38} fade fadeWidth={120}>
        {spec.logos.map((name, i) => {
          const logo = VENDOR_LOGOS.find((v) => v.name === name)
          return (
            <Card
              // eslint-disable-next-line react/no-array-index-key
              key={`${name}-${i}`}
              surface="glass"
              padding="none"
              w={64}
              h={64}
            >
              {/*
               * The mark sits *in* the tile, at half its width.
               *
               * It was drawn at the full 64 for a while, on the grounds that each file is a 200x200
               * artboard with its own rounded rect. Most of them are not — they are transparent marks —
               * and the three that do carry a plate (HubSpot, Stripe, PayPal) carry it in brand colour
               * rather than as chrome, so inside the tile they read as a plated logo and not as a tile
               * inside a tile. Framing them all the same way is what makes the row a row.
               *
               * The `alt` is the only thing announcing which vendor this is: there is no text in the row.
               */}
              <Group justify="center" align="center" h="100%">
                {logo ? (
                  <img
                    src={logo.src}
                    alt={name}
                    width={32}
                    height={32}
                    loading="lazy"
                    draggable={false}
                    style={{ display: 'block' }}
                  />
                ) : (
                  /* A name with no file. The initial tile still stands in for it. */
                  <VendorTile name={name} />
                )}
              </Group>
            </Card>
          )
        })}
      </Marquee>
    </Section>
  )
}

function renderSection(spec: SectionSpec, index: number) {
  switch (spec.type) {
    case 'cardGrid':
      return <CardGridSection key={index} spec={spec} />
    case 'resourceGrid':
      return <ResourceGridSection key={index} spec={spec} />
    case 'storyCatalog':
      return <StoryCatalogSection key={index} spec={spec} />
    case 'customerStories':
      return <CustomerStoriesSection key={index} spec={spec} />
    case 'logoMarquee':
      return <LogoMarqueeSection key={index} spec={spec} />
    case 'quotes':
      return <QuotesSection key={index} spec={spec} />
    case 'stepsForm':
      return <StepsFormSection key={index} spec={spec} />
    case 'partnershipModels':
      return <PartnershipModelsSection key={index} spec={spec} />
    case 'tierTable':
      return <TierTableSection key={index} spec={spec} />
    case 'buildGallery':
      return <BuildGallerySection key={index} spec={spec} />
    case 'comparison':
      return <ComparisonSection key={index} spec={spec} />
    case 'costCalculator':
      return <CostCalculatorSection key={index} spec={spec} />
    case 'closingCta':
      return <ClosingCtaSection key={index} spec={spec} />
    case 'article':
      return <ArticleSection key={index} spec={spec} />
    case 'tabbedContent':
      return <TabbedContentSection key={index} spec={spec} />
    case 'fullCard':
      return <FullCardSection key={index} spec={spec} />
    case 'mediaBand':
      return <MediaBandSection key={index} spec={spec} />
    case 'capabilityMap':
      return <CapabilityMapSection key={index} spec={spec} />
    case 'integrations':
      return <IntegrationsSection key={index} spec={spec} />
    case 'customerStory':
      return <CustomerStorySection key={index} spec={spec} />
    case 'contentBlock':
      return <ContentBlockSection key={index} spec={spec} />
    case 'faq':
      return <FaqSection key={index} spec={spec} />
    case 'quickLinks':
      return <QuickLinksSection key={index} spec={spec} />
    case 'highlightText':
      return <HighlightTextSection key={index} spec={spec} />
    case 'statsBar':
      return <StatsBarSection key={index} spec={spec} />
    case 'blogGrid':
      return <BlogGridSection key={index} spec={spec} />
    case 'blogFeature':
      return <BlogFeatureSection key={index} spec={spec} />
    default: {
      /* A new section type in the data with no renderer is a mistake worth failing the build over. */
      const never: never = spec
      return never
    }
  }
}

/**
 * The bubble a page draws, when something outside the page is choosing it.
 *
 * A page normally does not choose — `renderHero` pairs a file with the shape the data asked for, and
 * which file that is is not a page's business. The one caller that *is* allowed to say is a tool for
 * looking at bubbles, where the whole point is putting a file that is not in `assets/` on a real page.
 * So this is an override rather than a field on `PageSpec`: it does not round-trip, it does not belong
 * to the mockup, and nothing serialised can set it.
 */
export interface BubbleOverride {
  video?: HeroMediaSource
  videoLight?: HeroMediaSource
  /**
   * Draw the bubble in CSS instead of playing a file — the prototype the lab exists to judge.
   *
   * A data attribute rather than a prop, because that is the honest status of it: the stylesheet
   * knows how to draw a bubble, nothing in the component's API says so yet, and if the drawing wins
   * that is the moment to give it a name.
   */
  css?: boolean
}

/**
 * One built-page hero, on its own — what the page builder places as a node.
 *
 * `PageRenderer` draws a whole `PageSpec` at once; the builder holds a page as separate nodes it can
 * reorder and edit, so it needs the hero and each section as components in their own right. Same
 * render functions underneath, so a section looks identical in Storybook and on the canvas.
 */
export function HeroBlock({ hero }: { hero: HeroSpec }) {
  return <>{renderHero(hero)}</>
}

/** One built-page section, with its anchor wrapper when it has one. See `HeroBlock`. */
export function SectionBlock({ section }: { section: SectionSpec }) {
  return section.anchor ? (
    <div id={section.anchor} className={classes.sectionAnchor}>
      {renderSection(section, 0)}
    </div>
  ) : (
    <>{renderSection(section, 0)}</>
  )
}

export function PageRenderer({ page, bubble }: { page: PageSpec; bubble?: BubbleOverride }) {
  return (
    <>
      {renderHero(page.hero, bubble)}
      {page.sections.map((section, index) =>
        /*
         * An anchored section is wrapped rather than given the id itself, so every section type takes one
         * without each renderer having to: what a sub-nav links to is the page's business.
         */
        section.anchor ? (
          <div key={index} id={section.anchor} className={classes.sectionAnchor}>
            {renderSection(section, index)}
          </div>
        ) : (
          renderSection(section, index)
        ),
      )}
    </>
  )
}

/** Convenience for a story: the chrome around a rendered page. */
export function renderPage(page: PageSpec) {
  return <PageRenderer page={page} />
}

export { Stack }
