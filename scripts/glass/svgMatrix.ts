/**
 * SVG TRANSFORMS AS MATRICES — enough to move a gradient between spaces.
 *
 * A gradient in `userSpaceOnUse` is measured in the space of the shape that
 * uses it, its own `transform` included. To paint several differently
 * transformed shapes with one gradient laid out in a shared space, each
 * shape's copy of it carries that shape's transform, inverted, as its
 * `gradientTransform`. This reads a `transform` attribute, multiplies and
 * inverts — nothing more.
 *
 * A matrix is SVG's `[a, b, c, d, e, f]`: x' = a·x + c·y + e, y' = b·x + d·y + f.
 */
export type Matrix = [number, number, number, number, number, number];

export const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

/** `m` then `n`, as SVG composes a list left to right: m · n. */
export function multiply(m: Matrix, n: Matrix): Matrix {
  const [a, b, c, d, e, f] = m;
  const [A, B, C, D, E, F] = n;
  return [a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D, a * E + c * F + e, b * E + d * F + f];
}

/** The matrix undoing `m`, or null when it flattens everything (no inverse). */
export function invert(m: Matrix): Matrix | null {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-12) return null;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}

/** A `transform` attribute as one matrix, or null for anything it does not know. */
export function parseTransform(src: string | undefined): Matrix | null {
  if (!src || !src.trim()) return IDENTITY;
  let m: Matrix = IDENTITY;
  const re = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g;
  let seen = 0;
  for (const [whole, fn, args] of src.matchAll(re)) {
    seen += whole.length;
    const v = args.split(/[\s,]+/).filter(Boolean).map(Number);
    if (v.some((x) => !Number.isFinite(x))) return null;
    let t: Matrix;
    switch (fn) {
      case 'matrix':
        if (v.length !== 6) return null;
        t = v as Matrix;
        break;
      case 'translate':
        t = [1, 0, 0, 1, v[0] ?? 0, v[1] ?? 0];
        break;
      case 'scale':
        t = [v[0] ?? 1, 0, 0, v[1] ?? v[0] ?? 1, 0, 0];
        break;
      case 'rotate': {
        const r = ((v[0] ?? 0) * Math.PI) / 180;
        const rot: Matrix = [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
        const [cx, cy] = [v[1] ?? 0, v[2] ?? 0];
        t = cx || cy ? multiply(multiply([1, 0, 0, 1, cx, cy], rot), [1, 0, 0, 1, -cx, -cy]) : rot;
        break;
      }
      case 'skewX':
        t = [1, 0, Math.tan(((v[0] ?? 0) * Math.PI) / 180), 1, 0, 0];
        break;
      default:
        t = [1, Math.tan(((v[0] ?? 0) * Math.PI) / 180), 0, 1, 0, 0];
    }
    m = multiply(m, t);
  }
  // Anything left over that is not whitespace or commas is something this does not read.
  if (src.replace(re, '').replace(/[\s,]/g, '').length) return null;
  return seen ? m : IDENTITY;
}

const n = (x: number) => String(Math.round(x * 1e5) / 1e5);
export const matrixString = (m: Matrix) => `matrix(${m.map(n).join(' ')})`;
export const isIdentity = (m: Matrix) => m.every((x, i) => Math.abs(x - IDENTITY[i]) < 1e-9);
