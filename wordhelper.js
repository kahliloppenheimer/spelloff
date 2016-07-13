var exports = module.exports;
var randomWords = require('random-words');
var Typo = require('typo-js');
var spellChecker = new Typo('en_US');

var MIN_SOLUTION_WORD_LENGTH = 3;

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

// Generates a random word of at least length n
exports.generateTargetWord = function(n) {
  var target = randomWords();
  while (target.length < n) {
    target = randomWords();
  }
  return target;
}

function isEnglishWord (word) {
  return spellChecker.check(word);
}

exports.isEnglishWord = isEnglishWord;

exports.findAllSubWords = findAllSubWords;

// Function that will look at all permutations of all lengths of the characters
// in this string and return those which are words in the english dictionary
function findAllSubWords (word) {
  return recurFindAllSubWords(word, {});
}

function recurFindAllSubWords(word, memoized) {
  if (word.length < MIN_SOLUTION_WORD_LENGTH) {
    memoized[word] = [];
  }

  if (!memoized[word]) {
    memoized[word] = getPermutations(word).concat(getChildWords(word)
      // Take each child word and find the recursive results for each
      .map(function (child) {
        return recurFindAllSubWords(child, memoized);
      })
      // Flatten out all of the results for all children into a single array
      .reduce(function(cum, curr) { return cum.concat(curr) }, []));

    memoized[word] = memoized[word].filter(function(x) { return x.length > 2})
                                   .filter(function(x) { return isEnglishWord(x) });
  }
  return memoized[word];
}

// Returns a list of all sets of characters with length one less than word
function getChildWords(word) {
  var res = [];
  for (var i = 0; i < word.length; ++i) {
    res.push(word.slice(0, i) + word.slice(i + 1, word.length));
  }
  return res;
}

// Returns all permutations of a given string
function getPermutations (string) {
  var results = [];
	var length = string.length;
	var count = fact(length);

	for (var i=0;i<count;i++) {
		var permutation = [];
		var bucket = string.split('');
		for (var u=0;u<length;u++)
			permutation.push(bucket.splice(Math.floor(i/(fact(length)/fact(length-u)))%(length-u),1));

		results.push(permutation.join(''));
	}
  return results;
}

// Returns factorial of the passed integer
function fact (integer) {
	if (integer < 2)
		return 1;

	if (!arguments.callee.cache)
		arguments.callee.cache = [];

	return arguments.callee.cache[integer-2] || (arguments.callee.cache[integer-2] = integer*arguments.callee(integer-1));
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
