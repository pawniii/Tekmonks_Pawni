# Project Report: Spam Classification Service

## 1. Data & Lightweight EDA

* **Dataset:** The "SMS Spam Collection" dataset was used (5572 rows).
* **Preprocessing Plan:**
    1.  **Normalization:** All text converted to lowercase.
    2.  **Noise Removal:** All non-alphanumeric characters (punctuation, symbols) removed.
    3.  **Tokenization:** Text split into an array of words (tokens).
    4.  **Stop-word Removal:** A minimal list of common English stop-words (e.g., 'a', 'the', 'is') was filtered out.
* **EDA Highlights:**
    1.  **Class Imbalance:** The dataset is highly imbalanced. **86.6%** of messages are "ham" (normal) and only **13.4%** are "spam".
    2.  **Message Length:** "Spam" messages are, on average, significantly longer than "ham" messages.

## 2. Modeling Choices

* **Model A (From Scratch):** `countingWordsSorter.js`
    A from-scratch implementation of Multinomial Naive Bayes with Laplace (add-one) smoothing, as required.

* **Model B (Library Baseline):** `baselineSorter.js`
    * **Model:** `natural.BayesClassifier`.
    * **Justification:** This classifier was chosen for its stability, speed, and simplicity. The alternative, `ml-logistic-regression`, presented significant dependency conflicts and data-shaping challenges (sparse vs. dense arrays) that were unviable for this exercise. The `BayesClassifier` provides a fast, reliable, and compliant baseline.

## 3. Training & Evaluation

* **Training (CV Summary):** A simple **80/20 train/test split** was used. A 5-fold cross-validation was skipped to prioritize getting the end-to-end pipeline working.
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
* **Top 10 Spam Tokens (by Spam/Ham Ratio):**
    *(These are the words from the training set with the highest ratio of spam occurrences to ham occurrences.)*
    1.  claim (Score: 90.00)
    2.  prize (Score: 75.00)
    3.  tone (Score: 39.00)
    4.  guaranteed (Score: 38.00)
    5.  500 (Score: 38.00)
    6.  18 (Score: 36.00)
    7.  150 (Score: 34.00)
    8.  1000 (Score: 33.00)
    9.  100 (Score: 31.00)
    *(Note: Token #3 was missing from the log output)*

* **Misclassified Examples (Selected):**
    1.  **Guessed: "spam", Actual: "ham"**
        * **Text:** "Die... I accidentally deleted e msg i suppose 2 put in e sim archive. ..."
        * **Hypothesis:** The model is "underfitting." It sees words like "msg" or "sim" (which are common in spam) and flags the message, failing to understand the normal context.
    2.  **Guessed: "spam", Actual: "ham"**
        * **Text:** "Ranjith cal drpd Deeraj and deepak 5min hold..."
        * **Hypothesis:** The word "cal" (call) is a very strong spam indicator, causing the model to misclassify this message.
    3.  **Guessed: "spam", Actual: "ham"**
        * **Text:** "\CHEERS FOR CALLIN BABE.SOZI CULDNT TALKBUT I WANNATELL U DETAILS LATE..."
        * **Hypothesis:** Again, "CALLIN" (call) and "BABE" are likely seen as spam tokens, overriding the normal context.
    4.  **Guessed: "spam", Actual: "ham"**
        * **Text:** "Oh :-)only 4 outside players allowed to play know..."
        * **Hypothesis:** The token "4" is often associated with spam (e.g., "call 4 free"). The model cannot tell the difference.
    5.  **Guessed: "spam", Actual: "ham"**
        * **Text:** "No..its ful of song lyrics....."
        * **Hypothesis:** This is a clear model failure; the tokens "ful" and "song" are likely noise that confused the classifier.

## 4. Key Takeaways & Limitations

* **Analysis:** The model has **perfect Recall (100.00%)** but **very low Precision (45.89%)**. This means it successfully **found every single spam message** but, in doing so, **incorrectly flagged 171 normal ("ham") messages as spam**.
* **Conclusion:** This is a **bad trade-off** for a real product, as it would block many legitimate user messages. The model is too aggressive and simple.
* **Limitations:**
    1.  A more sophisticated model (like Logistic Regression) is needed to improve precision.
    2.  The `natural.BayesClassifier` does not provide probability scores, so `null` is returned in the API.

---
