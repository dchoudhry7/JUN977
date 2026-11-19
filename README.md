# JUNK

A one-page site for JUNK, an e-waste pickup service in Rotterdam and Lisbon, fronted by its robot JUN977.

The hero is a single screen over a fixed video of JUN977: moving the mouse (or dragging a finger) left and right turns its head. Below that: what we take, how a pickup works, a booking console where JUN977 reads your list (press and hold to book), FAQ, refurbished devices and contact.

Built with React, TypeScript, Vite and Tailwind CSS.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Notes

- `public/media/jun977.mp4` is encoded with a keyframe every 4 frames so mouse scrubbing seeks in a few milliseconds. It is loaded as a Blob so seeking also works on hosts without HTTP range support.
- On touch screens, dragging a finger across the page turns the head (taps no longer throw sparks). Visitors with reduced motion or data saver on get a still image instead, and the video is never downloaded.
- Type: Martian Mono for headings, IBM Plex Mono for everything else (Google Fonts).
- Prices, stats, service areas and email addresses are placeholders.
