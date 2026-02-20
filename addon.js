const addonBuilder = require('stremio-addon-sdk');
const manifest = require('./manifest.json');
const { scrapeList, scrapeMetaDetails, searchAkwam, getStreams } = require('./akwam-scraper');

const builder = addonBuilder(manifest); // returns full interface directly ✅

// Catalog handler
builder.defineCatalogHandler(async ({ id, type, extra }) => {
  if (extra?.search) return { metas: await searchAkwam(extra.search, type) };
  if (id === 'akwam_movies') return { metas: await scrapeList('movie', 1) };
  if (id === 'akwam_series') return { metas: await scrapeList('series', 1) };
  if (id === 'new') return { metas: await scrapeList(type, 1) };
  return { metas: [] };
});

// Meta handler
builder.defineMetaHandler(async ({ type, id }) => {
  const m = await scrapeMetaDetails(id);
  return { meta: { id, type, ...m } };
});

// Stream handler
builder.defineStreamHandler(async ({ type, id }) => {
  const streams = await getStreams(id);
  return { streams };
});

// ✅ No `.getInterface()` — directly export the builder
module.exports = builder;
