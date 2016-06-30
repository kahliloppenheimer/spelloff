var app = angular.module("spelloff", []);
spellChecker = undefined;
loadSpellChecker();

app.controller("myCtrl", function($scope) {
  $scope.targetWord = "Magazine";
  $scope.solutions = ["gaze", "maze", "gem"];

  $scope.attemptWord = function(keyEvent) {
    // Not an enter keystroke
    if (keyEvent.which != 13) {
      return;
    }
    $scope.errorText = "";
    var attempt = keepOnlyLowerAlpha($scope.attemptedWord);
    if (!attempt) {
      $scope.errorText = "Please enter a word!";
    } else if ($scope.solutions.indexOf(attempt) > -1) {
      $scope.errorText = attempt + " has already been attemped!";
    } else if (!isCorrectSolution($scope.targetWord, attempt)) {
      $scope.errorText = attempt + ' cannot be spelled with the letters of ' + $scope.targetWord;
    } else if (!spellChecker.check(attempt)) {
      $scope.errorText = attempt + ' is not a word in the english dictionary!';
    } else {
      $scope.solutions.push(attempt);
      $scope.attemptedWord = '';
    }

  }
});

function loadSpellChecker() {
  // return new Typo('en_US', 'typo/dictionaries/en_US/en_US.aff', 'typo/dictionaries/en_US/en_US.dic');
  if (localStorage) {
    if (localStorage.affData && localStorage.wordsData) {
      spellChecker = new Typo("en_US", localStorage.affData, localStorage.wordsData);
    } else {
      $.get('typo/dictionaries/en_US/en_US.aff', function (affData) {
        $.get('typo/dictionaries/en_US/en_US.dic', function (wordsData) {
          localStorage.affData = affData;
          localStorage.wordsData = wordsData;
          spellChecker = new Typo("en_US", localStorage.affData, localStorage.wordsData);
        });
      });
    }
  }

}
