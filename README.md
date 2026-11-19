# Joshua Hatfield’s Academic Portfolio

This repository contains Joshua Hatfield’s academic portfolio. It brings together his research in human–computer interaction, immersive systems, and human-centered AI, alongside his publications, teaching, projects, and CV.

[View the live portfolio](https://joshuathomashatfield.github.io/joshhat/)

## Make it your own

Building an academic portfolio? Feel free to clone the repo and make it your own. The layout gives you room to highlight the work you care about, whether that’s a first research project, a growing publication list, or a gallery of work in progress. Swap in your own content, CV, and images, and keep the sections that fit your work.

| File | What it contains |
| --- | --- |
| [`data/site.json`](data/site.json) | News, campus and experience photos, and gallery entries |
| [`index.html`](index.html) and [`styles.css`](styles.css) | Page structure and visual style |
| [`assets/`](assets/) | Portrait, campus photos, and research figures |
| [`cv/Josh-Hatfield-CV.tex`](cv/Josh-Hatfield-CV.tex) | Editable LaTeX source for the CV |

## CV and publishing

The site uses plain HTML, CSS, and JavaScript. The workspace includes a LaTeX Workshop configuration for a side-by-side PDF preview in VS Code with `pdflatex` and TeX Gyre Termes.

With GitHub Pages set to **GitHub Actions**, the [publishing workflow](.github/workflows/pages.yml) builds the CV and deploys it with the site on each push to `main`. The [PDF snapshot](docs/Josh-Hatfield-CV.pdf) is available directly from the repository.

Education, research interests, projects, publications, professional experience, teaching, and service come from the LaTeX source. The site also rotates through publications, projects, and awards from the CV. News and images are managed in `data/site.json`. A local HTTP preview reads the current LaTeX source on refresh. The publishing workflow generates the public data and PDF together.
