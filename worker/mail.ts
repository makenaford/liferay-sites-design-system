/**
 * The two emails the builder sends: "you were mentioned" and "a page was shared with you".
 *
 * Plain on purpose — a line saying what happened, the comment when there is one, and a link. Both a
 * text and an HTML part, since some clients show only the text and spam filters look for it. Every
 * value that came from a person is escaped before it goes into the HTML.
 */

export interface Mail {
  subject: string
  text: string
  html: string
}

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** A subject line cannot carry a newline, and a long title should not push the point off the end. */
const subjectSafe = (value: string) => {
  const flat = value.replace(/\s+/g, ' ').trim()
  return flat.length > 80 ? `${flat.slice(0, 79)}…` : flat
}

function layout(lead: string, quote: string | null, link: string, action: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1c1f24">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;padding:24px">
<p style="margin:0 0 16px;font-size:15px;line-height:1.5">${lead}</p>
${quote ? `<blockquote style="margin:0 0 20px;padding:12px 16px;border-left:3px solid #0b5fff;background:#f4f7ff;font-size:14px;line-height:1.5;white-space:pre-wrap">${quote}</blockquote>` : ''}
<a href="${escape(link)}" style="display:inline-block;background:#0b5fff;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;font-size:14px;font-weight:600">${action}</a>
</div></body></html>`
}

export function mentionEmail({ page, by, body, link }: { page: string; by: string; body: string; link: string }): Mail {
  return {
    subject: subjectSafe(`${by} mentioned you on ${page}`),
    text: `${by} mentioned you in a comment on "${page}":\n\n${body}\n\nOpen the thread: ${link}\n`,
    html: layout(
      `<b>${escape(by)}</b> mentioned you in a comment on <b>${escape(page)}</b>.`,
      escape(body),
      link,
      'Open the thread',
    ),
  }
}

export function sharedEmail({ page, by, link }: { page: string; by: string; link: string }): Mail {
  return {
    subject: subjectSafe(`${by} shared ${page} with you`),
    text: `${by} shared "${page}" with you in the page builder. You can now see its comments, reply, and be mentioned.\n\nOpen the page: ${link}\n`,
    html: layout(
      `<b>${escape(by)}</b> shared <b>${escape(page)}</b> with you in the page builder. You can now see its comments, reply, and be mentioned.`,
      null,
      link,
      'Open the page',
    ),
  }
}
