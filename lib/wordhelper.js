var exports = module.exports;
// Strips a word of all non-alphabetic text and lower-cases it
// NOTE: replace must be done before lower-casing because lower-casing
// can cause non alphabetic english text to become english text
exports.keepOnlyLowerAlpha = function(word) {
  return word.replace(/[^a-zA-Z]/g, '').toLowerCase();
}
// Returns true iff attempt can be spelled from the letters of target
exports.isCorrectSolution = function(target, attempt) {
  var attemptCount = countLetters(attempt);
  var targetCount = countLetters(target);
  return isContainedBy(targetCount, attemptCount);
}

// Returns a mapping of letters to frequency at which they appear in the word
function countLetters(word) {
  var letters = {};
  if (!word) {
    return letters;
  }
  word = exports.keepOnlyLowerAlpha(word);
  for (var i = 0; i < word.length; ++i) {
      var letter = word[i];
      if (!letters[letter]) {
          letters[letter] = 1;
      } else {
          letters[letter]++;
      }
  }
  return letters;
}

// Returns true iff for every key in countB, the count associated with that key
// is less than or equal to the count for the same key in countA
function isContainedBy(countA, countB) {
  for (var letter in countB) {
    if (countB.hasOwnProperty(letter)) {
      if (!countA.hasOwnProperty(letter)) {
        return false;
      }
      if (countA[letter] < countB[letter]) {
        return false;
      }
    }
  }
  return true;
}
