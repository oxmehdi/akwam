const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeList(type = 'movie', page = 1) {
  const url = `https://akwam.to/${type}s?page=${page}`;
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  return $('.movie-item').map((i, el) => {
    const href = $(el).find('a').attr('href');
    const id = href.split('/').pop();
    const title = $(el).find('.title').text().trim();
    const poster = $(el).find('img').attr('src');
    return { id: `akwam:${id}`, type, name: title, poster };
  }).get();
}

async function scrapeMetaDetails(id) {
  const slug = id.replace('akwam:', '');
  const res = await axios.get(`https://akwam.to/${slug}`);
  const $ = cheerio.load(res.data);
  return {
    name: $('h1').first().text().trim(),
    poster: $('img.poster').attr('src'),
    background: $('img.bg').attr('src'),
    description: $('div.description').text().trim(),
    genres: $('a.genre').map((i, el) => $(el).text()).get(),
    year: $('span.year').text()
  };
}

async function searchAkwam(query, type = 'movie') {
  const res = await axios.get(`https://akwam.to/search?q=${encodeURIComponent(query)}`);
  const $ = cheerio.load(res.data);
  return $('.movie-item').map((i, el) => {
    const href = $(el).find('a').attr('href');
    const id = href.split('/').pop();
    const name = $(el).find('.title').text().trim();
    const poster = $(el).find('img').attr('src');
    return { id: `akwam:${id}`, type, name, poster };
  }).get();
}

async function getStreams(id) {
  const slug = id.replace('akwam:', '');
  const res = await axios.get(`https://akwam.to/watch/${slug}`);
  const $ = cheerio.load(res.data);
  const streams = $('.btn-watch').map((i, el) => {
    const link = $(el).attr('href');
    let title = $(el).text().trim();
    return { title: title || 'Watch', url: link, externalUrl: true };
  }).get();

  if (streams.length === 0) {
    streams.push({
      title: 'Open on Akwam',
      url: `https://akwam.to/watch/${slug}`,
      externalUrl: true
    });
  }

  return streams;
}

module.exports = { scrapeList, scrapeMetaDetails, searchAkwam, getStreams };