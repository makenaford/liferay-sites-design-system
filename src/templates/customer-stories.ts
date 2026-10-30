import type { StorySpec } from './page-schema'

/*
 * The customer stories liferay.com's home page carries under `1,200+ Enterprises Move the Needle With
 * Liferay` — shared by every page that runs that section, so the eight are told the same way everywhere.
 * Each `customer` is also the key its logo tile is filed under in `customer-thumbnails.ts`.
 */
export const CUSTOMER_STORIES: StorySpec[] = [
  /*
   * The eight from the `§4 Customer Testimonials` sheet, kept in step with `Home.stories.tsx`.
   * Two copies of one list is a duplication worth closing, but not while the builder is landing.
   *
   * Sky's entry was wrong here once: Mueller's quote under an author who is not in the source.
   */
  {
    customer: 'Sky TV',
    value: '140',
    suffix: '%',
    label: 'Increase in customer self-service',
    quote:
      'With Liferay, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
    name: 'Jacques Hefer',
    role: 'Solution Architect',
  },
  {
    customer: 'City of Vienna',
    value: '100M',
    prefix: '+',
    label: 'Site views per month',
    quote:
      'Liferay’s out-of-the-box features mean we can offer state-of-the-art communication trends and methods, quickly and conveniently.',
    name: 'Nikolaus Reisel',
    role: 'GBS Group Leader: Basic Systems and platforms',
  },
  {
    customer: 'Broadcom',
    value: '845',
    label: 'Features implemented',
    quote:
      'We don’t look at Liferay as the vendor. We see them as a partner. Everything we wanted to do in terms of providing customer self-service has been realized.',
    name: 'Erica Callaghan',
    role: 'Communications and UX Officer, Global Technology Organization',
  },
  {
    customer: 'Unilever',
    value: '133',
    suffix: '%',
    label: 'Faster go to market',
    quote:
      'Liferay was a bit of a no-brainer for us. The entire digital journey is now orchestrated in a unified way.',
    name: 'Srikant Chandrasekharan',
    role: 'Senior Delivery Lead for Enterprise Platforms & Products',
  },
  {
    customer: 'Airbus',
    value: '24,000',
    label: 'Users served by portal',
    quote:
      'Keycopter brings efficiency and autonomy to helicopter operators. By providing coherent online services with Liferay, it is easy for our customers to keep their aircraft in good condition.',
    name: 'Jérôme Chauvin',
    role: 'IM Project Manager',
  },
  {
    customer: 'Mueller, Inc.',
    value: '73',
    suffix: '%',
    label: 'Quote increase',
    quote:
      'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
    name: 'Hab Adkins',
    role: 'Corporate Technology Manager',
  },
  {
    customer: 'Jose Cuervo',
    value: '7',
    label: 'Teams unified via intranet',
    quote:
      'Our new corporate communication media needed to be effective and provide an optimal user experience, and now that was finally possible with Liferay.',
    name: 'Loria Saviñon',
    role: 'HR Manager',
  },
  {
    customer: 'MacDon',
    value: '50',
    suffix: '%',
    label: 'Increase in online transactions',
    quote:
      'It was just time for an upgrade, and now we get ecstatic reviews on the customer experience every week.',
    name: 'Derek Boonstra',
    role: 'Manager, Business Systems',
  },
]
