import heroMedia from '../../assets/home/hero-media.png'
import blogHeroMedia from '../../assets/blog/hero-media.webp'
import featuredMedia from '../../assets/home/trending/b2b-ecommerce.jpg'
import customerStoryHero from '../../assets/customer-story/hero-media.jpg'
import customerStoryImplementation from '../../assets/customer-story/implementation.jpg'
import yusenLogo from '../../assets/customer-story/yusen-logistics-logo.png'
import industryHeroMedia from '../../assets/industry/hero-media.jpg'
import resourceA from '../../assets/home/trending/ai-transformation.jpg'
import resourceB from '../../assets/home/trending/digital-strategy.jpg'
import resourceC from '../../assets/home/trending/web-portals.jpg'
import type { PageSpec, SectionSpec } from './page-schema'
import { sectionTypeFor } from './section-catalog'

/**
 * What a new mockup starts as.
 *
 * A preset is a **starting point, not a template**. It is copied once, on creation, and the copy is
 * then the designer's — editing a preset later does not reach back into mockups already made from it.
 * That is the whole difference between this and a CMS, and it is the reason this file can stay a few
 * plain factories: nothing has to migrate, nothing has to stay in sync, and a preset that turns out to
 * be wrong costs one page's worth of re-editing rather than a data migration.
 *
 * ## Why they are short
 *
 * The file draws component sets, not pages — its only two pages are `Cover` and `❖ Components`. There
 * is no drawn Industry page to copy, so the section run below is inferred, and an inferred preset that
 * guesses long is worse than one that guesses short: **a designer adds a section in one click and
 * deletes one in one click, but they have to first work out that the extra section was never meant to
 * be there.** So each preset carries the sections that kind of page cannot be without, and stops.
 *
 * ## Where a default actually belongs
 *
 * Three layers, and only the third is in this file:
 *
 * 1. **Always true → `PageRenderer`.** The marquee's 64px logos, the carousel's bleed, the card grid's
 *    32px gap. Not defaults — properties of the type. Never in the data.
 * 2. **True of every new section of a type → `blank()` in `section-catalog.ts`.**
 * 3. **True of this kind of page → here.**
 *
 * A preset composes `blank()` sections rather than restating their content, so placeholder copy has
 * exactly one home. When a preset needs a section to differ from its blank, it overrides the field —
 * and that override is the honest signal that the difference is the *page kind's*, not the type's.
 */

export interface PagePreset {
  id: string
  /** What the picker calls it. */
  label: string
  /** One line on which handoff this is for. */
  hint: string
  /** A fresh `PageSpec`. Called once per new mockup — never shared, never referenced afterwards. */
  create: () => PageSpec
}

/** A blank of the given type, so presets never restate placeholder copy. */
function blank<T extends SectionSpec['type']>(type: T) {
  const entry = sectionTypeFor(type)
  if (!entry) throw new Error(`No section type '${type}' in the catalog`)
  return entry.blank() as Extract<SectionSpec, { type: T }>
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non lacinia mi. Etiam nec mauris fringilla, tincidunt tellus sed, feugiat nulla.'

/** A paragraph at the length the `Blog` frame draws its body copy. */
const ARTICLE_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est metus, commodo vel condimentum ut, iaculis at felis. Donec sed sollicitudin mauris. Donec tempor, odio et fringilla vehicula, turpis dolor cursus lacus, sit amet pulvinar urna mi in ante. Sed quis eros ut ante dapibus pulvinar. Quisque ac velit neque. Suspendisse vel turpis eget augue ultricies suscipit at vel felis. Phasellus interdum dapibus felis, ut accumsan metus. Aliquam fermentum lacus at sodales tristique.'

export const PAGE_PRESETS: PagePreset[] = [
  {
    id: 'landing',
    label: 'Landing page',
    hint: 'Email capture and proof up top, then the platform story. The Home page’s spine.',
    create: () => ({
      /*
       * What makes this a landing page is the hero: a form and the Gartner proof, not buttons. Someone
       * arriving here is being asked for an address, so the field is the primary action and the link
       * under it is the way out for people not ready to give one.
       *
       * The Home page's solution finder banner is deliberately absent. It is one page's device — the
       * `HeroBanner` union has exactly one kind in it for that reason — and a designer who wants it
       * should be choosing it, not deleting it.
       */
      hero: {
        background: 'corner',
        title: { text: 'A headline that names the outcome,', highlight: 'not the product' },
        description: {
          text: 'One or two lines on who this is for and what changes for them.',
          emphasis: 'The clause worth emphasising goes last.',
        },
        form: { placeholder: 'Work email', submit: 'Get started' },
        action: { label: 'Talk to sales instead', href: '#' },
        proof: {
          rating: { score: '4.5', outOf: 5, source: 'Gartner Peer Insights' },
          marks: ['SOC 2', 'ISO 27001', 'GDPR'],
        },
        media: { src: heroMedia, alt: 'Replace with this page’s product shot', ratio: '4:3' },
      },
      /*
       * Logos immediately under the hero, because that is the one section whose position is load-bearing
       * — it renders flush against the band above it, and anywhere else in the run it reads as an
       * orphan rather than as proof attached to the claim.
       */
      sections: [
        blank('logoMarquee'),
        blank('cardGrid'),
        blank('tabbedContent'),
        blank('customerStories'),
      ],
    }),
  },
  {
    id: 'industry',
    label: 'Industry page',
    hint: 'Two buttons, a 3:2 photo, and the industry’s own solutions and proof.',
    create: () => ({
      /*
       * Figma node `24223:209534`. Two buttons rather than a form, and no proof row: someone on an
       * industry page has already self-identified, so the job is to route them — demo or sales — not to
       * qualify them.
       *
       * The photo is 3:2 where the landing hero's is 4:3. That is the drawn difference between the two
       * cells, and it is why `ImageRef` carries a ratio at all.
       */
      hero: {
        background: 'corner',
        title: { text: 'Hero Title' },
        description: { text: LOREM },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
        media: {
          src: industryHeroMedia,
          alt: 'Replace with a photograph from this industry',
          ratio: '3:2',
        },
      },
      /*
       * `fullCard` before the grids, and it is the reason this preset exists rather than being the
       * landing one with a different hero: an industry page's first job after the hero is the one card
       * that says what the offer is *for this industry*, with its numbers on it.
       */
      sections: [
        blank('logoMarquee'),
        (() => {
          const section = blank('fullCard')
          /* The tab rule is the industry list, so the page kind names it — not the type's blank. */
          return { ...section, title: 'Built for your industry' }
        })(),
        blank('resourceGrid'),
        blank('customerStories'),
      ],
    }),
  },
  {
    id: 'product',
    label: 'Product detail',
    hint: 'What it does, who it worked for, the questions, and the ways out.',
    create: () => ({
      /*
       * `Detail Pages` -> `Product Info` (node `24631:68532`), section by section as the file draws it.
       *
       * The first pass at this preset was assembled from section *heights* without looking at the page,
       * and three of the eight were wrong: the tabbed panel is a key-point list rather than an
       * accordion, the grid is six icon cards rather than four image ones, and the band after it is a
       * customer story — a photograph, a paragraph, three figures and a link — where a `mediaBand` had
       * been guessed. A height identifies a cell; only the drawing says what is in it.
       */
      hero: {
        background: 'corner',
        title: { text: 'Hero Title' },
        description: { text: LOREM },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
        media: { src: heroMedia, alt: 'Replace with this product’s own shot', ratio: '3:2' },
      },
      sections: [
        /* The pill bar over a panel of key points — five audiences, one claim each. */
        (() => {
          const section = blank('tabbedContent')
          return {
            ...section,
            tabs: [
              'Customer Portals',
              'Supplier Portals',
              'Financial Services',
              'Digital Commerce',
              'Intranets',
            ].map((label) => ({
              label,
              value: label.toLowerCase().replace(/\s+/g, '-'),
              content: {
                label: 'Label',
                title: 'Card Title',
                description: LOREM,
                points: Array.from({ length: 3 }, () => ({
                  title: 'Key Point Main List',
                  description: 'Short description here',
                })),
                media: { src: industryHeroMedia, alt: 'Replace with this tab’s own photograph' },
              },
            })),
          }
        })(),
        /* `Feature Highlights (Clickable)` — six icon cards, two rows of three. */
        (() => {
          const section = blank('cardGrid')
          return {
            ...section,
            title: 'Feature Highlights (Clickable)',
            columns: 3 as const,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            cards: Array.from({ length: 6 }, () => ({
              title: 'Card Title',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              icon: 'sites' as const,
              href: '#',
            })),
          }
        })(),
        (() => {
          const section = blank('customerStory')
          /* The picture closes the row here: the panel above it ends on a photograph of its own. */
          return { ...section, mediaSide: 'right' as const }
        })(),
        blank('highlightText'),
        blank('faq'),
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            title: 'Additional Resources',
            cards: [
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceA, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceB, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceC, alt: 'Replace with this resource’s own image' } },
            ],
          }
        })(),
        blank('quickLinks'),
      ],
    }),
  },
  {
    id: 'solution',
    label: 'Solution detail',
    hint: 'The proof first, then what is in it, then the block that explains it.',
    create: () => ({
      /*
       * `Detail Pages` -> `Solution` (node `24631:68574`).
       *
       * It opens on a customer story rather than on features, which is the difference between this and
       * the product page: someone reading a solution page is still deciding whether this is their
       * problem, and the fastest answer is somebody else who had it.
       */
      hero: {
        background: 'corner',
        title: { text: 'Hero Title' },
        description: { text: LOREM },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
        media: { src: heroMedia, alt: 'Replace with this solution’s own shot', ratio: '3:2' },
      },
      sections: [
        blank('customerStory'),
        /* Three icon cards, not clickable — `Card Grid- Non Clickable` in the file. */
        (() => {
          const section = blank('cardGrid')
          return {
            ...section,
            title: 'Card Title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            columns: 3 as const,
            cards: Array.from({ length: 3 }, () => ({
              title: 'Card Title',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              icon: 'sites' as const,
            })),
          }
        })(),
        blank('contentBlock'),
        (() => {
          const section = blank('customerStories')
          return { ...section, title: 'More Customer Stories' }
        })(),
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            title: 'Additional Resources',
            description:
              'Whether you drive campaigns, build infrastructure, or grow partnerships — Liferay empowers your success.',
            action: { label: 'Button', href: '#' },
            cards: [
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceA, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceB, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceC, alt: 'Replace with this resource’s own image' } },
            ],
          }
        })(),
      ],
    }),
  },
  {
    id: 'form',
    label: 'Form Page',
    hint: 'A form card in the hero, over the numbers, the logos, and what the platform does.',
    create: () => ({
      /*
       * `Forms` -> `Contact Sales` (node `24263:76429`). The file draws four variants of this page; they
       * differ in what sits under the form, not in the shape above it, so this is the common spine.
       *
       * **The proof is stacked directly under the hero, and that is the page.** A contact page has one
       * job and everything below the fold is there to make the form worth filling in: the figures, then
       * the logos, then what the platform does, then the questions that stop someone writing in. There
       * is nothing to read *after* the form, so the page ends at the FAQ rather than handing on.
       */
      hero: {
        background: 'corner',
        title: { text: 'Talk to sales' },
        description: { text: LOREM },
        /*
         * The whole form, in the column the media would otherwise fill — which is what the file draws.
         * It was an inline email field and a button, the shape a marketing hero uses to start a trial;
         * this page's hero *is* the form, and the fields it asks for are the point of the page.
         */
        formCard: {
          title: 'Form Heading',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          rows: [
            [
              { label: 'First Name', required: true },
              { label: 'Last Name', required: true },
            ],
            [
              { label: 'Work Email', type: 'email', required: true },
              { label: 'Company', required: true },
            ],
            [
              {
                label: 'Country',
                type: 'select',
                required: true,
                options: ['United States', 'United Kingdom', 'Germany', 'Brazil', 'Japan'],
              },
              { label: 'Phone', type: 'tel', required: true },
            ],
            [{ label: 'What would you like to talk about', type: 'textarea', required: true }],
          ],
          consent:
            'I agree that Liferay may share my contact details with Partners operating in my country to offer extended expertise and support, if their involvement is considered to bring value.',
          terms:
            'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.',
          submit: 'Submit',
        },
      },
      /*
       * The file's spine under the hero: the numbers, the logos, then what the platform does. No FAQ —
       * node `24263:171708` ends on a second content section and the footer, and the FAQ that used to
       * be here was carried over from the detail pages rather than drawn on this one.
       */
      sections: [blank('statsBar'), blank('logoMarquee'), blank('tabbedContent'), blank('mediaBand')],
    }),
  },
  {
    id: 'catalog',
    label: 'Customer story catalog',
    hint: 'A short hero, the stories worth leading with, then the whole grid of them.',
    create: () => ({
      /*
       * `Customer Story Catalog` -> `Customer Stories` (node `24581:69991`).
       *
       * A catalog hero is **short** — 433 in the file against the 624 every detail page uses — because
       * the page's content is the list, and a hero that fills the screen puts the first row of it below
       * the fold. So: no media, no buttons, one line of description.
       *
       * The file's grid carries pagination, which this does not have yet: `resourceGrid` renders every
       * card it is given. That is the one thing on this page the schema cannot express — noted in
       * README.md rather than faked with a row of dead controls.
       */
      hero: {
        background: 'none',
        title: { text: 'Customer Stories' },
        description: { text: 'How teams like yours build with Liferay.' },
      },
      /*
       * The stories worth leading with, then the whole list behind its filters. `storyCatalog` replaces
       * the plain `resourceGrid` that stood here: the file's catalog has a filter bar and a result
       * count, and a grid that renders everything it is given cannot express either.
       */
      sections: [blank('customerStories'), blank('storyCatalog'), blank('mediaBand')],
    }),
  },
  {
    id: 'blog',
    label: 'Blog',
    hint: 'A byline hero, an outlined article, the author, and what to read next.',
    create: () => ({
      /*
       * `Solutions Library` -> `Blog` (node `24223:173039`).
       *
       * The hero names who wrote it and when rather than asking for anything: a post earns its call to
       * action by the end, so the one ask sits in the article, after the last section.
       */
      hero: {
        background: 'full',
        breadcrumbs: [
          { label: 'Home', href: '#' },
          { label: 'Blogs', href: '#' },
          { label: 'CMS MCP Server', href: '#' },
        ],
        title: { text: 'CMS MCP Server: How AI Agents Migrate Content in Liferay' },
        description: {
          text: "A CMS MCP server lets AI agents migrate legacy content and Asset Libraries into Liferay's new CMS. A field report on how it works today. By Marc Hermann, Managing Director of Portalworks",
        },
        byline: { name: 'Author Name', date: '10/20/1994', readTime: '2 min read' },
        tags: ['SEO & Analytics', 'Developer', 'Digital Experience'],
        media: {
          src: blogHeroMedia,
          alt: 'Two colleagues at a desk at night, one pointing at a tablet the other is holding',
          ratio: '3:2',
        },
      },
      sections: [
        (() => {
          /* The blank's one-line paragraphs, at the length the file draws them, so the outline has a page to follow. */
          const section = blank('article')
          return {
            ...section,
            featured: {
              tag: 'Featured Asset',
              title: '4 Best Practices to Design an Effective Ecommerce Website',
              href: '#',
              image: { src: featuredMedia, alt: 'Replace with the featured asset’s own cover' },
            },
            sections: section.sections.map((part) => ({
              ...part,
              body: part.body?.map(() => ARTICLE_LOREM),
              subsections: part.subsections?.map((sub) => ({ ...sub, body: [ARTICLE_LOREM] })),
            })),
          }
        })(),
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            /*
             * The Home page's `Trending Now` resource section, cut to the three a post has room for —
             * real-looking titles and a type tag on each, and no button: the cards are the way on.
             */
            title: 'Related Content',
            description: 'More insights and resources from Liferay.',
            card: 'resource',
            cards: [
              {
                title: 'What is AI Transformation?',
                tag: 'Guide',
                href: '#',
                image: { src: resourceA, alt: 'Hands at a laptop keyboard under a blue overlay of circuitry and data' },
              },
              {
                title: 'What is Digital Strategy?',
                tag: 'Article',
                href: '#',
                image: { src: resourceB, alt: 'Two colleagues at a whiteboard covered in sticky notes' },
              },
              {
                title: '16 Awesome Web Portal Examples',
                tag: 'Blog',
                href: '#',
                image: {
                  src: resourceC,
                  alt: 'A 3D render of a lit platform ringed by Create, Find, Share, Trust and Improve tiles',
                },
              },
            ],
          }
        })(),
      ],
    }),
  },
  {
    id: 'customer-story',
    label: 'Customer Story',
    hint: 'One customer’s story: their logo, the outlined write-up, the figures beside it, then what to read next.',
    create: () => ({
      /*
       * `Solutions Library` -> `Customer Story` (node `24179:45329`).
       *
       * The blog's article, told about a customer: their logo over the heading instead of a byline, and
       * the `Key Metrics` panel down the right instead of a featured asset — the figures are the proof, so
       * they stay in view while the reader works through how they were reached.
       *
       * The file's copy is carried over as drawn — a Yusen Logistics hero over SkyTV's write-up — and is
       * the first thing to replace.
       */
      hero: {
        background: 'full',
        breadcrumbs: [
          { label: 'Home', href: '#' },
          { label: 'Customer Stories', href: '#' },
          { label: 'Yusen Logistics', href: '#' },
        ],
        logo: { src: yusenLogo, alt: 'Yusen Logistics' },
        title: { text: 'Yusen Logistics Transforms Global Freight Booking with Liferay' },
        description: {
          text: 'Enabling faster, more efficient freight booking through a centralized digital collaboration',
        },
        readTime: '2 Minute Read',
        media: {
          src: customerStoryHero,
          alt: 'A container ship stacked with containers, guided by tugboats across open water',
          ratio: '3:2',
        },
      },
      sections: [
        {
          type: 'article',
          outlineLabel: 'Table of contents',
          metrics: {
            title: 'Key Metrics',
            stats: Array.from({ length: 3 }, () => ({
              value: '845',
              label: 'Months to Launch',
              sentiment: 'positive' as const,
            })),
          },
          sections: [
            {
              title: 'Key Takeaways',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Redesigning your website with a more modern look and feel nets tangible benefits. With the new zero-touch end-to-end integration, easily searchable and continuously updated content display, and exclusive add-ons for subscribers, SkyTV has seen cart acquisition jump to over 7%.',
                    'Offering more self-service options takes the pressure off customer service. Since SkyTV enabled customers to manage and make purchases from their own accounts, 140% more customer transactions are digitally self-serviced, and calls to the customer call center have decreased.',
                    'Scaling is crucial for fast-paced, evolving markets. Previously, SkyTV deployed changes every three weeks, making scaling for special events difficult. Now, changes are deployed daily through Liferay DXP Cloud, and monitoring and high-availability environments ensure minimal downtime during peak hours.',
                  ],
                },
              ],
            },
            {
              title: 'Background',
              body: [
                'SkyTV is a Top 30 New Zealand-based digital broadcaster and telecom provider connecting over 1 million customers and counting with the entertainment they love on any device they want. They are serving both employees and retirees with the goal of guaranteeing affordable and responsible credit to enable customers to meet their daily expenses sustainably and improve their quality of life.',
              ],
            },
            {
              title: 'Challenges',
              blocks: [
                {
                  type: 'paragraph',
                  text: 'Hoping to continue their success as a dominant player in the streaming world, SkyTV decided to refresh their website.\n\nSkyTV wanted to resolve these challenges:',
                },
                {
                  type: 'list',
                  items: [
                    'Their website was dated and kept users from making purchasing decisions. Competitors had websites with a simplified UI and modern functionalities that made it easy for users to find what they need, but SkyTV’s website didn’t live up to increasing user expectations across the entire customer lifecycle.',
                    'Call centers were burdened trying to manually support customers. The original website didn’t include many self-service options, which meant call center operators had to field every customer question and sale.',
                    'A monolithic on-premise platform made scaling difficult. The existing CMS required slow, manual deployments and custom code, so maintenance was difficult and time-consuming, with deployments happening every three weeks. Special events, like PPV, saw an uptick in traffic that required easy scaling.',
                  ],
                },
                {
                  type: 'quote',
                  text: 'With Liferay Experience Cloud SM, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
                  emphasis: ['scale automatically', 'a lot quicker'],
                  name: 'Jacques Hefer',
                  role: 'Solution Architect For SkyTV',
                },
              ],
            },
            {
              title: 'Implementation',
              blocks: [
                {
                  type: 'paragraph',
                  text: 'SkyTV had already been leveraging some content management of the capabilities from Liferay on their website, the decision to migrate to Liferay Experience Cloud Managed (SM) for simplified deployment and the possibility of business made sense.\n\nIntergen assisted SkyTV through the rollout process, which took only ten months and happened in two phases. Critical to the success of the implementation was the Getting Started with DXP Cloud Journey.',
                },
                {
                  type: 'image',
                  image: {
                    src: customerStoryImplementation,
                    alt: 'The redesigned SkyTV site: a featured show banner over a grid of programmes',
                  },
                },
              ],
            },
            {
              title: 'Results',
              blocks: [
                {
                  type: 'paragraph',
                  text: 'Post Liferay Experience Cloud SM implementation, SkyTV’s and the development with operations teams have become better aligned by following a DevOps. This ensures that the IT team is more efficient and agile, able to meet business demands quickly.\n\nSkyTV has also reaped the following benefits:',
                },
                {
                  type: 'list',
                  items: [
                    'Cart acquisition has increased to 7%. The website redesign includes an enhanced user experience and zero-touch end-to-end integration, with a content display that’s always updated and easy to browse as well as new and existing customer add-ons.',
                    'Customer self-service has increased 140%. A new section of the website for logged in users called My Account offers self-service options for account management and purchases, reducing the number of call center calls.',
                    'Customer self-service has increased 140%. A new section of the website for logged in users called My Account offers self-service options for account management and purchases, reducing the number of call center calls.',
                  ],
                },
                {
                  type: 'paragraph',
                  text: 'With Liferay, SkyTV can continue offering their customers the ability to watch the entertainment they love and manage exactly what they want from their SkyTV subscription.',
                },
              ],
            },
          ],
          cta: {
            label: 'Label',
            title: 'Liferay Recognized in the 2025 Gartner Critical Capabilities for DXPs Report',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '#',
          },
        },
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            title: 'Related Content',
            description:
              'Whether you drive campaigns, build infrastructure, or grow partnerships — Liferay empowers your success.',
            card: 'resource' as const,
            cards: [
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceA, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceB, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceC, alt: 'Replace with this resource’s own image' } },
            ],
          }
        })(),
      ],
    }),
  },
]

export const presetFor = (id: string) => PAGE_PRESETS.find((preset) => preset.id === id)
