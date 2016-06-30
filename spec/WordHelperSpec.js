describe("Word Helper", function() {
  describe ('count letters', function () {
    it("should be able to count trivial", function() {
      expect(countLetters(null)).toEqual({});
      expect(countLetters("")).toEqual({});
      expect(countLetters(" ")).toEqual({});
      expect(countLetters('1')).toEqual({});
      expect(countLetters('\n')).toEqual({});
      expect(countLetters('\t')).toEqual({});
    });

    it("should be able to count single alphabetic characters", function() {
      for (var i = 0; i < 26; ++i) {
        var char = String.fromCharCode('a'.charCodeAt() + i);
        var expected = {};
        expected[char] = 1;
        expect(countLetters(char)).toEqual(expected);
      }
    });

    it("should not distinguish between lower and upper case", function() {
      for (var i = 0; i < 26; ++i) {
        var lower = String.fromCharCode('a'.charCodeAt() + i);
        var upper = String.fromCharCode(lower.charCodeAt() + ('A'.charCodeAt() - 'a'.charCodeAt()));
        var str = '';
        var length = rand(2, 30);
        for (var i = 0; i < length; ++i) {
          if (Math.random() > .5) {
            str += lower;
          } else {
            str += upper;
          }
        }
        var expected = {};
        expected[lower] = length;
        expect(countLetters(str)).toEqual(expected);
      }
    });

    it('should ignore non lower-case alphabetic text', function() {
      var str = '';
      for (var i = 0; i < 'A'.charCodeAt(); ++i) {
        str += String.fromCharCode(i);
      }
      for (var i = 'Z'.charCodeAt() + 1; i < 'a'.charCodeAt(); ++i) {
        str += String.fromCharCode(i);
      }
      for (var i = 'z'.charCodeAt() + 1; i < 'z'.charCodeAt() + 500; ++i) {
        str += String.fromCharCode(i);
      }
      console.log(str);
      expect(countLetters(str)).toEqual({});
    });
  });

  describe ('is correct solution', function () {
    it("should correctly identify trivial", function() {
      expect(isCorrectSolution(null, null)).toBe(true);
      expect(isCorrectSolution('', null)).toBe(true);
      expect(isCorrectSolution(null, '')).toBe(true);
      expect(isCorrectSolution('', '')).toBe(true);
    });

    it("should correctly identify handpicked examples", function() {
      expect(isCorrectSolution('hello', 'h')).toBe(true);
      expect(isCorrectSolution('hello', 'he')).toBe(true);
      expect(isCorrectSolution('hello', 'hel')).toBe(true);
      expect(isCorrectSolution('hello', 'hell')).toBe(true);
      expect(isCorrectSolution('hello', 'hello')).toBe(true);
      expect(isCorrectSolution('hello', 'o')).toBe(true);
      expect(isCorrectSolution('hello', 'ol')).toBe(true);
      expect(isCorrectSolution('hello', 'oll')).toBe(true);
      expect(isCorrectSolution('hello', 'olle')).toBe(true);
      expect(isCorrectSolution('hello', 'olleh')).toBe(true);
      expect(isCorrectSolution('hello ', 'olleh')).toBe(true);
      expect(isCorrectSolution(' hello', 'olleh')).toBe(true);
      expect(isCorrectSolution(' hello', ' loleh')).toBe(true);
      expect(isCorrectSolution('\nhello', ' loleh')).toBe(true);
    });

    it("should fail on wrongly picked examples", function() {
      expect(isCorrectSolution('hello', 'a')).toBe(false);
      expect(isCorrectSolution('hello', 'ahello')).toBe(false);
      expect(isCorrectSolution('hell', 'hello')).toBe(false);
      expect(isCorrectSolution('hell', 'ello')).toBe(false);
      expect(isCorrectSolution('ello', 'hell')).toBe(false);
      expect(isCorrectSolution('hello', 'helllo')).toBe(false);
    });
  });
});

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
