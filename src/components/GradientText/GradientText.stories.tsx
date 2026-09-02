import type { Meta, StoryObj } from '@storybook/react-vite'
import { GradientText } from './GradientText'
import { SectionTitle } from '../Section'

const meta = {
  title: 'Components/GradientText',
  component: GradientText,
  parameters: { frame: { width: 900 } },
  args: { children: 'One Platform.' },
} satisfies Meta<typeof GradientText>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The fill as `Homepage Redesign` draws it on the hero: `Brand/Primary/Lighten 1` to
 * `Accent/Product Accent`, left to right across the phrase.
 */
export const Default: Story = {
  render: (args) => (
    <SectionTitle
      title={
        <>
          Different Teams. <GradientText {...args} />
        </>
      }
    />
  ),
}

/**
 * `animate` sweeps the gradient along the phrase, which is what the five gradient section headings on
 * the Home page do. The hero's does **not** — a heading that shimmers to itself while the reader is on
 * the page's first sentence is the animation with the weakest claim on their attention and the
 * strongest pull on it. Further down, where a heading has to catch an eye travelling past it, the same
 * movement is doing a job.
 */
export const Animated: Story = {
  ...Default,
  args: { animate: true },
}

/**
 * The phrase is not always the tail. The customer carousel's gradient is the **first two words** of its
 * heading, which is why this wraps a phrase wherever it falls rather than appending one.
 */
export const AtTheStart: Story = {
  render: () => (
    <SectionTitle
      align="center"
      title={
        <>
          <GradientText animate>1,200+ Enterprises</GradientText> Move the Needle With Liferay
        </>
      }
    />
  ),
}
