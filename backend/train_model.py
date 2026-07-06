import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load datasets
fake = pd.read_csv("Fake.csv")
true = pd.read_csv("True.csv")

# Labels
fake["label"] = 0   # Fake
true["label"] = 1   # Real

# Combine datasets
df = pd.concat([fake, true], ignore_index=True)

# Combine title + text
df["content"] = (
    df["title"].fillna("") + " " + df["text"].fillna("")
)

# Shuffle
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Features & labels
X = df["content"]
y = df["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Vectorizer
vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1,2),
    max_features=15000,
    min_df=3
)
# Transform
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train_vec, y_train)

# Accuracy
print("Accuracy:", model.score(X_test_vec, y_test))

# Save
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("✅ Model and Vectorizer saved!")