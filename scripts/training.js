// scripts/training.js
const fs = require('fs');
const { parse } = require('csv-parse/sync'); 
const { cleanText } = require('../src/features/cleaning.js');
const { baselineSorter } = require('../src/model/baselineSorter.js');

console.log('Starting training ');

//dataset
console.log('Loading dataset');
const csvData = fs.readFileSync('./data/sms_spam.csv', 'utf8');

const records = parse(csvData, {
  columns: ['label', 'text'],
  from_line: 2, 
  relax_column_count: true,
  skip_empty_lines: true
});

console.log(`Successfully loaded ${records.length} records`);


console.log('Preprocessing and cleaning all text data');
const allMessages = []; 
const allLabels = [];

for (const record of records) {
  allLabels.push(record.label);
  allMessages.push(cleanText(record.text));
}

const splitPoint = Math.floor(allMessages.length * 0.80);

const learningMessages = allMessages.slice(0, splitPoint);
const learningLabels = allLabels.slice(0, splitPoint);

const testMessages = allMessages.slice(splitPoint);
const testLabels = allLabels.slice(splitPoint);

console.log(`Splitting data: ${learningMessages.length} training records, ${testMessages.length} test records.`);


const sorter = new baselineSorter();

console.log('Training baselineSorter model(wait)');
sorter.learn(learningMessages, learningLabels);
console.log('Model training complete.');


fs.mkdirSync('./models', { recursive: true });
sorter.save('./models/baseline-model.json');


console.log(`Running evaluation on ${testMessages.length} test records...`);
let correctGuesses = 0;

for (let i = 0; i < testMessages.length; i++) {
  const message = testMessages[i];
  const realLabel = testLabels[i];

  if (message.length === 0) continue; // Don't test empty messages

  const guess = sorter.guess(message);
  if (guess === realLabel) {
    correctGuesses++;
  }
}

//report metrics
const accuracy = (correctGuesses / testMessages.length) * 100;
console.log('Evaluation Results ');
console.log(`  Test Set Accuracy: ${accuracy.toFixed(2)}%`);
console.log('Training script finished.');