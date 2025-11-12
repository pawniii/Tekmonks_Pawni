class countingWordsSorter{
  constructor() {
    this.spamWordCounts = new Map();
    this.hamWordCounts = new Map();
    this.totalSpamMessages = 0;
    this.totalHamMessages = 0;
    this.totalSpamWords = 0;
    this.totalHamWords = 0;
    this.allWords = new Set();
  }

  learn(messages, labels) {
    for (let i = 0; i < messages.length; i++) {
      const messageWords = messages[i];
      const label = labels[i];

      if (label === 'spam') {
        this.totalSpamMessages++;
        for (const word of messageWords) {
          this.allWords.add(word);
          this.totalSpamWords++;
          const count = this.spamWordCounts.get(word) || 0;
          this.spamWordCounts.set(word, count + 1);
        }
      } else {
        this.totalHamMessages++;
        for (const word of messageWords) {
          this.allWords.add(word);
          this.totalHamWords++;
          const count = this.hamWordCounts.get(word) || 0;
          this.hamWordCounts.set(word, count + 1);
        }
      }
    }
  }


  guess(messageWords) {

    let spamScore = Math.log(this.totalSpamMessages / (this.totalSpamMessages + this.totalHamMessages));
    let hamScore = Math.log(this.totalHamMessages / (this.totalSpamMessages + this.totalHamMessages));

    const totalUniqueWords = this.allWords.size;

    for (const word of messageWords) {
      // Naive Bayes math with Laplace (+1) smoothing

      const wordSpamCount = this.spamWordCounts.get(word) || 0;
      const spamProb = Math.log((wordSpamCount + 1) / (this.totalSpamWords + totalUniqueWords)); 
      spamScore += spamProb;

      // word hamminess
      const wordHamCount = this.hamWordCounts.get(word) || 0;
      const hamProb = Math.log((wordHamCount + 1) / (this.totalHamWords + totalUniqueWords)); 
      hamScore += hamProb;
    }

    return spamScore > hamScore ? 'spam' : 'ham';
  }
}

module.exports = { countingWordsSorter };