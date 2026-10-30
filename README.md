# Huna Heights Apartments — residence gallery

A standalone, responsive property-gallery interface inspired by the supplied UI reference. Plain HTML, CSS and JavaScript; no framework, install step, server, or database.

## Features
- Seven room photographs; click thumbnails or use left/right arrow keys.
- Expand/collapse the gallery; Escape exits the expanded view.
- Show/hide the translucent property-details panel.
- Switch between three illustrative residences.
- Save a shortlist in this browser's local storage.
- Create a downloadable viewing brief. This does not book or send an appointment; personal details are not stored or transmitted.

All residences, prices, features and availability are illustrative and unverified. This is a separate front-end demo, not the original management platform.

## Preview
Open `dist/index.html` in a modern browser. Alternatively serve the `dist` folder with any static HTTP server.

## Vercel
Import this repository with **Framework Preset: Other**, leave the build command empty, and use **Output Directory: dist**. The included `vercel.json` declares the static output. Do not select Next.js. No `.next/routes-manifest.json` is needed.

## GitHub Pages
Publish the contents of `dist` as the Pages site root using a Pages workflow or a branch dedicated to deployment. All asset URLs are relative, so project subpaths work.

## Edit
- `dist/index.html`: structure and dialog content.
- `dist/styles.css`: visual design and responsive layouts.
- `dist/app.js`: sample properties and gallery interactions.
- `dist/assets/`: illustrative photography.

Google Fonts supplies DM Sans and Instrument Serif with local font fallbacks. Images are sourced from Unsplash and do not represent verified Huna for Huna properties. Image source IDs: photo-1556912172-45b7abe8b7e1, photo-1600607687939-ce8a6c25118c, photo-1600607687920-4e2a09cf159d, photo-1611892440504-42a792e24d32, photo-1600566753086-00f18fb6b3ea, photo-1620626011761-996317b8d101. Respect the respective third-party asset terms.

## Upload to GitHub

1. Extract this ZIP.
2. Create a new empty repository, or a separate branch for this demo.
3. Upload the contents of `huna-gallery-demo` so `vercel.json`, `README.md`, and the `dist` folder are at the repository root. Upload the files, not the ZIP.
4. Import that repository into Vercel. Choose **Other**, clear any previous Next.js build/install overrides, leave the build command empty, and set the output directory to `dist`.

This demo replaces neither your previous full-stack source nor its backend. Do not combine the old Next/Vinext `package.json` and build configuration with these static files. There is no npm install or build step.

The hosted Site identity, Git history, credentials, and local tool files are excluded from this export. JavaScript syntax and asset references were checked; browser visual QA was unavailable.
