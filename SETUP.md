# El Cuntino WC 2026 — Setup Guide

## What's in this package

- `index.html` — Draw app (admin-protected, animated team draw)
- `fixtures.html` — Fixtures tracker with sweepstake leaderboard, knockout bracket, and weekly mailer
- `netlify/functions/mailer.js` — AI mailer serverless function
- `netlify/functions/push.js` — Push notification serverless function
- `site.webmanifest` + `color.png` — PWA install config (add to home screen)
- `sw.js` — Service worker for push notifications

---

## Step 1 — Deploy to Netlify

Either:
- **Drag-and-drop** the folder onto netlify.com's "Deploy manually" area, or
- **Connect a GitHub repo** so pushes to `main` auto-deploy

Netlify gives you a permanent URL like `https://random-name-123.netlify.app`.

---

## Step 2 — Set up the Weekly Mailer (optional but recommended)

The mailer uses the Anthropic API to write funny weekly updates with real results.

**Get an API key:**
1. Go to console.anthropic.com
2. Sign up / log in
3. API Keys > Create new key
4. Copy the key (starts with `sk-ant-`)

**Add it to Netlify:**
1. Site configuration > Environment variables > Add a variable
2. Key: `ANTHROPIC_API_KEY`
3. Value: your key starting with `sk-ant-`
4. Save and trigger a redeploy

The mailer button will now work in the fixtures tracker when logged in as organiser.

---

## Step 3 — Set up Push Notifications (optional)

1. Generate VAPID keys locally: `npx web-push generate-vapid-keys`
2. Add to Netlify environment variables:
   - `VAPID_PUBLIC_KEY` = the public half
   - `VAPID_PRIVATE_KEY` = the private half
   - `VAPID_EMAIL` = `mailto:you@example.com` (optional, defaults to `mailto:admin@example.com`)
3. Paste the **public key** into `index.html` (search for `VAPID_PUBLIC_KEY=`)
4. Redeploy

If you skip this, the rest of the app still works — only push notifications are disabled.

---

## Step 4 — How users install it on their phone

**iPhone / iPad (Safari):**
1. Open the Netlify URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap Add — appears as a regular app icon

**Android (Chrome):**
1. Open the Netlify URL in Chrome
2. Tap the three-dot menu
3. Tap "Install app" (or "Add to Home Screen")
4. Tap Install — appears in the app drawer

Both launch fullscreen, no browser chrome.

---

## Passwords

- Draw app organiser login: `wc2026draw`
- Fixtures app organiser login: `wc2026admin`

To change either, open the relevant HTML file and search for the password text.

---

## How it all works

**THE DRAW APP (`index.html`)**
- Non-admins see a "Draw Pending" screen
- Organiser logs in with the password, adds participant names, hits Start the Draw
- Run it while screen sharing so everyone watches live
- Results auto-save so the fixtures tracker picks them up automatically
- Results screen has two tabs: Assignments (who got what) and Fixtures (all group matches with participant names)

**THE FIXTURES TRACKER (`fixtures.html`)**
- **Groups tab**: all 12 groups with standings. Participant names appear in gold next to their teams. Organiser can click "Fixtures" on any group and enter scores.
- **Sweepstake tab**: live leaderboard showing who is winning based on their teams' combined group stage points
- **Knockout tab**: bracket view that unlocks when the group stage is complete
- **Mailer tab** (organiser only): generates a funny AI-written weekly update with real results and sweepstake banter. Edit it in the box before copying.

---

## Notes

- Scores saved to the organiser's browser (localStorage). Enter them from the Groups tab.
- Draw results shared between the two apps automatically (same domain, same browser).
- Tournament runs 11 June to 19 July 2026.
