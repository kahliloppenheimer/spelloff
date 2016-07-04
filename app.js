var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var Typo = require('typo-js');
var spellChecker = new Typo('en_US');
var wordHelper = require('./lib/wordhelper.js');

var target = 'Magazine';
var solutions = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function (socket) {

  socket.on('start-game', function(data) {
    var res = {
      targetWord: 'Magazine',
      solutions: solutions
    }
    socket.emit('start-game-res', res);
  });

  socket.on('attempt-word', function(data) {
    var attempt = data.attempt;
    var err = isInvalid(attempt, target, solutions);
    var newSolutions = {solutions: solutions};
    var attemptWordErr = {error: err};
    if (!err) {
      solutions.push(attempt);
      io.emit('update-solutions', newSolutions);
    } else {
      socket.emit('attempt-word-err', attemptWordErr);
    }
  });
  
});

var port = 3000;
server.listen(port, function() {
  console.log("Spelloff started listening on port " + port);
});

// Returns errorText if not valid, empty error text if good
function isInvalid(attempt, target, solutions) {
  if (!attempt) {
    return "Please enter a word!";
  } else if (solutions.indexOf(attempt) > -1) {
    return attempt + " has already been attemped!";
  } else if (!wordHelper.isCorrectSolution(target, attempt)) {
    return attempt + ' cannot be spelled with the letters of ' + target;
  } else if (!spellChecker.check(attempt)) {
    return attempt + ' is not a word in the english dictionary!';
  } else {
    return '';
  }
}
