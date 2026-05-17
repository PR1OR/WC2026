# World Cup 2026 Sweepstake — Setup Guide

## What's in this package

- index.html — Draw app (admin-protected, animated team draw)
- fixtures.html — Fixtures tracker with sweepstake leaderboard and weekly mailer
- netlify/functions/mailer.js — AI mailer serverless function
- manifest.json + icons — Microsoft Teams app config

---

## Step 1 — Deploy to Netlify

1. Sign up free at netlify.com
2. In your dashboard, look for the drag-and-drop deploy area ("Deploy manually")
3. Drag the entire folder onto it
4. Netlify gives you a permanent URL like https://random-name-123.netlify.app
5. Copy the URL

---

## Step 2 — Update the manifest

1. Open manifest.json in Notepad
2. Press Ctrl+H (Find and Replace)
3. Find: YOUR-NETLIFY-URL
4. Replace: your actual Netlify subdomain (e.g. random-name-123)
5. Click Replace All (should swap 8 instances)
6. Save

---

## Step 3 — Create the Teams app zip

1. Select manifest.json + color.png + outline.png (3 files only)
2. Right-click one of them
3. Send to > Compressed (zipped) folder
4. Name it sweepstake.zip

---

## Step 4 — Upload to Teams

1. Open Microsoft Teams
2. Click Apps in the left sidebar
3. Manage your apps at the bottom
4. Upload an app > Upload a custom app
5. Choose sweepstake.zip

---

## Step 5 — Set up the Weekly Mailer (optional but recommended)

The mailer uses the Anthropic API to write funny weekly updates with real results.

**Get an API key:**
1. Go to console.anthropic.com
2. Sign up / log in
3. Go to API Keys > Create new key
4. Copy the key (starts with sk-ant-)

**Add it to Netlify:**
1. Go to your Netlify dashboard
2. Click your site > Site configuration > Environment variables
3. Click Add a variable
4. Key: ANTHROPIC_API_KEY
5. Value: your key starting with sk-ant-
6. Save

The mailer button will now work in the fixtures tracker when logged in as organiser.

---

## Passwords

Draw app organiser login: wc2026draw
Fixtures app organiser login: wc2026admin

To change either, open the relevant HTML file in Notepad and search for the password text.

---

## How it all works

THE DRAW APP (index.html)
- Non-admins see a "Draw Pending" screen
- Organiser logs in with the password, adds participant names, hits Start the Draw
- Run it while screen sharing in Teams so everyone watches live
- Results auto-save so the fixtures tracker picks them up automatically
- Results screen has two tabs: Assignments (who got what) and Fixtures (all group matches with participant names)

THE FIXTURES TRACKER (fixtures.html)
- Groups tab: all 12 groups with standings. Participant names appear in gold next to their teams. Organiser can click "Fixtures" on any group and enter scores.
- Sweepstake tab: live leaderboard showing who is winning based on their teams' combined group stage points
- Weekly Mailer tab (organiser only): generates a funny AI-written Teams message each week with real results and sweepstake banter. Edit it in the box before copying.

---

## Notes

- Scores saved to the organiser's browser (localStorage). Enter them from the Teams tab.
- Draw results shared between the two apps automatically (same domain, same browser).
- Tournament runs 11 June to 19 July 2026.
