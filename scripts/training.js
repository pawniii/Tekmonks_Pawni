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

// --- METRICS INITIALIZATION ---
// We need these 4 counters to build the confusion matrix
let truePositives = 0;  // Guessed "spam", was "spam" (Correct)
let falsePositives = 0; // Guessed "spam", was "ham"  (Mistake)
let trueNegatives = 0;  // Guessed "ham", was "ham"   (Correct)
let falseNegatives = 0; // Guessed "ham", was "spam"  (Mistake)

for (let i = 0; i < testMessages.length; i++) {
  const message = testMessages[i];
  const realLabel = testLabels[i];

  if (message.length === 0) continue; // Don't test empty messages

  const guess = sorter.guess(message);

  // Populate the 4 counters
  if (guess === 'spam' && realLabel === 'spam') {
    truePositives++;
  } else if (guess === 'spam' && realLabel === 'ham') {
    falsePositives++;
  } else if (guess === 'ham' && realLabel === 'ham') {
    trueNegatives++;
  } else if (guess === 'ham' && realLabel === 'spam') {
    falseNegatives++;
  }
}

// --- METRIC CALCULATIONS ---
const totalGuesses = testMessages.length;
// Accuracy: (All correct guesses) / (All guesses)
const accuracy = (truePositives + trueNegatives) / totalGuesses;

// Precision (for "spam" class): How many of our "spam" guesses were correct?
// TP / (TP + FP)
const precision = truePositives / (truePositives + falsePositives);

// Recall (for "spam" class): How many of the *actual* spam messages did we find?
// TP / (TP + FN)
const recall = truePositives / (truePositives + falseNegatives);

// F1-Score (for "spam" class): The balanced average of Precision and Recall
const f1Score = 2 * (precision * recall) / (precision + recall);


// --- FULL REPORT ---
console.log('--- Evaluation Results ---');
console.log(`   Test Set Accuracy: ${(accuracy * 100).toFixed(2)}%`);
console.log('---');
console.log('   Metrics (for "spam" class):');
console.log(`   Precision: ${(precision * 100).toFixed(2)}%`);
console.log(`   Recall:    ${(recall * 100).toFixed(2)}%`);
console.log(`   F1-Score:  ${(f1Score * 100).toFixed(2)}%`);
console.log('---');

console.log('   Confusion Matrix:');
console.log('                 (Predicted)');
console.log('                SPAM   |   HAM');
console.log(` (Actual) SPAM | ${truePositives}     | ${falseNegatives}`);
console.log(` (Actual) HAM  | ${falsePositives}     | ${trueNegatives}`);
console.log('---');
console.log('Training script finished.');
