"""
migrate_to_mongo.py
───────────────────
Migrates all local JSON file data into MongoDB Atlas.
Run once from your backend/ directory:
    python migrate_to_mongo.py
"""

import asyncio
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# ── Load .env ──────────────────────────────────────────
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ.get("DB_NAME", "gm_bastralaya")
DATA_DIR = Path(os.environ.get("DATA_DIR", str(ROOT_DIR / "data")))

# ── File → Collection mapping ──────────────────────────
FILES = {
    "userlogs.json": "users",
    "products.json": "products",
    "categories.json": "categories",
    "inventory.json": "inventory",
    "discounts.json": "discounts",
    "images.json": "product_images",
    "whatsapp.json": "whatsapp_numbers",
    "enquiries.json": "enquiries",
    "audit_logs.json": "audit_logs",
    "feedback.json": "feedback",
}


def read_json(path: Path) -> list:
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception as e:
        print(f"  ⚠️  Could not read {path.name}: {e}")
        return []


async def migrate():
    print(f"\n🔗 Connecting to MongoDB: {DB_NAME}")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    total_inserted = 0

    for filename, collection_name in FILES.items():
        path = DATA_DIR / filename
        docs = read_json(path)

        if not docs:
            print(f"  ⏭️  {filename} — empty or missing, skipping")
            continue

        col = db[collection_name]

        # Remove _id field if present to avoid conflicts
        clean_docs = []
        for d in docs:
            d_copy = dict(d)
            d_copy.pop("_id", None)
            clean_docs.append(d_copy)

        # Check how many already exist (by id field)
        existing_ids = set()
        async for doc in col.find({}, {"id": 1}):
            if "id" in doc:
                existing_ids.add(doc["id"])

        # Only insert docs not already in MongoDB
        new_docs = [d for d in clean_docs if d.get("id") not in existing_ids]

        if not new_docs:
            print(
                f"  ✅ {filename} → {collection_name}: already migrated ({len(docs)} docs)"
            )
            continue

        result = await col.insert_many(new_docs)
        total_inserted += len(result.inserted_ids)
        print(
            f"  ✅ {filename} → {collection_name}: inserted {len(result.inserted_ids)} docs "
            f"(skipped {len(docs) - len(new_docs)} duplicates)"
        )

    print(f"\n🎉 Migration complete! Total inserted: {total_inserted}")
    print(f"   Database: {DB_NAME}")
    print(f"   Refresh MongoDB Atlas to see your data.\n")
    client.close()


if __name__ == "__main__":
    asyncio.run(migrate())
