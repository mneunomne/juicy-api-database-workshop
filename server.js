// Import libraries
const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const { Server } = require("socket.io");
const http = require('http')
require('dotenv').config()

const PORT = process.env.PORT || 3000

// server application 
const app = express()
const server = http.Server(app);

// socket.io
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected');
});

// body parser (to correctly intepret the messages coming from the "POST" request)
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//const mongoUri = `mongodb+srv://moin:juicy123@cluster0.n8go0.mongodb.net/text-board?retryWrites=true&w=majority`;
const mongoUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.n8go0.mongodb.net/${process.env.MONGODB_COLLECTION}?retryWrites=true&w=majority`;

// MongoDB User Schema 
const Text = mongoose.model('Text', mongoose.Schema({
  id: String,
  message: String,
  x: Number,
  y: Number
}));

// connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true }, function (err) {
  // if there are any errors, print it 
  if (err) {
    console.error(err)
    throw err
  }
  console.log(`[MongoDB] Connected to database`)
})

// here we make available the folder "public" to be access
app.use(express.static('public'))

// get all texts
app.get('/api/texts', function (req, res) {
  Text.find({}, function (err, texts) {
    if (err) console.error(err)
    res.json(texts)
  })
})

// submit new text
app.post('/api/text', function (req, res) {
  console.log('request', req.body)
  var id = req.body.id
  var message = req.body.message
  var x = parseFloat(req.body.x)
  var y = parseFloat(req.body.y)
  var data = {
    id: id,
    message: message,
    x: x,
    y: y
  }
  // create next "Text" object and save it to the database
  new Text(data).save(function (err) {
    // if there is any error, return function
    if (err) return console.error(err);
    console.log(`[MongoDB] saved to ${message} database!`)
    io.emit('message_added', data);
    // return response with the new audio data
    res.json(data)
  });
})

// edit information on a Text element on the database
app.put('/api/text', function (req, res) {
  // get parameters
  var id = req.body.id
  var x = parseFloat(req.body.x)
  var y = parseFloat(req.body.y)
  var data = {id, x, y}
  // filter to find the Text element to be editted
  const filter = {"id": id}
  // new information to be inserted
  const update = { $set :{ "x": x, "y": y } };
  Text.findOneAndUpdate(filter, update, function(err, doc) {
    if (err) return res.send(500, {error: err});
    io.emit('message_updated', data); // This will emit the event to all connected sockets
    return res.send('Succesfully saved.');
  }); 
})

// delete Text element from the database
app.delete('/api/text', function (req, res) {
  var id = req.body.id
  const filter = {"id": id}
  Text.deleteOne(filter, function (err) {
    if (err) return handleError(err);
    console.log("document deleted")
    io.emit('message_deleted', id); // This will emit the event to all connected sockets
    return res.send('Succesfully deleted.');
  });
})

// setting the server to run on port 3000
server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`)
})