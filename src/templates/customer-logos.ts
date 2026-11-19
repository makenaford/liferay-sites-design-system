import att from '../../assets/solutions/logos/att.png'
import teamGlobalExpress from '../../assets/solutions/logos/team-global-express.png'
import trimedx from '../../assets/solutions/logos/trimedx.png'
import broadcom from '../../assets/solutions/logos/broadcom.png'
import lenovo from '../../assets/solutions/logos/lenovo.png'
import hpe from '../../assets/solutions/logos/hewlett-packard-enterprise.png'
import type { SectionSpec } from './page-schema'

/*
 * The customer strip as liferay.com's home page runs it: its six white marks, in its order, trimmed to
 * what they draw so each fills the marquee's slot the same way. They are inked through the mask path,
 * so the white files take the strip's colour on either canvas.
 *
 * Real customer marks, committed — the same call the partner pages' strips make; see README.md under
 * *What is committed, and what is not*.
 */
export const CUSTOMER_LOGO_MARQUEE: Extract<SectionSpec, { type: 'logoMarquee' }> = {
  type: 'logoMarquee',
  label: 'Trusted by 1,200+ enterprises',
  logos: ['AT&T', 'Team Global Express', 'TriMedx', 'Broadcom', 'Lenovo', 'Hewlett Packard Enterprise'],
  images: [
    { src: att, alt: 'AT&T' },
    { src: teamGlobalExpress, alt: 'Team Global Express' },
    { src: trimedx, alt: 'TriMedx' },
    { src: broadcom, alt: 'Broadcom' },
    { src: lenovo, alt: 'Lenovo' },
    { src: hpe, alt: 'Hewlett Packard Enterprise' },
  ],
}
