# Cloudflare hosting

NexusPoint targets Cloudflare Workers Static Assets. `wrangler.jsonc` publishes only `dist/`, with single-page-application routing so direct links to `/studies` and individual studies open correctly. The game needs no runtime secrets, database, or custom Worker code.

## GitHub automatic deployment

The GitHub repository is connected through Cloudflare Workers Builds with these settings:

| Setting | Value |
| --- | --- |
| Repository | `swacziarg/Forecaster` |
| Worker name | `nexuspoint` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy` |
| Preview deploy command | `npm run deploy:preview` |
| Node.js | `24`, from `.node-version` |

The build command runs the evidence and game tests before building the site. Wrangler is pinned in the lockfile. Pushes to `main` trigger a production build and deploy; non-production branch pushes trigger preview uploads without replacing production. Both triggers watch all repository paths and use the test-inclusive build command. Cloudflare manages the build credential through its Git integration; no Cloudflare API token belongs in this repository.

### Connection status, September 5, 2026 (Chicago)

The GitHub authorization was completed and the following Workers Builds triggers are connected to `swacziarg/Forecaster`:

- Production: `5d2c0528-2a9b-445e-acdc-16edaddf3b30`, includes only `main`.
- Preview: `f79a551f-b4ff-455a-912c-085965e78fe0`, includes all branches except `main`.
- Worker tag: `8eaa5ef9223d4e229d15525ffffd9c7e`.

To verify a deployment, match the GitHub commit hash to its successful Cloudflare build, check the build logs for passing evidence/game tests and a successful production deployment, and check the public HTTPS homepage and sharing assets. A configured trigger alone is not proof of a successful deployment. A local Wrangler OAuth login remains available for explicit manual deployments.

## Sharing assets

The homepage HTML includes Open Graph and Twitter large-image metadata with absolute production URLs. The generic, spoiler-free 1200×630 preview is `public/og-image-v1.png`; its editable source is `assets/brand/social-preview.svg`. SVG and ICO favicons plus a 180×180 Apple touch icon reuse the existing three-bar brand symbol. They are static build inputs and need no runtime service or new dependency.

The same generic preview applies to exact daily links. Query parameters still open the intended puzzle; metadata does not expose answers. For a future artwork change, export a new versioned PNG and update both image URLs in `index.html` to avoid reusing a cached social image. Social platforms may retain previews already fetched before this deployment.

## Local verification

Run `npm run build:cloudflare`, then `npx wrangler deploy --dry-run`. Keep using `npm run dev` for the existing local Vite preview.

## Launch schedule

Hosting does not change the puzzle schedule. Only edition #001 is scheduled for September 5, 2026. Its exact `/?daily=2026-09-05-biden-dropout` link stays playable as an archive after the daily window closes; the root reports an exhausted schedule until another puzzle is published.

## Previous hosting attempt

The user selected direct Cloudflare hosting with GitHub automatic deployment on September 5, 2026. The old local Sites manifest was removed from the active configuration. This does not delete or alter the previous remote Sites project.

## References

- [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Single-page application routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
