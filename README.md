# VRhino website

The official static website for VRhino, built for GitHub Pages with semantic
HTML, plain CSS, and minimal vanilla JavaScript. There is no build step and no
runtime dependency.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Python is used only to run a convenient local static-file server; it is not a
website dependency.

## Content sources

Product and model facts are based on the tagged Public VRhino
`v0.5.0-alpha` source. Canonical website model metadata lives in
[`data/models.json`](data/models.json).

## Deployment

The site is published through GitHub Pages from the `main` branch repository
root. The committed `.nojekyll` file keeps the static files from requiring
Jekyll processing.
