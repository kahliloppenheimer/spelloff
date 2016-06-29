// Returns true iff attempt can be spelled from the letters of target
function isCorrectSolution(attempt, target) {

}

// Returns a mapping of letters to frequency at which they appear in the word
function countLetters(word) {
  var letters = {};
  if (!word) {
    return letters;
  }
  word = keepOnlyLowerAlpha(word);
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

// Strips a word of all non-alphabetic text and lower-cases it
// NOTE: replace must be done before lower-casing because lower-casing
// can cause non alphabetic english text to become english text
function keepOnlyLowerAlpha(word) {
  return word.replace(/[^a-zA-Z]/g, '').toLowerCase();
}
