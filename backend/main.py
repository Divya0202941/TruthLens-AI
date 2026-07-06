from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class News(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "TruthGuard Backend Running"}

@app.post("/check")
def check_news(news: News):
    text = news.text.lower()

    if "shocking" in text or "breaking" in text:
        return {"prediction": "FAKE NEWS"}
    else:
        return {"prediction": "REAL NEWS"}