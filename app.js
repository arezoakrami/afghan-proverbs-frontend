import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import methodoverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;
const API_URL = 'http://localhost:3001/proverbs';

//ES Modules in dirname
const _filename = fileURLToPath(import.meta,url);
const _Dirname = path.dirname(_filename);

app.set('view engine', 'ejs');
app.set('view', path.join(_dirname, 'views'));
app.use (express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodoverride('_method'));

//show all Proverbs
app.get('/', async (req, res) => {
    const response = await fetch(API_URL);
    const proverbs = await response.json();
    res.render('index', { proverbs });
});

//view a proverb
app.get('/proverbs/:id', async (req, res) => {
  const response = await fetch(`${API_URL}/${req.params.id}`);
  const proverb = await response.json();
  res.render('show', { proverb });
});

//adding new proverbs
app.get('/new', (req, res) => {
  res.render('new');
});

//post method
app.post('/proverbs', async (req, res) => {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.redirect('/');
});

//edite the proverbs
app.get('/proverbs/:id/edit', async (req, res) => {
  const response = await fetch(`${API_URL}/${req.params.id}`);
  const proverb = await response.json();
  res.render('edit', { proverb });
});

app.put('/proverbs/:id', async (req, res) => {
  await fetch(`${API_URL}/${req.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.redirect('/');
});

app.delete('/proverbs/:id', async (req, res) => {
  await fetch(`${API_URL}/${req.params.id}`, { method: 'DELETE' });
  res.redirect('/');
});

app.get('/category/:name', async (req, res) => {
  const response = await fetch(`${API_URL}?category=${req.params.name}`);
  const proverbs = await response.json();
  res.render('index', { proverbs });
});

app.get('/random', async (req, res) => {
  const response = await fetch(`${API_URL}/random`);
  const proverb = await response.json();
  res.render('show', { proverb });
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const response = await fetch(`${API_URL}?search=${query}`);
  const proverbs = await response.json();
  res.render('index', { proverbs });
});

app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});