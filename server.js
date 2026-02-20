const express = require('express');
const addonInterface = require('./addon');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/manifest.json', (req, res) => res.send(addonInterface.manifest));
app.get('/:res/:type/:id/:extra?.json', (req, res) =>
  addonInterface.get(req.params).then(resp => res.send(resp)).catch(e => res.status(500).send(e.stack))
);
app.listen(PORT, () => console.log(`Akwam addon running on port ${PORT}`));