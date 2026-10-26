# Stock imagery

Photos under `explore/`, `regulatory/`, and `about/` were downloaded from [Unsplash](https://unsplash.com) for use in capability and regulatory pages.

To refresh assets:

```bash
node scripts/download-content-images.mjs
```

Replace files in `public/images/` with your own licensed photography anytime; paths are defined in `src/data/capabilityTopics.ts` and `src/data/regulatoryBodies.ts`.
