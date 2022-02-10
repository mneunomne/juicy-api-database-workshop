// Import libraries
const express = require('express')
const mongoose = require("mongoose")

// server application 
var app = express()

//const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOSTNAME}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const mongoUri = `mongodb+srv://moin:juicy123@cluster0.n8go0.mongodb.net/text-board?retryWrites=true&w=majority`;

// MongoDB User Schema 
const Text = mongoose.model('Text', mongoose.Schema({
  message: String,
  id: String
}));

mongoose.connect(mongoUri, { useNewUrlParser: true }, function (err, res) {
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
  var message = req.body.message
  new Text({
    message: message,
    id: audio_id + "",
  }).save(function (err) { // save the message on the database
    if (err) return console.error(err);
    console.log(`[MongoDB] saved to ${audio_id} database!`,)
  });
})

// setting the server to run on port 3000
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})