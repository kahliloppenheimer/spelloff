var app = angular.module("spelloff", []);
var socket = io.connect();

app.controller("myCtrl", function($scope, $http) {
  // Initiate start-game and load started-game-state
  socket.emit('start-game');
  socket.on('start-game-res', function (data) {
    $scope.targetWord = data.targetWord;
    $scope.$apply();
  });

  $scope.attemptWord = function(keyEvent) {
    if (!isEnterKey(keyEvent)) return;

    socket.emit('attempt-word', {
      name: $scope.name,
      attempt: $scope.attemptedWord
    });
    $scope.errorText = '';
    $scope.attemptedWord = '';

    socket.on('attempt-word-err', function(data) {
      $scope.errorText = data.error;
      $scope.$apply();
    });

    socket.on('update-game', function(data) {
      $scope.solutions = data.solutions;
      $scope.scores = data.scores;
      $scope.$apply();
    });
  }

});

// Returns true iff the keyEvent corresponds to the enter key
function isEnterKey(keyEvent) {
  return keyEvent.which == 13;
}
