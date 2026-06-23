# K.JIBSON Study Travel Website

A single-page marketing site for **K.JIBSON®** study travel agency — Germany, Poland, Austria, Ukraine, and Serbia — branded with `#0146e2`.

## View locally

Open `index.html` in your browser, or run a simple server:

```bash
cd "/Users/apple/Documents/Kjibson Website"
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Motion system

The site uses a scene-based layout (`motion.css` + `script.js`):

| Feature | Implementation |
|---------|----------------|
| Photo + motion blends | Layered scenes with Ken Burns, mist gradients, brand overlays, motion strip |
| Foreground / background depth | `depth-stack`, `card-depth`, masked `cutout-subject` images |
| Pan, zoom, tilt, parallax | CSS keyframes + scroll `data-parallax` + mouse `data-tilt` |
| Section masks & fades | `scene-bridge`, curved dividers, `.reveal` scroll animations |
| Realistic timing | Custom cubic-bezier tokens (`--ease-out-expo`, `--ease-drift`, etc.) |

Respects `prefers-reduced-motion`.

## Customize

- Replace Unsplash placeholder images with your own photos from [Instagram](https://www.instagram.com/k.jibson_/). Use PNG cutouts for best foreground depth.
- Update `hello@kjibson.com` in the contact section with your real email.
- Connect the contact form to a backend (Formspree, Netlify Forms, etc.) when ready.

## Deploy

Upload the folder to any static host (Netlify, Vercel, GitHub Pages, or your web host).
