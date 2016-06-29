DEFAULT_SCORE_COLOR = 'black';
var app = angular.module("spelloff", []);
app.controller("myCtrl", function($scope) {

    $scope.targetWord = "Magazine";
    $scope.solutions = ["gaze", "maze", "gem"];
    $scope.scoreColor = DEFAULT_SCORE_COLOR;

    $scope.attemptWord = function(keyEvent) {
      // Not an enter keystroke
      if (keyEvent.which != 13) {
        return;
      }
      $scope.errorText = "";
      if (!$scope.attemptedWord) {
          $scope.errorText = "Please enter a word!";
      } else if ($scope.solutions.indexOf($scope.attemptedWord) > -1) {
        $scope.errorText = $scope.attemptedWord + " has already been attemped!";
      } else {
        $scope.solutions.push($scope.attemptedWord);
      }
    }

});
