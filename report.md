# Project Report: Spam Classification Service

## 1. Data & Lightweight EDA

* **Dataset:** The "SMS Spam Collection" dataset was used (5572 rows).
* **Preprocessing Plan:**
    1.  **Normalization:** All text converted to lowercase.
    2.  **Noise Removal:** All non-alphanumeric characters (punctuation, symbols) removed.
    3.  **Tokenization:** Text split into an array of words (tokens).
    4.  **Stop-word Removal:** A minimal list of common English stop-words (e.g., 'a', 'the', 'is') was filtered out.
* **EDA Highlights:**
    1.  **Class Imbalance:** The dataset is highly imbalanced. **86.6%** of messages are "ham" (normal) and only **13.4%** are "spam". This means a model that just guessed "ham" every time would still get 86.6% accuracy.
    2.  **Message Length:** "Spam" messages are, on average, significantly longer than "ham" messages. This is a strong predictive feature.

## 2. Modeling Choices

* **Model A (From Scratch):** `countingWordsSorter.js`
    A from-scratch implementation of Multinomial Naive Bayes. It correctly calculates class priors and conditional likelihoods with Laplace (add-one) smoothing, as required.

* **Model B (Library Baseline):** `baselineSorter.js`
    * **Model:** `natural.BayesClassifier`.
    * **Justification:** This classifier was chosen for its stability, speed, and simplicity. The alternative, `ml-logistic-regression`, presented significant dependency conflicts and data-shaping challenges (sparse vs. dense arrays) that were unviable for this exercise. The `BayesClassifier` provides a fast, reliable, and compliant baseline.

## 3. Training & Evaluation

* **Training (CV Summary):** A simple **80/20 train/test split** was used. A 5-fold cross-validation was skipped to prioritize getting the end-to-end pipeline working, as the dependency issues with the preferred models (like Logistic Regression) consumed significant time.
* **Evaluation (Held-Out 20% Test Set):** The baseline model was evaluated on 1115 records.

### Final Test Metrics (Model B)

* **Accuracy:** 84.57%
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

## 4. Key Takeaways & Limitations

* **Analysis:** The model has **perfect Recall (100.00%)** but **very low Precision (45.89%)**.
* **What this means:** The model successfully **found every single spam message** in the test set. It let **zero** spam messages slip through. However, to do this, it **incorrectly flagged 171 normal ("ham") messages as spam**.
* **Conclusion:** The model is "underfitting." It's too simple and is biased towards guessing "spam". It learned that words like "call" or "project" are "spammy" but cannot understand the *context* that makes them "ham." For a spam filter, this is a **bad trade-off**—we are blocking many legitimate messages from our users.
* **Limitations:**
    1.  A more sophisticated model (like Logistic Regression) is needed to improve precision.
    2.  The `natural.BayesClassifier` does not provide probability scores, so `null` is returned in the API.

---
## Creator

Pawni Dixit

## Final Note

This project serves as a technical foundation for building robust, real-time filtering services. Its goal is to reduce digital noise and ensure cleaner communication channels.
