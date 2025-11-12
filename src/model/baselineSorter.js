
const natural = require('natural');
const fs = require('fs'); 

class baselineSorter {
  constructor() {
    this.classifier = new natural.BayesClassifier();
  }

  learn(messages, labels) {
    // messages is the array of clean word lists
    
    for (let i = 0; i < messages.length; i++) {
      const wordList = messages[i];
      const label = labels[i];

      // Add the document only if it's not empty
      if (wordList.length > 0) {
        this.classifier.addDocument(wordList, label);
      }
    }
    
    this.classifier.train();
  }

  guess(messageWords) {
    return this.classifier.classify(messageWords);
  }


  save(fileName) {
    console.log('Saving model to file');
    
    // stringify the classifier's data
    const modelJson = JSON.stringify(this.classifier);
    
    // 2. Save it to disk synchronously
    fs.writeFileSync(fileName, modelJson, 'utf8');
    
    console.log('Model saved!');
  }

  static load(fileName) {
    console.log('Loading model from file');
    
    const data = fs.readFileSync(fileName, 'utf8');
    const classifier = natural.BayesClassifier.restore(JSON.parse(data));   
    
    const sorter = new baselineSorter();
    sorter.classifier = classifier;
    
    console.log('Model loaded!');
    return sorter;
  }
}

module.exports = { baselineSorter };