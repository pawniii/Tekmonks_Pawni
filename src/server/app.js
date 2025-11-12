
const express = require('express');
const { z } = require('zod'); 
const { baselineSorter } = require('../model/baselineSorter.js');
const { cleanText } = require('../features/cleaning.js');

const app = express();
app.use(express.json()); 

//loading model
console.log('Loading the "baseline-model.json" model...');
const mySorter = baselineSorter.load('./models/baseline-model.json');
console.log('Model is loaded and ready.');

// schema
const predictSchema = z.object({
  messages: z.array(z.string().min(1))
});

// get/health endpoint
app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    model: 'BayesClassifier (natural) is running!'
  });
});

// post/predict endpoint
app.post('/predict', (request, response) => {

  const check = predictSchema.safeParse(request.body);
  if (!check.success) {
    // validation fails bad request
    return response.status(400).json({ error: 'Your request is wrong. Send {"messages": [...] }' });
  }

  const { messages } = request.body;
  const predictions = [];

  for (const messyMessage of messages) {

    const cleanWords = cleanText(messyMessage);
    
    // Using loaded sorter to make a guess
    const guess = mySorter.guess(cleanWords);
    
    predictions.push({
      label: guess,
      score: null // bayesClassifier doesn't give a simple 0-1 score
    });
  }


  response.json({ predictions: predictions });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server is open at http://localhost:${port}`);
});