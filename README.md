# TruthLens AI

TruthLens AI is a local web application for screening news articles with a machine-learning text classifier. It provides a React dashboard where users can sign in to a demo workspace, paste article text, and view a predicted label with a confidence score and simple explanation.

> **Important:** This is a writing-pattern classifier, not a factual verification service. It does not search the web, assess sources, or prove whether claims are true.

## Features

- Responsive login page and analyst dashboard
- Client-side demo sign-in flow
- News-text analysis through a Flask API
- Recent-analysis history for the current browser session
- TF-IDF text features and a Random Forest classifier

## Project structure

```text
TruthLens-AI/
|-- frontend/              # React + Vite dashboard
|-- backend/
|   |-- app.py             # Flask API
|   |-- train_model.py     # Model training script
|   |-- model.pkl          # Saved Random Forest model
|   |-- vectorizer.pkl     # Saved TF-IDF vectorizer
|   |-- Fake.csv           # Training data labelled fake
|   `-- True.csv           # Training data labelled real
`-- Project_Details.md     # Original project overview
```

## Requirements

- Node.js 20 or later
- Python 3.11 recommended

The saved model was trained with `scikit-learn==1.5.2`. Use Python 3.11 and the pinned backend requirements for the most compatible local environment.

## Run locally

Open two terminals from the repository root.

### 1. Start the backend

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd backend
python app.py
```

The API starts at `http://127.0.0.1:7860`.

### 2. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://127.0.0.1:5173`.

## API

### `POST /predict`

Request body:

```json
{
  "text": "Full news article text goes here."
}
```

Response shape:

```json
{
  "label": "Real News",
  "confidence": 94.33,
  "reason": ["Matches real news writing style"]
}
```

## How the model works

`backend/train_model.py` combines each dataset row's title and article text, creates TF-IDF word and word-pair features, then trains a 300-tree Random Forest classifier.

The model is most useful with long, article-style input similar to the training data. Short paragraphs, headlines, newly written summaries, and articles from unfamiliar sources can produce false positives or false negatives. Treat the result as a screening signal only and verify important claims with reliable sources.

## Development checks

```powershell
npm run lint --prefix frontend
npm run build --prefix frontend
```

## Current limitations

- Login is a front-end demo; there is no authentication database or user management.
- The frontend API URL is currently fixed to `http://localhost:7860/predict`.
- The model does not support image/video deepfake detection.
- The displayed explanation uses simple heuristics and is not a true model explanation.
- The classifier should not be used as the sole basis for factual, legal, medical, financial, or safety decisions.
