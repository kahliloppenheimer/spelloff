var app = angular.module("spelloff", []);
var socket = io.connect();

app.controller("myCtrl", function($scope, $http) {
  // Initiate start-game and load started-game-state
  socket.emit('start-game');
  socket.on('start-game-res', function (data) {
    $scope.target = data.target;
    // Maps index in target to true if it should be glowing
    $scope.glow = {};
    $scope.$apply();
  });

  socket.on('update-game', function(data) {
    $scope.attemptedWord = '';
    $scope.glow = {};
    $scope.errorText = '';
    $scope.solutions = data.solutions;
    $scope.scores = data.scores;
    $scope.target = data.target;
    $scope.$apply();
  });

  socket.on('attempt-word-err', function(data) {
    $scope.errorText = data.error;
    $scope.$apply();
  });

  $scope.attemptWord = function(keyEvent) {
    // If letter key, reject letters you cant use
    if (isLetterKey(keyEvent) && $scope.attemptedWord) {
      var attemptLetterCount = getLetterCount($scope.attemptedWord);
      var targetLetterCount = getLetterCount($scope.target);
      var typed = keyEvent.key;
      if (!targetLetterCount[typed] || attemptLetterCount[typed] + 1 > targetLetterCount[typed]) {
        keyEvent.preventDefault();
        return false;
      }
    }
    // If enter key, attempt word
    if (isEnterKey(keyEvent)) {
      $scope.errorText = '';

      socket.emit('attempt-word', {
        name: $scope.name,
        attempt: $scope.attemptedWord
      });

      $scope.attemptedWord = '';
      $scope.updateGlow();
    }
  }

  $scope.updateGlow = function() {
    $scope.glow = {};
    var letterCount = getLetterCount($scope.attemptedWord);
    for (var i = 0; i < $scope.target.length; ++i) {
      var letter = $scope.target[i];
      if (letterCount[letter]) {
        $scope.glow[i] = true;
        letterCount[letter]--;
      }
    }
  }
});

// Returns map of letter to frequency of occurence in word
function getLetterCount(word) {
  if (!word) {
    return {};
  }
  var count = {};
  for (var i = 0; i < word.length; ++i) {
    count[word[i]] = count[word[i]] + 1 || 1;
  }
  return count;
}

// Returns true iff the keyEvent corresponds to a letter a-z
function isLetterKey(keyEvent) {
  return keyEvent.which >= 97 && keyEvent.which <= 122;
}

// Returns true iff the keyEvent corresponds to the enter key
function isEnterKey(keyEvent) {
  return keyEvent.which == 13;
}
