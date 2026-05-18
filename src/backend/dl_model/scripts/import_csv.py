import os

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Load CSV
df = pd.read_csv("rake_fitness_dataset.csv")

# Rename Label → label_text
if "Label" in df.columns:
    df = df.rename(columns={"Label": "label_text"})

# Create numeric label column
df["label"] = df["label_text"].str.strip().str.lower().map({"fit": 1, "unfit": 0})

# Drop id if present so DB auto-increments
if "id" in df.columns:
    df = df.drop(columns=["id"])

# 🔑 Normalize all column names to lowercase
df.columns = [c.lower() for c in df.columns]

# Insert into dl_inputs
df.to_sql("dl_inputs", engine, if_exists="append", index=False)

print("✅ Data imported into dl_inputs with label_text + numeric label")
