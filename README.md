# JUNK

A one-page site for JUNK, an independent creative studio, fronted by its robot JUN977.

The hero is a pinned scroll journey over a fixed video of JUN977. Moving the mouse turns its head; scrolling glides it to centre stage and turns it to read each caption. Below that: studio work, process, labs, an interactive pitch console (press and hold to send), openings, shop and contact.

Built with React, TypeScript, Vite and Tailwind CSS.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Notes

- `public/media/jun977.mp4` is encoded with a keyframe every 4 frames so mouse and scroll scrubbing seek in a few milliseconds. It is loaded as a Blob so seeking also works on hosts without HTTP range support.
- Phones, portrait tablets and reduced-motion visitors get a static hero: the two stills swap instead of the video, and the video is never downloaded.
- Type: Martian Mono for headings, IBM Plex Mono for everything else (Google Fonts).
- Project names, jobs, prices and email addresses are placeholders.
