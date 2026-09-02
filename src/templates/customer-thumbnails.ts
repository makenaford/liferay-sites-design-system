/**
 * The customer thumbnails — the tiles the `Customer Stories` carousel carries in the file.
 *
 * Brand artwork rather than the generated stand-in: each is the customer's own mark on their own
 * ground, exported from `Solutions Library- 2026` and committed at 820x547, the size and format the
 * `trending/` images already use.
 *
 * **The rounded corners are cropped off, not flattened.** The exports carry a radius on transparency,
 * and a JPEG has no alpha to keep it with — composited, those corners come out as black nubs sitting
 * inside the card's own `radius="sm"`. Each is scaled to 870x580 and centre-cropped to 820x547 instead,
 * which trims about 3% off every edge and takes the radius with it. The card supplies the corner.
 *
 * A story with no entry here falls back to `logoTile`, the drawn stand-in, so the list can grow ahead
 * of the artwork.
 */
import airbus from '../../assets/home/customers/airbus.jpg'
import broadcom from '../../assets/home/customers/broadcom.jpg'
import cityOfVienna from '../../assets/home/customers/city-of-vienna.jpg'
import joseCuervo from '../../assets/home/customers/jose-cuervo.jpg'
import macdon from '../../assets/home/customers/macdon.jpg'
import mueller from '../../assets/home/customers/mueller.jpg'
import sky from '../../assets/home/customers/sky.jpg'
import unilever from '../../assets/home/customers/unilever.jpg'

/** Keyed by the `customer` field on a story, which is what both the page data and the story hold. */
export const CUSTOMER_THUMBNAILS: Record<string, string> = {
  'Sky TV': sky,
  'City of Vienna': cityOfVienna,
  Broadcom: broadcom,
  Unilever: unilever,
  Airbus: airbus,
  'Mueller, Inc.': mueller,
  'Jose Cuervo': joseCuervo,
  MacDon: macdon,
}

/** The alt a thumbnail wants: it is the customer's mark, and that is the whole of what it shows. */
export const customerThumbnailAlt = (customer: string) => `${customer} logo`
