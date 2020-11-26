require('dotenv').config()

const express = require('express');
let gatherSentence = require ('./texml').gatherSentence;
const texmlController = require('./texmlController');
const callController = require('./callController');
const messageController = require('./messageController');
const texmlPath = '/texml';
const callPath = '/calls';
const messagePath = '/messaging';
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.gatherSentence = gatherSentence;
  next();
})

app.use(texmlPath, texmlController);
app.use(callPath, callController);
app.use(messagePath, messageController);

app.post('/gatherSentence', (req, res) => {
  gatherSentence = req.body.gatherSentence;
  res.send({status: "ok"});
})

const port = process.env.TELNYX_APP_PORT || 3000
app.listen(port);
console.log(`Server listening on port: ${port}`);
