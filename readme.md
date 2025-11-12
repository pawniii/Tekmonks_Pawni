# Node.js Spam Classification Service

This project is a Node.js service designed to classify SMS-like text messages as "spam" or "ham" (not spam). It includes a from-scratch model, a library-based baseline, and a REST API for predictions.

## Table of Contents
    ```
- [Project Structure](#project-structure)
- [Related Documentation](#related-documentation)
- [Installation](#installation)
- [Usage](#usage)
  - [1. Train the Model](#1-train-the-model)
  - [2. Run the API Server](#2-run-the-api-server)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [API Endpoint Testing](#api-endpoint-testing)
- [Creator](#creator)
- [Final Note](#final-note)
   ```
## Project Structure
    ```
spam/ ├── data/ │ └── sms_spam.csv # The raw dataset ├── models/ │ └── (created by script) # Stores the saved baseline-model.json ├── node_modules/ │ └── (ignored by git) ├── scripts/ │ └── training.js # Script to preprocess, train, and save Model B ├── src/ │ ├── features/ │ │ └── cleaning.js # Text preprocessing utility │ ├── model/ │ │ ├── baselineSorter.js # Model B: 'natural' library Naive Bayes │ │ └── countingWordsSorter.js # Model A: From-scratch Naive Bayes │ └── server/ │ └── app.js # The Express API server logic ├── test/ │ └── unit/ │ └── sorter.test.js # Unit tests for Model A ├── .gitignore ├── API.md # API endpoint documentation ├── package.json # Project dependencies ├── package-lock.json └── REPORT.md # In-depth model report
    ```
    
## Related Documentation

For a detailed analysis of this project, please see the following files:

-   **`REPORT.md`**: Contains the full data analysis (EDA), model justifications, evaluation metrics (Accuracy, Precision, Recall, F1, Confusion Matrix), and analysis of the results.
-   **`API.md`**: Provides detailed documentation for all API endpoints, including request/response schemas and error codes.

## Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd spam
    ```
2.  Install the required dependencies from `package.json`:
    ```bash
    npm install
    ```
    This will install `express`, `natural` (v4.1.2), `csv-parse`, `zod`, `jest`, etc.

## Usage

### 1. Train the Model

Before running the API, you must train the baseline model.

```bash
node scripts/training.js
This script performs the following actions:

Loads and preprocesses the data/sms_spam.csv dataset.

Splits the data into an 80/20 train/test set.

Trains the baselineSorter (Model B) on the training data.

Saves the trained classifier to models/baseline-model.json.

Prints a full evaluation report (Accuracy, Precision, etc.) to the console.

2. Run the API Server
Once the models/baseline-model.json file has been created, you can start the API server.

Bash

npm run dev
The server will start on http://localhost:3000.

Testing
Unit Tests
Unit tests are included for the core math of the "from-scratch" Naive Bayes model (Model A).

Bash

npm run test
API Endpoint Testing
The running API can be tested using curl or an API client like Postman.
Screenshot of Postman tests can be found in the /testing-images folder
