const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }));

  app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS') {
        return res.status(200).end();
    } else {
        next();
    }
  });
  
  app.use(bodyParser.json());
  


app.use('/api', require('./routes/index'));



module.exports = app;
