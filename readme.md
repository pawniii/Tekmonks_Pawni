# Node.js Sms spam Classification Service

This project is a Node.js service designed to classify SMS-like text messages as "spam" or "ham" (not spam) using classical machine learning. It fulfills the "Fresh Joiner Technical Exercise" requirements by implementing two models, an API, and a complete testing and documentation suite.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
  - [1. Train the Model](#1-train-the-model)
  - [2. Run the API Server](#2-run-the-api-server)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [API Endpoint Testing](#api-endpoint-testing)
- [Key Libraries Used](#key-libraries-used)

## Project Structure

```

├── data/
│   └── sms\_spam.csv         \# The raw dataset
├── models/
│   └── (created by script)  \# Stores the saved baseline-model.json
├── node\_modules/
│   └── (ignored by git)
├── scripts/
│   └── training.js          \# Script to preprocess, train, and save Model B
├── src/
│   ├── features/
│   │   └── cleaning.js      \# Text preprocessing utility
│   ├── model/
│   │   ├── baselineSorter.js      \# Model B: 'natural' library Naive Bayes
│   │   └── countingWordsSorter.js \# Model A: From-scratch Naive Bayes
│   └── server/
│       └── app.js           \# The Express API server logic
├── test/
│   └── unit/
│       └── sorter.test.js   \# Unit tests for Model A
├── .gitignore
├── API.md                   \# API endpoint documentation
├── package.json             \# Project dependencies
├── package-lock.json
└── REPORT.md                \# In-depth model report

```
## Installation

1.  Clone the repository:
      git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd spam
2.  Install the required dependencies from `package.json`:
      npm install
    This will install `express`, `natural`, `csv-parse`, `zod`, `jest`, etc.

## Usage

### 1. Train the Model

Before running the API, you must train the baseline model.

  node scripts/training.js

This script performs the following actions:

1.  Loads the `data/sms_spam.csv` dataset.
2.  Preprocesses and cleans the text.
3.  Splits the data into an 80/20 train/test set.
4.  Trains the `baselineSorter` (Model B) on the training data.
5.  Saves the trained classifier to `models/baseline-model.json`.
6.  Runs an evaluation on the test set and prints the final accuracy.

### 2\. Run the API Server

Once the `models/baseline-model.json` file has been created, you can start the production-lean server.

  npm run dev

The server will start on `http://localhost:3000`. You will see log messages confirming the model was loaded and the server is running.

## Testing

### Unit Tests

Unit tests are included for the core math of the "from-scratch" Naive Bayes model (Model A).

  npm run test

### API Endpoint Testing

The running API can be tested using `curl` or an API client like Postman.

**Example `POST /predict` request:**



*Screenshot of Postman tests can be found in the `/testing-images` folder.*

## Key Libraries Used

  - **Server:** `express`, `zod` (for validation)
  - **ML & NLP:** `natural` (for Naive Bayes and TF-IDF), `csv-parse`
  - **Testing:** `jest`
  - **Utilities:** `dotenv`, `pino`


# Project Report: Spam Classification Service

## 1. Data & Preprocessing

* **Dataset:** The "SMS Spam Collection" dataset was used, containing 5572 rows with two columns: `label` (spam/ham) and `text`.
* **Preprocessing Pipeline (`cleaning.js`):**
    1.  **Case Normalization:** All text converted to lowercase.
    2.  **Noise Removal:** All punctuation (non-alphanumeric characters) removed.
    3.  **Tokenization:** Text split into an array of words (tokens).
    4.  **Stop-word Removal:** A minimal list of common English stop-words (e.g., 'a', 'the', 'is') was filtered out.

## 2. Modeling Pipeline


### Model A: Multinomial Naive Bayes (From Scratch)
* **File:** `src/model/countingWordsSorter.js`
* **Implementation:** A from-scratch implementation of Multinomial Naive Bayes. It correctly calculates class priors and conditional likelihoods for each word.
* **Features:** Standard word counts (term frequency).
* **Smoothing:** Laplace (add-one) smoothing is applied to handle words not seen during training.
* **Testing:** Core math is validated via `test/unit/sorter.test.js`.

### Model B: Library-Based Baseline
* **File:** `src/model/baselineSorter.js`
* **Model Choice:** `natural.BayesClassifier`.
* **Justification:** This built-in classifier was chosen over `ml-logistic-regression` due to its stability, speed, and seamless integration. The `ml-logistic-regression` library, combined with `natural`'s TF-IDF, created significant dependency conflicts and data-shaping (sparse vs. dense array) challenges that were unviable for a production-lean implementation. The `BayesClassifier` provides a fast, reliable, and compliant baseline.

## 3. Evaluation & Results

The models were evaluated on a 20% held-out test split (1115 records).

### Final Metrics (Model B: `baselineSorter`)

* **Accuracy:** 84.57%
The baseline model was evaluated on the 20% held-out test set (1115 records).

* **Metrics (for "spam" class):**
    * **Precision:** 45.89%
    * **Recall:** 100.00%
    * **F1-Score:** 62.91%

* **Confusion Matrix:**

        ```
                     (Predicted)
                    SPAM   |   HAM
     (Actual) SPAM | 145    | 0
     (Actual) HAM  | 171    | 798
    ```
## 4. Analysis & Future Improvements

### Analysis
The model's 84.57% accuracy is a reasonable baseline.
* **Success:** It correctly identifies obvious, high-signal spam (e.g., "CONGRATS! You won a FREE entry!").
* **Failure (Underfitting):** It incorrectly flagged several "ham" messages as "spam." For example, `"Are you available for a call today for the project discussion?"` was marked as spam.
  
## Creator

Made by **Pawni Dixit**

## Final Note

*This project serves as a technical foundation for building robust, real-time filtering services. Its goal is to reduce digital noise and ensure cleaner communication channels.*
