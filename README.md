# joshhat — Academic Portfolio Website

A light, professional, GitHub Pages-ready academic portfolio for Josh Hatfield.

This repo is designed to work as a static GitHub Pages site with dynamic content loaded from `data/site.json`.

## Recommended repository name

If you want the repository to be named `joshhat`, create a public GitHub repository named:

```text
joshhat
```

Then enable GitHub Pages from:

```text
Settings → Pages → Deploy from branch → main → /root
```

Your site will usually publish at:

```text
https://sirjoshies.github.io/joshhat/
```

If you want the site to live at the root URL instead:

```text
https://sirjoshies.github.io
```

then the repo must be named:

```text
sirjoshies.github.io
```

A custom domain can also point to either version later.

## Editing your content

Most portfolio content lives in:

```text
data/site.json
```

Edit this file to update:

- quick buttons
- news
- research areas
- project cards
- publications

## Adding your professional photo

Upload a professional headshot here:

```text
assets/profile.jpg
```

Recommended format:

- square image
- JPG or PNG
- at least 600 × 600 pixels
- professional or academic-looking background

The page will automatically use this photo. If no photo exists, it falls back to a clean `JH` placeholder.

## Adding your CV

Place your CV PDF here:

```text
docs/Josh-Hatfield-CV.pdf
```

The CV buttons already point to that file.

## File structure

```text
joshhat/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── site.json
├── docs/
│   └── PUT_CV_HERE.txt
├── assets/
│   └── PUT_PROFILE_PHOTO_HERE.txt
├── README.md
└── .gitignore
```

## Design notes

The design uses:

- light academic color scheme
- soft blue, green, and gold accents
- dynamic hover buttons
- animated section reveals
- responsive mobile layout
- simple JSON-driven content

No backend, database, or paid hosting is required.
