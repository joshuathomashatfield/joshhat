# joshhat — Academic Portfolio Website

A light-blue, GitHub Pages-ready academic portfolio for Joshua Hatfield.

## Main files to edit

- `data/site.json` — news, research areas, projects, publications, teaching, service, affiliations, and gallery entries.
- `assets/profile.jpg` — professional headshot used on the homepage.
- `docs/Josh-Hatfield-CV.pdf` — downloadable CV.
- `assets/gallery/` — thesis/project images used in the gallery.

## Updating the site online through GitHub

1. Open the repository on GitHub.
2. Click the file you want to edit, usually `data/site.json`.
3. Click the pencil icon.
4. Make your change.
5. Scroll down and click **Commit changes**.
6. Wait 1–3 minutes for GitHub Pages to redeploy.

## Updating the CV

Upload your newest CV to:

```text
docs/Josh-Hatfield-CV.pdf
```

Keep the filename the same so the website link never changes.

## Updating the headshot

Upload a square or near-square professional image to:

```text
assets/profile.jpg
```

The current image is already cropped for the homepage.

## Adding Marshall or Mines campus images

To add campus images, upload files named:

```text
assets/marshall-campus.jpg
assets/mines-campus.jpg
```

The site will automatically show those images in the Bio section. If they are missing, it displays clean text fallback cards instead.

## Adding gallery images

Add images to `assets/gallery/`, then edit the `gallery` list in `data/site.json`:

```json
{
  "title": "Figure title",
  "caption": "Brief description.",
  "image": "assets/gallery/example.jpg"
}
```

## GitHub Pages

For this static site, use:

```text
Settings → Pages → Deploy from a branch → main → /root
```
