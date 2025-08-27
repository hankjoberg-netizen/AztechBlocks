const express = require('express');
const path = require('path');
const products = require('./products.json');

const app = express();

// EJS + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// helpers for EJS
app.locals.asMoney = (n) => Number(n).toFixed(2);

// health
app.get('/ping', (req, res) => res.send('ok'));

// home (4x2 on homepage; search when q provided)
app.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  let list = products;
  if (q) {
    list = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  } else {
    list = products.slice(0, 8); // 4 top + 4 bottom
  }
  res.render('index', { products: list, q });
});

// product
app.get('/product/:id', (req, res) => {
  const p = products.find((x) => String(x.id) === String(req.params.id));
  if (!p) return res.status(404).send('Product not found');
  res.render('product', { p });
});

module.exports = app; // ← Vercel uses this

// optional local dev: `node server.js`
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
