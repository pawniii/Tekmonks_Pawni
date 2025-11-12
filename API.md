# Spam Sorter API

## Health Check

Checks if the service is running.

* **Endpoint:** `GET /health`
* **Response (200):**
```json
{
  "status": "ok",
  "model": "BayesClassifier (natural) is running!"
}
Predict Messages
Classifies one or more messages as spam or ham.

Endpoint: POST /predict

Request Body (JSON):

JSON

{
  "messages": [
    "hello, are we still on for 7pm?",
    "CONGRATS! You won a FREE entry!"
  ]
}
Response (200):

JSON

{
  "predictions": [
    {
      "label": "ham",
      "score": null
    },
    {
      "label": "spam",
      "score": null
    }
  ]
}
Error Response (400 - Bad Input):

JSON

{
  "error": "Your request is wrong. Send {\"messages\": [...] }"
}
