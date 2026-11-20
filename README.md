# K.JIBSON Study Travel Website

A single-page marketing site for **K.JIBSON®** study travel agency — Germany, Poland, Austria, Ukraine, and Serbia — branded with `#0146e2`.

## View locally

Open `index.html` in your browser, or run a simple server:

```bash
cd "/Users/apple/Documents/Kjibson Website"
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Design system

"Case file" concept: cobalt `#0146e2` on warm paper, Archivo (extra-wide display cuts) with IBM Plex Mono labels. Everything lives in `styles.css` + `script.js`.

| Section | Idea |
|---------|------|
| Hero | Boarding pass with split-flap origin city flying to BEG |
| Services | Folder tabs (keyboard accessible) with a checklist sheet per service |
| Process | Steps get rubber-stamped as you scroll; final "Admitted" seal |
| Stories | 9:16 reels from `assets/videos/story-1..4.mp4`, branded fallback if a file is missing |
| Contact | Numbered official-style inquiry form |

Respects `prefers-reduced-motion`.

## Customize

- Hero photo: `assets/hero.jpg` (2000px web copy of `hero-banner.jpg`).
- Update `hello@kjibson.com` in the contact section with your real email.
- Connect the contact form to a backend (Formspree, Netlify Forms, etc.) when ready.

## Deploy

Upload the folder to any static host (Netlify, Vercel, GitHub Pages, or your web host).
