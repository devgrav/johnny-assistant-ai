---
name: captcha-relay
description: "Human-in-the-loop CAPTCHA solving with two modes: screenshot (default, zero infrastructure) and token relay (requires network access). Screenshot mode captures the page with a grid overlay, sends it to the human, and injects clicks based on their reply. Token relay mode detects CAPTCHA type + sitekey, serves the real widget on a relay page for native solving, and injects the token via CDP."
defaultMode: screenshot
---

# CAPTCHA Relay v2

Solve CAPTCHAs by relaying them to a human. Two modes available.

## Modes

### Screenshot Mode (default) — No infrastructure needed

Grid overlay screenshot → send image to human via Telegram → human replies with cell numbers → inject clicks.

- **Zero setup** beyond the skill itself. No Tailscale, no tunnels, no relay server.
- Works for **any** CAPTCHA type (reCAPTCHA, hCaptcha, sliders, text, etc.)
- Uses `sharp` for image processing + CDP for screenshots and click injection.

```bash
node index.js                       # screenshot mode (default)
node index.js --mode screenshot     # explicit
node index.js --screenshot          # legacy alias
```

```js
const { solveCaptchaScreenshot } = require('./index');
const capture = await solveCaptchaScreenshot({ cdpPort: 18800 });
// capture.imagePath — annotated screenshot to send to human
// capture.prompt — text prompt for the human
```

### Token Relay Mode — Requires network access

Detects CAPTCHA type + sitekey → serves real widget on relay page → human solves natively → token injected via CDP.

- Requires **Tailscale** or a **tunnel** (localtunnel/cloudflared) so the human's device can reach the relay server.
- Produces a proper CAPTCHA token — more reliable for reCAPTCHA v2, hCaptcha, Turnstile.
- Best when you have Tailscale already set up.

```bash
node index.js --mode relay              # with localtunnel
node index.js --mode relay --no-tunnel  # with Tailscale/LAN
```

```js
const { solveCaptcha } = require('./index');
const result = await solveCaptcha({ cdpPort: 18800, useTunnel: false });
// result.relayUrl — URL to send to human
// result.token — solved CAPTCHA token
```

## When to Use Each

| Scenario | Mode |
|----------|------|
| Quick & easy, no setup | `screenshot` |
| Any CAPTCHA type (sliders, text, etc.) | `screenshot` |
| Known CAPTCHA with sitekey (reCAPTCHA, hCaptcha, Turnstile) | `relay` |
| Tailscale already configured | `relay` |
| No network access to host | `screenshot` |

## CLI Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--mode screenshot\|relay` | `screenshot` | Select solving mode |
| `--screenshot` | — | Alias for `--mode screenshot` |
| `--no-inject` | inject | Return token without injecting into browser |
| `--no-tunnel` | tunnel | Skip tunnel, use local/Tailscale IP (relay mode) |
| `--timeout N` | 120 | Timeout in seconds |
| `--cdp-port N` | 18800 | Chrome DevTools Protocol port |

## Agent Workflow

### Screenshot mode (simplest)

1. Call `solveCaptchaScreenshot({ cdpPort })` 
2. Send `capture.imagePath` to human via `message` tool with `capture.prompt`
3. Human replies with cell numbers (e.g. "1,3,5,7")
4. Call `injectGridClicks(cdpPort, capture, selectedCells)` to click those cells

### Relay mode

1. Call `solveCaptcha({ useTunnel: false })` (Tailscale) or `solveCaptcha()` (tunnel)
2. Send `result.relayUrl` to human via `message` tool
3. Wait — resolves when human completes the CAPTCHA
4. Token is auto-injected; continue automation

## Requirements

- Chrome/Chromium with `--remote-debugging-port=18800`
- Node.js 18+ and `npm install` (deps: ws, sharp)
- **Relay mode only:** Tailscale or internet for tunnel

## Verified workflow on this host (2026-09-19, DuckDuckGo)

`node index.js --mode screenshot` fails here with `'Runtime.evaluate' wasn't found` — the bundled
CDP client cannot reach the challenge frame. Do not retry it; use this agent-side route instead. It
was proven end to end on DuckDuckGo's "select all squares containing a duck" challenge.

1. Open the page in the OpenClaw browser tool and confirm the challenge is rendered.
2. Read tile geometry from the page DOM: `[...document.querySelectorAll('img')]` →
   `getBoundingClientRect()` → keep rects with `width > 20`. Scroll (or resize) until every row plus
   the submit control is inside the viewport, then re-measure — rects are viewport-relative.
3. Screenshot with the browser tool, then annotate with the bundled script:
   `node scripts/grid-overlay.js <screenshot.png> <out.png> '<json rects>'`
4. Send the annotated image with the numbering map (row-major, 1..N) and ask for the cell numbers.
5. Click each named tile with the browser tool's `clickCoords` at the rect centre, then confirm the
   selection visually before submitting — selection state is not reliably exposed in the DOM.
6. Click submit and keep clicking through any confirmation steps. DuckDuckGo shows
   "Thanks for confirming you're human!" and then a separate **Load Search Results** button before
   real results appear.

Rules learned the hard way:

- A solved challenge is bound to that browser session. It does not revive a keyless `web_search`
  provider: that provider issues its own requests with no browser session and keeps getting the
  challenge.
- Some blocks are not puzzles at all. An IP-reputation checkbox (Yandex Travel) re-issues no matter
  who clicks, so read the page text before offering a human relay — if there is no question, there is
  nothing to relay.
- Never answer the challenge automatically. The human answers; the agent only clicks.
- Local edits here are overwritten by `openclaw skills update` — re-apply after an update.
