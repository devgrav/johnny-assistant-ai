#!/usr/bin/env node
/**
 * grid-overlay.js — annotate a screenshot with numbered cell markers.
 *
 * Usage:
 *   node scripts/grid-overlay.js <screenshot.png> <out.png> '<json rects>'
 *
 *   rects = [{"x":236,"y":67,"w":99,"h":94}, ...]   // image pixels, row-major order → labels 1..N
 *
 * Needs the skill's own node_modules (sharp). Fonts must be installed for the labels;
 * without fonts draw the digits yourself (e.g. 7-segment rectangles in the SVG).
 */
const sharp = require('sharp');

const [src, out, rectsJson] = process.argv.slice(2);
if (!src || !out || !rectsJson) {
  console.error('usage: node scripts/grid-overlay.js <src.png> <out.png> "<json rects>"');
  process.exit(1);
}

const rects = JSON.parse(rectsJson);

(async () => {
  const meta = await sharp(src).metadata();
  const parts = rects.map((r, i) => {
    const cx = Math.round(r.x + 20);
    const cy = Math.round(r.y + 20);
    return `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="none" stroke="#e11d48" stroke-width="3"/>`
      + `<circle cx="${cx}" cy="${cy}" r="16" fill="#e11d48" opacity="0.92"/>`
      + `<text x="${cx}" y="${cy + 7}" font-family="DejaVu Sans,sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
  }).join('');

  const svg = `<svg width="${meta.width}" height="${meta.height}" xmlns="http://www.w3.org/2000/svg">${parts}</svg>`;

  await sharp(src)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(out);

  console.log('written ' + out);
})().catch((e) => {
  console.error('error: ' + e.message);
  process.exit(1);
});
