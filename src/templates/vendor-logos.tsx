import amazonS3 from '../../assets/integrations/amazon-s3.svg'
import azure from '../../assets/integrations/azure.svg'
import docusign from '../../assets/integrations/docusign.svg'
import elastic from '../../assets/integrations/elastic.svg'
import fedex from '../../assets/integrations/fedex.svg'
import googleCloud from '../../assets/integrations/google-cloud.svg'
import googleDrive from '../../assets/integrations/google-drive.svg'
import hubspot from '../../assets/integrations/hubspot.svg'
import microsoftOffice from '../../assets/integrations/microsoft-office.svg'
import paypal from '../../assets/integrations/paypal.svg'
import stripe from '../../assets/integrations/stripe.svg'
import ups from '../../assets/integrations/ups.svg'

/**
 * The integration logos.
 *
 * **These are real vendor marks, and that is a change.** This file used to hold eight invented
 * companies — geometry in `currentColor`, no real trademark anywhere near the repository — for the
 * reason README.md gives under *What is committed, and what is not*: a design system that commits
 * someone else's mark is distributing it, and this is a public repository.
 *
 * They were supplied for this section deliberately, so the stand-ins are gone. It is the same call the
 * `Trending Now` thumbnails represent, and it is undone the same way: delete `assets/integrations/`,
 * put the invented set back from git history, and the section renders again with `VendorTile`
 * standing in. Naming a vendor you integrate with is ordinary nominative use; that is not a claim
 * about redistribution, which is the question this file's history is really about.
 *
 * **Each logo is its own tile.** They arrive as 200×200 artboards with a rounded rect already in them —
 * white for most, the brand's own colour for Stripe — so they are drawn at the tile size rather than as
 * a mark inside one of `Card`'s glass tiles. Putting these inside a glass card gives a tile in a tile,
 * and the mark ends up small enough to be unreadable.
 *
 * That is also why there is no `monochrome` treatment here. The customer marquee inks its logos to one
 * colour, which is what a logo *wall* wants; an integration row is claiming these are the real products
 * a customer already runs, and a one-colour Stripe is not the thing being claimed.
 */
export interface VendorLogo {
  /** The vendor's name. It is the image's accessible name, so it should read as the product does. */
  name: string
  /** The logo file, resolved to a URL by the bundler. */
  src: string
}

export const VENDOR_LOGOS: VendorLogo[] = [
  { name: 'Microsoft Office', src: microsoftOffice },
  { name: 'Google Cloud', src: googleCloud },
  { name: 'Azure', src: azure },
  { name: 'Amazon S3', src: amazonS3 },
  { name: 'HubSpot', src: hubspot },
  { name: 'Stripe', src: stripe },
  { name: 'PayPal', src: paypal },
  { name: 'DocuSign', src: docusign },
  { name: 'Elastic', src: elastic },
  { name: 'Google Drive', src: googleDrive },
  { name: 'FedEx', src: fedex },
  { name: 'UPS', src: ups },
]

/** The names alone, for the schema's `integrations` section, which carries logos as strings. */
export const VENDOR_NAMES = VENDOR_LOGOS.map((v) => v.name)
