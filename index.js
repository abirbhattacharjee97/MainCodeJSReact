const express = require('express');
const mysql = require('mysql');

const app = express();

const cors = require('cors');

app.use(cors({ origin: true }));

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.json()); // Parse JSON request body

const connection = mysql.createConnection({
  host: 'db-asu-datapipeline.cbhji75irubx.us-east-2.rds.amazonaws.com',
  user: 'OptimizationUser',
  password: 'ProjectFFAR2022',
  database: 'USDA'
});

const connection2 = mysql.createConnection({
  host: 'db-asu-datapipeline.cbhji75irubx.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'GDIpNO5NFk8Q',
  database: 'USDA'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

connection2.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/bundles', async (req, res) => {
    await connection.query('SELECT * FROM abir_test_data_bundles', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error executing SQL query.' });
    } else {
      res.send(results);
    }
  });
});

app.get('/winner', async (req, res) => {
    await connection.query('SELECT bundle, user_id FROM (SELECT *, bid1 + bid2 AS total_bids, ROW_NUMBER() OVER(PARTITION BY bundle ORDER BY bid1 + bid2 DESC) AS wrank FROM abir_test_data_bids) AS base WHERE wrank = 1', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error executing SQL query.' });
    } else {
      res.send(results);
    }
  });
});

app.post('/bundles', (req, res) => {
  const user_id = req.body.user;
  const bundle = req.body.bundle;
  const bid1 = req.body.bid1;
  const bid2 = req.body.bid2;
  console.log(`user_id: ${user_id}, bundle: ${bundle}, bid1: ${bid1}, bid2: ${bid2}`);

  const sql = 'INSERT INTO abir_test_data_bids (user_id, bundle, bid1, bid2) VALUES (?, ?, ?, ?)';
  connection2.query(sql, [user_id, bundle, bid1, bid2], (err, result) => {
    if (err) throw err;
    console.log('Inserted bid into database');
    res.redirect('/');
  });
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});