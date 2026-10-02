# PixelOS

A static desktop-style web app built with HTML, CSS, and JavaScript. Its app
windows and assets are served directly from the project folders; no build step
or package installation is required.

## Run locally

Serve the project root with any static file server, then open its local URL in a
browser. For example, run `python -m http.server` in the project root and visit
`http://localhost:8000`.

## Deploy to Vercel

1. Push this project to a GitHub repository, keeping `index.html`, `apps/`, and
   `assets/` together at the repository root.
2. Import the repository in Vercel and set the root directory to `.`.
3. Choose the **Other** framework preset. Leave the build and install commands
   empty, and leave the output directory unset so Vercel serves the project root.
4. Deploy. The app pages under `apps/` and the files under `assets/` are static
   files and should remain in those folders with their original names.

The Settings app uses a fixed wallpaper list rather than relying on directory
listing, which static hosts such as Vercel do not provide.
