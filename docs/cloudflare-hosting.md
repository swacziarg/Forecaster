# Cloudflare hosting

NexusPoint targets Cloudflare Workers Static Assets. `wrangler.jsonc` publishes only `dist/`, with single-page-application routing so direct links to `/studies` and individual studies open correctly. The game needs no runtime secrets, database, or custom Worker code.

## GitHub automatic deployment

Connect the existing GitHub repository through Cloudflare Workers Builds with these settings:

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

The build command runs the evidence and game tests before building the site. Wrangler is pinned in the lockfile. Once the repository connection is enabled, pushes to `main` build and publish production; enabled non-production branch builds upload preview versions without replacing production. Cloudflare manages the build credential through its Git integration; no Cloudflare API token belongs in this repository.

### Connection status, September 5, 2026 (Chicago)

The production Worker and HTTPS custom domain are live. Automatic deployment is **not connected yet**. The Workers Builds API returned no triggers for the `nexuspoint` Worker and no build tokens. Creating the repository connection returned Cloudflare error `8000008`: the project is disconnected from the Git account. The MCP connection cannot manage account API tokens, and the GitHub repository has no Actions secrets configured. A local Wrangler OAuth login is available for direct deployment, but it is not a CI credential.

To finish, open the NexusPoint Worker in Cloudflare, go to Settings → Build → Connect, and authorize the Cloudflare GitHub app for **only `swacziarg/Forecaster`**. Select `main` and use the settings above. Complete the build-token setup in Cloudflare, then confirm a successful build for the current GitHub commit. Finally verify a later push starts a build automatically and that the deployed homepage matches that commit. Until those checks pass, do not describe automatic deployment as enabled.

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
