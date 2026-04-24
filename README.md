# Areeba's Portfolio

A stunning, modern portfolio website for showcasing photos and videos.

## Features

- **Beautiful Dark UI** — Glassmorphism, gradient accents, animated particle background
- **Photo & Video Upload** — Drag-and-drop or click to browse; supports JPG, PNG, GIF, WEBP, MP4, WEBM, MOV
- **Masonry Gallery** — Responsive multi-column layout with hover effects
- **Lightbox Viewer** — Full-screen photo/video viewer with keyboard navigation
- **Filter Tabs** — Filter gallery by All / Photos / Videos
- **Collections** — Organize uploads into named collections
- **Persistent Storage** — Media stored locally in IndexedDB (no server needed)
- **Fully Responsive** — Looks great on desktop, tablet, and mobile
- **Smooth Animations** — Scroll-triggered fade-ins, animated counters, toast notifications

## Getting Started

Simply open `index.html` in a browser — no build step required.

```bash
# Option 1: Open directly
open index.html

# Option 2: Serve locally
npx serve .
```

## Tech Stack

- **HTML5** / **CSS3** / **Vanilla JavaScript**
- Google Fonts (Playfair Display + Inter)
- Material Icons
- IndexedDB for client-side storage
- Canvas API for particle animation

## Project Structure

```
├── index.html          # Main HTML page
├── css/
│   └── style.css       # All styles, animations, and responsive rules
├── js/
│   ├── particles.js    # Animated canvas background
│   ├── storage.js      # IndexedDB media storage
│   ├── gallery.js      # Gallery rendering and filtering
│   ├── upload.js       # File upload handling (drag & drop)
│   ├── lightbox.js     # Full-screen media viewer
│   └── app.js          # App bootstrap, navbar, scroll effects, toasts
└── README.md
```

## License

© 2026 Areeba Kashif. All rights reserved.
