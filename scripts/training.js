
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
  skip_empty_lines: true,
});

console.log(`Successfully loaded ${records.length} records`);

console.log('Preprocessing and cleaning all text data');
const allMessages = [];
const allLabels = [];
const allOriginalTexts = []; // Store original text

for (const record of records) {
  allLabels.push(record.label);
  allMessages.push(cleanText(record.text));
  allOriginalTexts.push(record.text); // Store original text
}

const splitPoint = Math.floor(allMessages.length * 0.80);

const learningMessages = allMessages.slice(0, splitPoint);
const learningLabels = allLabels.slice(0, splitPoint);

const testMessages = allMessages.slice(splitPoint);
const testLabels = allLabels.slice(splitPoint);
const testOriginalTexts = allOriginalTexts.slice(splitPoint);

console.log(`Splitting data: ${learningMessages.length} training records, ${testMessages.length} test records.`);

const sorter = new baselineSorter();

console.log('Training baselineSorter model(wait)');
sorter.learn(learningMessages, learningLabels);
console.log('Model training complete.');

fs.mkdirSync('./models', { recursive: true });
sorter.save('./models/baseline-model.json');

console.log(`Running evaluation on ${testMessages.length} test records...`);


let truePositives = 0;
let falsePositives = 0;
let trueNegatives = 0;
let falseNegatives = 0;
const misclassifiedExamples = [];

for (let i = 0; i < testMessages.length; i++) {
  const message = testMessages[i];
  const realLabel = testLabels[i];

  if (message.length === 0) continue;

  const guess = sorter.guess(message);

  if (guess === 'spam' && realLabel === 'spam') {
    truePositives++;
  } else if (guess === 'spam' && realLabel === 'ham') {
    falsePositives++;
    misclassifiedExamples.push({
      text: testOriginalTexts[i],
      guess: 'spam',
      actual: 'ham',
    });
  } else if (guess === 'ham' && realLabel === 'ham') {
    trueNegatives++;
  } else if (guess === 'ham' && realLabel === 'spam') {
    falseNegatives++;
    misclassifiedExamples.push({
      text: testOriginalTexts[i],
      guess: 'ham',
      actual: 'spam',
    });
  }
}


const totalGuesses = testMessages.length;
const accuracy = (truePositives + trueNegatives) / totalGuesses;
const precision = truePositives / (truePositives + falsePositives);
const recall = truePositives / (truePositives + falseNegatives);
const f1Score = 2 * (precision * recall) / (precision + recall);

const spamCounts = {};
const hamCounts = {};
const allTrainingWords = new Set();

for (let i = 0; i < learningMessages.length; i++) {
  const label = learningLabels[i];
  const message = learningMessages[i];
  
  for (const token of message) {
    allTrainingWords.add(token);
    if (label === 'spam') {
      spamCounts[token] = (spamCounts[token] || 0) + 1;
    } else {
      hamCounts[token] = (hamCounts[token] || 0) + 1;
    }
  }
}

const featureScores = [];
for (const token of allTrainingWords) {
  const sCount = spamCounts[token] || 0;
  const hCount = hamCounts[token] || 0;


  if (sCount > 0) {
    //ratio: spam count / (ham count + 1)
    const score = sCount / (hCount + 1);
    featureScores.push({ token, score, sCount, hCount });
  }
}


featureScores.sort((a, b) => b.score - a.score);
const topSpamFeatures = featureScores.slice(0, 10);

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

console.log('   Misclassified Examples (showing first 5):');
for (let i = 0; i < 5 && i < misclassifiedExamples.length; i++) {
  const ex = misclassifiedExamples[i];
  console.log(`   - Guessed: "${ex.guess}", Actual: "${ex.actual}"`);
  console.log(`     Text: "${ex.text.substring(0, 70)}..."\n`);
}

console.log('   Top 10 Spam Tokens (by Spam/Ham Ratio):');
topSpamFeatures.forEach((feature, i) => {
  console.log(`   ${i + 1}. ${feature.token} (Score: ${feature.score.toFixed(2)}, Spam: ${feature.sCount}, Ham: ${feature.hCount})`);
});

console.log('Training script finished.');
