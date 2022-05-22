const express = require('express');
const cors = require('cors');
const request = require('postman-request');
require('dotenv').config();

const app = express();
app.use(cors({ credentials: true }));

const port = process.env.PORT || 3001;
const IP_KEY = process.env.IP_KEY;
const MAP_KEY = process.env.MAP_KEY;


app.get('/server/', (req, res) => {
  res.send('Hello!')
});

app.get('/server/ip', (req, res) => {
  const ip = req.query.ipAddress;

  request(`https://geo.ipify.org/api/v2/country,city?apiKey=${IP_KEY}&ipAddress=${ip}`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send({ body: body, mapKey: MAP_KEY })
    } else {
      console.log(error);
      res.send({ error: error })
    }
  });
});

app.get('/server/domain', (req, res) => {
  const domain = req.query.domain;
  
  request(`https://geo.ipify.org/api/v2/country,city?apiKey=${IP_KEY}&domain=${domain}`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send({ body: body, mapKey: MAP_KEY })
    } else {
      res.send({ error: error })
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});