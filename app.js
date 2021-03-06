var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var Typo = require('typo-js');
var spellChecker = new Typo('en_US');
var wordHelper = require('./lib/wordhelper.js');

// Number of seconds between word shuffling
var WORD_SHUFFLE_TIME = 60;
var MIN_TARGET_LENGTH = 8;

var solutions = [];
var scores = {};
var target = wordHelper.generateTargetWord(MIN_TARGET_LENGTH);

// Update word and announce winner
setInterval(function() {
  target = wordHelper.generateTargetWord(MIN_TARGET_LENGTH);
  solutions = [];
  scores = {};
  io.emit('update-game', getGameState());
}, 1000 * WORD_SHUFFLE_TIME);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function (socket) {

  socket.on('start-game', function(data) {
    var startGameRes = {
      target: target,
    }
    socket.emit('start-game-res', startGameRes);
    socket.emit('update-game', getGameState());
  });

  socket.on('attempt-word', function(data) {
    var attempt = wordHelper.keepOnlyLowerAlpha(data.attempt);
    var name = data.name;
    var err = isInvalid(name, attempt, target, solutions);
    var attemptWordErr = {error: err};
    if (!err) {
      solutions.unshift({name: name, word: attempt});
      var points = score(attempt, target);
      scores[name] = scores[name] ? scores[name] + points : points;
      io.emit('update-game', getGameState());
    } else {
      socket.emit('attempt-word-err', attemptWordErr);
    }
  });
});

function getGameState() {
  return {
    target: target,
    solutions: solutions,
    scores: scores
  };
}

function score(attempt, target) {
  return Math.floor(attempt.length * attempt.length / 4);
}

var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Spelloff started listening on port " + port);
});

// Returns errorText if not valid, empty error text if good
function isInvalid(name, attempt, target, solutions) {
  if (!name) {
    return "Please type in your name!";
  } else if (name.length < 3 || name.length > 16) {
    return 'Name must be between 3 and 16 characters!';
  }

  if (!attempt) {
    return "Please enter a word!";
  } else if (attempt.length > target.length) {
    return 'Your attempt is too long!';
  } else if (solutions.map(function(solution) { return solution.word }).indexOf(attempt) > -1) {
    return attempt + ' has already been attemped!';
  } else if (!wordHelper.isCorrectSolution(target, attempt)) {
    return attempt + ' cannot be spelled with the letters of ' + target;
  } else if (!spellChecker.check(attempt) || attempt.length == 1) {
    return attempt + ' is not a word in the english dictionary!';
  } else if (attempt == target) {
    return target + ' cannot be used because it is the target word!';
  } else {
    return '';
  }
}
