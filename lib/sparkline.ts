/**
 * Smooth sparkline paths. Monotone cubic interpolation (Fritsch–Carlson), the
 * same idea as d3's curveMonotoneX: the curve passes through every point and
 * never overshoots or wobbles between them.
 */

type Pt = { x: number; y: number };

function normalise(values: number[], width: number, height: number, pad: number): Pt[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - pad - ((v - min) / span) * (height - pad * 2),
  }));
}

function tangents(pts: Pt[]): number[] {
  const n = pts.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1].y - pts[i].y) / (pts[i + 1].x - pts[i].x));
  const t: number[] = new Array(n).fill(0);
  t[0] = d[0];
  t[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / d[i];
    const b = t[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      t[i] = tau * a * d[i];
      t[i + 1] = tau * b * d[i];
    }
  }
  return t;
}

const f = (n: number) => n.toFixed(2);

/** An open stroke path through the values. */
export function smoothLine(values: number[], width: number, height: number, pad = 3): string {
  const pts = normalise(values, width, height, pad);
  const t = tangents(pts);
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const dx = (p1.x - p0.x) / 3;
    d += ` C ${f(p0.x + dx)} ${f(p0.y + t[i] * dx)}, ${f(p1.x - dx)} ${f(p1.y - t[i + 1] * dx)}, ${f(p1.x)} ${f(p1.y)}`;
  }
  return d;
}

/** The same curve closed down to the baseline, for a soft fill under the line. */
export function smoothArea(values: number[], width: number, height: number, pad = 3): string {
  return `${smoothLine(values, width, height, pad)} L ${f(width)} ${f(height)} L 0 ${f(height)} Z`;
}
