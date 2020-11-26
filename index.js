require('dotenv').config()

const express = require('express');
const cors = require('cors');


const texmlPath = '/texml';
const callPath = '/calls';
const messagePath = '/messaging';
const configurationPath = '/configuration';


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const texmlController = require('./controllers/texmlController');
const callController = require('./controllers/callController');
const messageController = require('./controllers/messageController');
const configurationController = require('./controllers/configurationController');

io.on('connection', (socket) => {
  console.log('a user connected');
});

const addIoToRoute = (req, res, next) => {
  req.io = io;
  next();
};

app.use(cors());
app.use(express.static('public'))
app.use(express.json());

app.use(texmlPath, express.urlencoded({ extended: true }), texmlController);
app.use(callPath, callController);
app.use(messagePath, addIoToRoute, messageController);
app.use(configurationPath, configurationController)

const port = process.env.TELNYX_APP_PORT || 3000;
http.listen(port);
console.log(`Server listening on port: ${port}`);
