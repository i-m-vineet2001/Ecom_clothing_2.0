# from fastapi import (
#     FastAPI,
#     APIRouter,
#     HTTPException,
#     Depends,
#     Query,
#     UploadFile,
#     File,
#     Form,
# )
# from fastapi.staticfiles import StaticFiles
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from dotenv import load_dotenv
# from starlette.middleware.cors import CORSMiddleware
# import os, json, logging
# from pathlib import Path
# from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
# from typing import List, Optional
# import uuid
# from datetime import datetime, timezone, timedelta
# import bcrypt
# from jose import jwt, JWTError
# import phonenumbers
# from phonenumbers import NumberParseException

# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / ".env")
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # ══════════════════════════════════════════════════════
# # MONGODB — commented out, restore when ready
# # ══════════════════════════════════════════════════════
# # from motor.motor_asyncio import AsyncIOMotorClient
# # mongo_url = os.environ["MONGO_URL"]
# # client = AsyncIOMotorClient(mongo_url)
# # db = client[os.environ["DB_NAME"]]
# # Indexes to restore in startup():
# #   await db.users.create_index("email", unique=True)
# #   await db.products.create_index("sku", unique=True)
# #   await db.products.create_index("category_id")
# #   await db.product_images.create_index("product_id")
# #   await db.inventory.create_index("product_id")
# #   await db.discounts.create_index("product_id")
# #   await db.enquiries.create_index("product_id")
# #   await db.audit_logs.create_index("entity_id")
# #   await db.audit_logs.create_index("timestamp")

# # ══════════════════════════════════════════════════════
# # FILE-BASED STORAGE
# # ══════════════════════════════════════════════════════
# DATA_DIR = ROOT_DIR / "data"
# UPLOADS_DIR = ROOT_DIR / "uploads"
# DATA_DIR.mkdir(exist_ok=True)
# UPLOADS_DIR.mkdir(exist_ok=True)

# # userlogs.json stores users as a standard JSON array
# USERS_FILE = DATA_DIR / "userlogs.json"
# PRODUCTS_FILE = DATA_DIR / "products.json"
# CATEGORIES_FILE = DATA_DIR / "categories.json"
# INVENTORY_FILE = DATA_DIR / "inventory.json"
# DISCOUNTS_FILE = DATA_DIR / "discounts.json"
# IMAGES_FILE = DATA_DIR / "images.json"
# WHATSAPP_FILE = DATA_DIR / "whatsapp.json"
# ENQUIRIES_FILE = DATA_DIR / "enquiries.json"
# AUDIT_FILE = DATA_DIR / "audit_logs.json"
# FEEDBACK_FILE = DATA_DIR / "feedback.json"

# # ── Generic JSON helpers ──────────────────────────────
# def _read(path: Path) -> list:
#     if not path.exists():
#         return []
#     try:
#         return json.loads(path.read_text(encoding="utf-8"))
#     except:
#         return []


# def _write(path: Path, data: list) -> None:
#     path.write_text(json.dumps(data, default=str, indent=2), encoding="utf-8")


# def _find_one(path: Path, query: dict) -> Optional[dict]:
#     for item in _read(path):
#         if all(item.get(k) == v for k, v in query.items()):
#             return item
#     return None


# def _insert(path: Path, doc: dict) -> dict:
#     items = _read(path)
#     items.append(doc)
#     _write(path, items)
#     return doc


# def _update_one(path: Path, query: dict, updates: dict) -> Optional[dict]:
#     items = _read(path)
#     for i, item in enumerate(items):
#         if all(item.get(k) == v for k, v in query.items()):
#             items[i] = {**item, **updates}
#             _write(path, items)
#             return items[i]
#     return None


# def _update_many(path: Path, query: dict, updates: dict) -> int:
#     items = _read(path)
#     count = 0
#     for i, item in enumerate(items):
#         if all(item.get(k) == v for k, v in query.items()):
#             items[i] = {**item, **updates}
#             count += 1
#     if count:
#         _write(path, items)
#     return count


# def _delete_one(path: Path, query: dict) -> bool:
#     items = _read(path)
#     for i, item in enumerate(items):
#         if all(item.get(k) == v for k, v in query.items()):
#             items.pop(i)
#             _write(path, items)
#             return True
#     return False


# def _delete_many(path: Path, query: dict) -> int:
#     items = _read(path)
#     kept = [i for i in items if not all(i.get(k) == v for k, v in query.items())]
#     count = len(items) - len(kept)
#     if count:
#         _write(path, kept)
#     return count


# # ── userlogs.json helpers (standard JSON array) ───────
# def _read_users() -> list:
#     """Read userlogs.json - stored as a standard JSON array."""
#     if not USERS_FILE.exists():
#         return []
#     try:
#         data = json.loads(USERS_FILE.read_text(encoding="utf-8"))
#         return data if isinstance(data, list) else []
#     except:
#         return []


# def _write_users(users: list) -> None:
#     """Write users to userlogs.json as a pretty-printed JSON array."""
#     USERS_FILE.write_text(json.dumps(users, default=str, indent=2), encoding="utf-8")


# def _upsert_user(user_doc: dict) -> None:
#     users = [u for u in _read_users() if u.get("id") != user_doc.get("id")]
#     users.append(user_doc)
#     _write_users(users)


# # ── JWT ───────────────────────────────────────────────
# SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-me-in-production")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# security = HTTPBearer()
# app = FastAPI(title="GM Bastralaya Fashion Catalog API")
# api_router = APIRouter(prefix="/api")
# app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


# # ══════════════════════════════════════════════════════
# # MODELS
# # ══════════════════════════════════════════════════════
# class User(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     name: str
#     email: EmailStr
#     role: str = "viewer"
#     password_hash: str
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# class UserCreate(BaseModel):
#     name: str
#     email: EmailStr
#     password: str
#     role: str = "viewer"


# class UserResponse(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str
#     name: str
#     email: str
#     role: str
#     created_at: datetime


# class LoginRequest(BaseModel):
#     email: EmailStr
#     password: str


# class TokenResponse(BaseModel):
#     access_token: str
#     token_type: str = "bearer"
#     user: UserResponse


# class Category(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     name: str
#     description: Optional[str] = ""
#     image_url: Optional[str] = ""
#     slug: Optional[str] = ""
#     parent_id: Optional[str] = None
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# class CategoryCreate(BaseModel):
#     name: str
#     description: Optional[str] = ""
#     image_url: Optional[str] = ""
#     slug: Optional[str] = None
#     parent_id: Optional[str] = None


# class CategoryUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     image_url: Optional[str] = None
#     slug: Optional[str] = None
#     parent_id: Optional[str] = None


# class CategoryResponse(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str
#     name: str
#     description: Optional[str] = ""
#     image_url: Optional[str] = ""
#     slug: Optional[str] = ""
#     parent_id: Optional[str] = None
#     created_at: datetime


# class WhatsappNumber(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     owner_scope: str = "store"
#     e164_number: str
#     product_id: Optional[str] = None
#     is_default: bool = False
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

#     @field_validator("e164_number")
#     @classmethod
#     def validate_phone(cls, v: str) -> str:
#         try:
#             parsed = phonenumbers.parse(v, None)
#             if not phonenumbers.is_valid_number(parsed):
#                 raise ValueError("Invalid phone number")
#             return phonenumbers.format_number(
#                 parsed, phonenumbers.PhoneNumberFormat.E164
#             )
#         except NumberParseException:
#             raise ValueError("Invalid phone number format")


# class WhatsappNumberCreate(BaseModel):
#     e164_number: str
#     is_default: bool = False
#     owner_scope: str = "store"
#     product_id: Optional[str] = None


# class WhatsappNumberUpdate(BaseModel):
#     e164_number: Optional[str] = None
#     is_default: Optional[bool] = None
#     owner_scope: Optional[str] = None
#     product_id: Optional[str] = None


# class ProductImage(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     product_id: str
#     url: str
#     alt: str = ""
#     sort_order: int = 0


# class ProductImageCreate(BaseModel):
#     url: str
#     alt: str = ""
#     sort_order: int = 0


# class Inventory(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     product_id: str
#     variant: Optional[dict] = None
#     quantity: int = 0


# class InventoryUpdate(BaseModel):
#     quantity: int
#     variant: Optional[dict] = None


# class Discount(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     product_id: str
#     type: str = "percentage"
#     value: float
#     starts_at: Optional[datetime] = None
#     ends_at: Optional[datetime] = None
#     active: bool = True
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# class DiscountCreate(BaseModel):
#     type: str = "percentage"
#     value: float
#     active: bool = True
#     starts_at: Optional[datetime] = None
#     ends_at: Optional[datetime] = None


# class DiscountUpdate(BaseModel):
#     type: Optional[str] = None
#     value: Optional[float] = None
#     active: Optional[bool] = None
#     starts_at: Optional[datetime] = None
#     ends_at: Optional[datetime] = None


# class Product(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     title: str
#     description: str = ""
#     base_price: float
#     active: bool = True
#     sku: str
#     category_id: Optional[str] = None
#     default_whatsapp_number_id: Optional[str] = None
#     created_by: str
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
#     updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# class ProductCreate(BaseModel):
#     title: str
#     description: str = ""
#     base_price: float
#     active: bool = True
#     sku: str
#     category_id: Optional[str] = None
#     default_whatsapp_number_id: Optional[str] = None


# class ProductUpdate(BaseModel):
#     title: Optional[str] = None
#     description: Optional[str] = None
#     base_price: Optional[float] = None
#     active: Optional[bool] = None
#     sku: Optional[str] = None
#     category_id: Optional[str] = None
#     default_whatsapp_number_id: Optional[str] = None


# class ProductWithDetails(Product):
#     images: List[ProductImage] = Field(default_factory=list)
#     inventory: Optional[Inventory] = None
#     discount: Optional[Discount] = None
#     final_price: float
#     whatsapp_number: Optional[WhatsappNumber] = None


# class EnquiryLog(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     product_id: str
#     e164_number: str
#     message_preview: str
#     source_url: str
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# class EnquiryLogCreate(BaseModel):
#     product_id: str
#     e164_number: str
#     message_preview: str
#     source_url: str


# class AuditLog(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     user_id: str
#     action: str
#     entity_type: str
#     entity_id: str
#     before: Optional[dict] = None
#     after: Optional[dict] = None
#     timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class Feedback(BaseModel):
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     name: str
#     email: Optional[EmailStr] = None
#     rating: int
#     message: str
#     page_url: str
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
#     is_read: bool = False


# class FeedbackCreate(BaseModel):
#     name: str
#     email: Optional[EmailStr] = None
#     rating: int
#     message: str
#     page_url: str
# # ══════════════════════════════════════════════════════
# # AUTH HELPERS
# # ══════════════════════════════════════════════════════
# def hash_password(p: str) -> str:
#     return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


# def verify_password(plain: str, hashed: str) -> bool:
#     return bcrypt.checkpw(plain.encode(), hashed.encode())


# def create_access_token(data: dict) -> str:
#     payload = {
#         **data,
#         "exp": datetime.now(timezone.utc)
#         + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
#     }
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# async def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(security),
# ) -> User:
#     try:
#         payload = jwt.decode(
#             credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
#         )
#         user_id = payload.get("sub")
#         if not user_id:
#             raise HTTPException(status_code=401, detail="Invalid authentication")
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")
#     for u in _read_users():
#         if u.get("id") == user_id:
#             return User(**u)
#     raise HTTPException(status_code=401, detail="User not found")


# def require_role(roles: List[str]):
#     async def checker(current_user: User = Depends(get_current_user)) -> User:
#         if current_user.role not in roles:
#             raise HTTPException(status_code=403, detail="Insufficient permissions")
#         return current_user

#     return checker


# def log_audit(user_id, action, entity_type, entity_id, before=None, after=None):
#     _insert(
#         AUDIT_FILE,
#         AuditLog(
#             user_id=user_id,
#             action=action,
#             entity_type=entity_type,
#             entity_id=entity_id,
#             before=before,
#             after=after,
#         ).model_dump(),
#     )


# def make_slug(name: str) -> str:
#     import re

#     return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


# def enrich_product(p: dict) -> ProductWithDetails:
#     product = Product(**p)
#     now = datetime.now(timezone.utc)
#     images = sorted(
#         [i for i in _read(IMAGES_FILE) if i.get("product_id") == product.id],
#         key=lambda x: x.get("sort_order", 0),
#     )
#     inv_doc = _find_one(INVENTORY_FILE, {"product_id": product.id})
#     inventory = (
#         Inventory(**inv_doc)
#         if inv_doc
#         else Inventory(product_id=product.id, quantity=0)
#     )
#     discount = None
#     for d in _read(DISCOUNTS_FILE):
#         if d.get("product_id") != product.id or not d.get("active"):
#             continue

#         def _dt(v):
#             if v is None:
#                 return None
#             dt = datetime.fromisoformat(str(v))
#             return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

#         s, e = _dt(d.get("starts_at")), _dt(d.get("ends_at"))
#         if (s is None or s <= now) and (e is None or e >= now):
#             discount = Discount(**d)
#             break
#     final_price = product.base_price
#     if discount:
#         final_price = (
#             product.base_price * (1 - discount.value / 100)
#             if discount.type == "percentage"
#             else max(0.0, product.base_price - discount.value)
#         )
#     wa_doc = None
#     if product.default_whatsapp_number_id:
#         wa_doc = _find_one(WHATSAPP_FILE, {"id": product.default_whatsapp_number_id})
#     if not wa_doc:
#         wa_doc = next(
#             (
#                 w
#                 for w in _read(WHATSAPP_FILE)
#                 if w.get("is_default") and w.get("owner_scope") == "store"
#             ),
#             None,
#         )
#     return ProductWithDetails(
#         **product.model_dump(),
#         images=[ProductImage(**i) for i in images],
#         inventory=inventory,
#         discount=discount,
#         final_price=final_price,
#         whatsapp_number=WhatsappNumber(**wa_doc) if wa_doc else None,
#     )


# # ══════════════════════════════════════════════════════
# # AUTH ROUTES
# # ══════════════════════════════════════════════════════
# @api_router.post("/auth/register", response_model=UserResponse)
# async def register(payload: UserCreate):
#     if any(u.get("email") == payload.email for u in _read_users()):
#         raise HTTPException(400, "Email already registered")
#     user = User(
#         name=payload.name,
#         email=payload.email,
#         role=payload.role,
#         password_hash=hash_password(payload.password),
#     )
#     _upsert_user(user.model_dump())
#     logger.info(f"[AUTH] Registered {user.email} role={user.role}")
#     return UserResponse(**user.model_dump())


# @api_router.post("/auth/login", response_model=TokenResponse)
# async def login(payload: LoginRequest):
#     doc = next((u for u in _read_users() if u.get("email") == payload.email), None)
#     if not doc or not verify_password(payload.password, doc["password_hash"]):
#         raise HTTPException(401, "Invalid credentials")
#     user = User(**doc)
#     logger.info(f"[AUTH] Login {user.email} role={user.role}")
#     return TokenResponse(
#         access_token=create_access_token({"sub": user.id}),
#         user=UserResponse(**user.model_dump()),
#     )


# @api_router.get("/auth/me", response_model=UserResponse)
# async def get_me(current_user: User = Depends(get_current_user)):
#     return UserResponse(**current_user.model_dump())


# # ══════════════════════════════════════════════════════
# # CATEGORIES
# # ══════════════════════════════════════════════════════
# @api_router.get("/categories", response_model=List[CategoryResponse])
# async def get_categories():
#     return [CategoryResponse(**c) for c in _read(CATEGORIES_FILE)]


# @api_router.get("/categories/{category_id}", response_model=CategoryResponse)
# async def get_category(category_id: str):
#     doc = _find_one(CATEGORIES_FILE, {"id": category_id})
#     if not doc:
#         raise HTTPException(404, "Category not found")
#     return CategoryResponse(**doc)


# @api_router.post("/categories", response_model=CategoryResponse)
# async def create_category(
#     payload: CategoryCreate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     slug = payload.slug or make_slug(payload.name)
#     if _find_one(CATEGORIES_FILE, {"slug": slug}):
#         slug = f"{slug}-{uuid.uuid4().hex[:6]}"
#     cat = Category(
#         name=payload.name,
#         description=payload.description or "",
#         image_url=payload.image_url or "",
#         slug=slug,
#         parent_id=payload.parent_id,
#     )
#     _insert(CATEGORIES_FILE, cat.model_dump())
#     log_audit(current_user.id, "create", "category", cat.id, after=cat.model_dump())
#     return CategoryResponse(**cat.model_dump())


# @api_router.put("/categories/{category_id}", response_model=CategoryResponse)
# async def update_category(
#     category_id: str,
#     payload: CategoryUpdate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     doc = _find_one(CATEGORIES_FILE, {"id": category_id})
#     if not doc:
#         raise HTTPException(404, "Category not found")
#     updates = payload.model_dump(exclude_none=True)
#     if "name" in updates and "slug" not in updates:
#         updates["slug"] = make_slug(updates["name"])
#     updated = _update_one(CATEGORIES_FILE, {"id": category_id}, updates)
#     log_audit(
#         current_user.id, "update", "category", category_id, before=doc, after=updated
#     )
#     return CategoryResponse(**updated)


# @api_router.delete("/categories/{category_id}")
# async def delete_category(
#     category_id: str, current_user: User = Depends(require_role(["admin", "shopowner"]))
# ):
#     doc = _find_one(CATEGORIES_FILE, {"id": category_id})
#     if not doc:
#         raise HTTPException(404, "Category not found")
#     _delete_one(CATEGORIES_FILE, {"id": category_id})
#     prods = _read(PRODUCTS_FILE)
#     changed = False
#     for i, p in enumerate(prods):
#         if p.get("category_id") == category_id:
#             prods[i]["category_id"] = None
#             changed = True
#     if changed:
#         _write(PRODUCTS_FILE, prods)
#     log_audit(current_user.id, "delete", "category", category_id, before=doc)
#     return {"message": "Category deleted"}


# @api_router.post(
#     "/categories/{category_id}/image/upload", response_model=CategoryResponse
# )
# async def upload_category_image(
#     category_id: str,
#     file: UploadFile = File(...),
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     doc = _find_one(CATEGORIES_FILE, {"id": category_id})
#     if not doc:
#         raise HTTPException(404, "Category not found")
#     if file.content_type not in ALLOWED_IMAGE_TYPES:
#         raise HTTPException(400, "Unsupported type. Use JPEG/PNG/WebP/GIF.")
#     contents = await file.read()
#     if len(contents) > MAX_IMAGE_BYTES:
#         raise HTTPException(400, "File too large (max 10MB)")
#     upload_result = cloudinary.uploader.upload(
#         contents,
#         folder="gm_bastralaya/categories",
#         public_id=f"cat_{category_id}_{__import__('uuid').uuid4().hex[:8]}",
#     )
#     image_url = upload_result.get("secure_url")
#     updated = _update_one(
#         CATEGORIES_FILE, {"id": category_id}, {"image_url": image_url}
#     )
#     log_audit(
#         current_user.id,
#         "update",
#         "category",
#         category_id,
#         before=doc,
#         after={"image_url": image_url},
#     )
#     return CategoryResponse(**updated)


# # ══════════════════════════════════════════════════════
# # PRODUCTS
# # ══════════════════════════════════════════════════════
# @api_router.get("/products", response_model=List[ProductWithDetails])
# async def get_products(
#     category_id: Optional[str] = None,
#     search: Optional[str] = None,
#     min_price: Optional[float] = None,
#     max_price: Optional[float] = None,
#     sort_by: str = "created_at",
#     sort_order: str = "desc",
#     limit: int = Query(default=50, le=500),
#     skip: int = 0,
#     include_inactive: bool = False,
# ):
#     # Public store: only active. Dashboard (include_inactive=true): all products
#     all_products = _read(PRODUCTS_FILE)
#     products = (
#         all_products
#         if include_inactive
#         else [p for p in all_products if p.get("active", True)]
#     )
#     if category_id:
#         products = [p for p in products if p.get("category_id") == category_id]
#     if search:
#         s = search.lower()
#         products = [
#             p
#             for p in products
#             if s in p.get("title", "").lower()
#             or s in p.get("description", "").lower()
#             or s in p.get("sku", "").lower()
#         ]
#     if min_price is not None:
#         products = [p for p in products if p.get("base_price", 0) >= min_price]
#     if max_price is not None:
#         products = [p for p in products if p.get("base_price", 0) <= max_price]
#     products.sort(key=lambda x: x.get(sort_by, ""), reverse=(sort_order == "desc"))
#     return [enrich_product(p) for p in products[skip : skip + limit]]


# @api_router.get("/products/{product_id}", response_model=ProductWithDetails)
# async def get_product(product_id: str):
#     doc = _find_one(PRODUCTS_FILE, {"id": product_id})
#     if not doc:
#         raise HTTPException(404, "Product not found")
#     return enrich_product(doc)


# @api_router.post("/products", response_model=ProductWithDetails)
# async def create_product(
#     payload: ProductCreate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if _find_one(PRODUCTS_FILE, {"sku": payload.sku}):
#         raise HTTPException(400, "SKU already exists")
#     product = Product(**payload.model_dump(), created_by=current_user.id)
#     _insert(PRODUCTS_FILE, product.model_dump())
#     _insert(INVENTORY_FILE, Inventory(product_id=product.id).model_dump())
#     log_audit(
#         current_user.id, "create", "product", product.id, after=product.model_dump()
#     )
#     return enrich_product(product.model_dump())


# @api_router.put("/products/{product_id}", response_model=ProductWithDetails)
# async def update_product(
#     product_id: str,
#     payload: ProductUpdate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     doc = _find_one(PRODUCTS_FILE, {"id": product_id})
#     if not doc:
#         raise HTTPException(404, "Product not found")
#     updates = payload.model_dump(exclude_none=True)
#     updates["updated_at"] = datetime.now(timezone.utc).isoformat()
#     if "sku" in updates and updates["sku"] != doc.get("sku"):
#         if _find_one(PRODUCTS_FILE, {"sku": updates["sku"]}):
#             raise HTTPException(400, "SKU already exists")
#     updated = _update_one(PRODUCTS_FILE, {"id": product_id}, updates)
#     log_audit(
#         current_user.id, "update", "product", product_id, before=doc, after=updated
#     )
#     return enrich_product(updated)


# @api_router.delete("/products/{product_id}")
# async def delete_product(
#     product_id: str, current_user: User = Depends(require_role(["admin", "shopowner"]))
# ):
#     doc = _find_one(PRODUCTS_FILE, {"id": product_id})
#     if not doc:
#         raise HTTPException(404, "Product not found")
#     _delete_one(PRODUCTS_FILE, {"id": product_id})
#     _delete_many(IMAGES_FILE, {"product_id": product_id})
#     _delete_many(INVENTORY_FILE, {"product_id": product_id})
#     _delete_many(DISCOUNTS_FILE, {"product_id": product_id})
#     # Delete uploaded image files from disk
#     for img in _read(IMAGES_FILE):
#         if img.get("product_id") == product_id and "/uploads/" in img.get("url", ""):
#             fpath = UPLOADS_DIR / img["url"].split("/uploads/")[-1]
#             if fpath.exists():
#                 fpath.unlink()
#     log_audit(current_user.id, "delete", "product", product_id, before=doc)
#     return {"message": "Product deleted"}


# # ══════════════════════════════════════════════════════
# # PRODUCT IMAGES
# # ══════════════════════════════════════════════════════
# ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
# MAX_IMAGE_BYTES = 10 * 1024 * 1024


# @api_router.get("/products/{product_id}/images", response_model=List[ProductImage])
# async def get_product_images(product_id: str):
#     return [
#         ProductImage(**i)
#         for i in sorted(
#             [i for i in _read(IMAGES_FILE) if i.get("product_id") == product_id],
#             key=lambda x: x.get("sort_order", 0),
#         )
#     ]


# @api_router.post("/products/{product_id}/images/upload", response_model=ProductImage)
# async def upload_product_image(
#     product_id: str,
#     file: UploadFile = File(...),
#     alt: str = Form(default=""),
#     sort_order: int = Form(default=0),
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if not _find_one(PRODUCTS_FILE, {"id": product_id}):
#         raise HTTPException(404, "Product not found")
#     if file.content_type not in ALLOWED_IMAGE_TYPES:
#         raise HTTPException(400, f"Unsupported type. Use JPEG/PNG/WebP/GIF.")
#     contents = await file.read()
#     if len(contents) > MAX_IMAGE_BYTES:
#         raise HTTPException(400, "File too large (max 10MB)")
#     # Upload to Cloudinary instead of local disk
#     upload_result = cloudinary.uploader.upload(
#         contents,
#         folder="gm_bastralaya/products",
#         public_id=f"{product_id}_{uuid.uuid4().hex[:8]}",
#     )
#     url = upload_result.get("secure_url")
#     # Auto-assign sort_order based on existing image count
#     existing_count = len(
#         [i for i in _read(IMAGES_FILE) if i.get("product_id") == product_id]
#     )
#     image = ProductImage(
#         product_id=product_id,
#         url=url,
#         alt=alt or file.filename or "",
#         sort_order=existing_count,
#     )
#     _insert(IMAGES_FILE, image.model_dump())
#     log_audit(
#         current_user.id,
#         "create",
#         "product_image",
#         image.id,
#         after={"product_id": product_id, "url": url},
#     )
#     return image


# @api_router.post("/products/{product_id}/images", response_model=ProductImage)
# async def add_product_image_url(
#     product_id: str,
#     payload: ProductImageCreate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if not _find_one(PRODUCTS_FILE, {"id": product_id}):
#         raise HTTPException(404, "Product not found")
#     image = ProductImage(product_id=product_id, **payload.model_dump())
#     _insert(IMAGES_FILE, image.model_dump())
#     return image


# @api_router.delete("/products/{product_id}/images/{image_id}")
# async def delete_product_image(
#     product_id: str,
#     image_id: str,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     doc = _find_one(IMAGES_FILE, {"id": image_id, "product_id": product_id})
#     if not doc:
#         raise HTTPException(404, "Image not found")
#     url = doc.get("url", "")
#     if "/uploads/" in url:
#         fpath = UPLOADS_DIR / url.split("/uploads/")[-1]
#         if fpath.exists():
#             fpath.unlink()
#     _delete_one(IMAGES_FILE, {"id": image_id})
#     return {"message": "Image deleted"}


# # ══════════════════════════════════════════════════════
# # INVENTORY
# # ══════════════════════════════════════════════════════
# @api_router.get("/products/{product_id}/inventory", response_model=Inventory)
# async def get_inventory(product_id: str):
#     doc = _find_one(INVENTORY_FILE, {"product_id": product_id})
#     return Inventory(**doc) if doc else Inventory(product_id=product_id, quantity=0)


# @api_router.put("/products/{product_id}/inventory", response_model=Inventory)
# async def update_inventory(
#     product_id: str,
#     payload: InventoryUpdate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if not _find_one(PRODUCTS_FILE, {"id": product_id}):
#         raise HTTPException(404, "Product not found")
#     updates = payload.model_dump(exclude_none=True)
#     existing = _find_one(INVENTORY_FILE, {"product_id": product_id})
#     if existing:
#         updated = _update_one(INVENTORY_FILE, {"product_id": product_id}, updates)
#     else:
#         inv = Inventory(product_id=product_id, **updates)
#         _insert(INVENTORY_FILE, inv.model_dump())
#         updated = inv.model_dump()
#     return Inventory(**updated)


# # ══════════════════════════════════════════════════════
# # DISCOUNTS
# # ══════════════════════════════════════════════════════
# @api_router.get("/products/{product_id}/discounts", response_model=List[Discount])
# async def get_discounts(product_id: str):
#     return [
#         Discount(**d)
#         for d in _read(DISCOUNTS_FILE)
#         if d.get("product_id") == product_id
#     ]


# @api_router.post("/products/{product_id}/discounts", response_model=Discount)
# async def create_discount(
#     product_id: str,
#     payload: DiscountCreate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if not _find_one(PRODUCTS_FILE, {"id": product_id}):
#         raise HTTPException(404, "Product not found")
#     discount = Discount(product_id=product_id, **payload.model_dump())
#     _insert(DISCOUNTS_FILE, discount.model_dump())
#     log_audit(
#         current_user.id, "create", "discount", discount.id, after=discount.model_dump()
#     )
#     return discount


# @api_router.put(
#     "/products/{product_id}/discounts/{discount_id}", response_model=Discount
# )
# async def update_discount(
#     product_id: str,
#     discount_id: str,
#     payload: DiscountUpdate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     doc = _find_one(DISCOUNTS_FILE, {"id": discount_id, "product_id": product_id})
#     if not doc:
#         raise HTTPException(404, "Discount not found")
#     updated = _update_one(
#         DISCOUNTS_FILE, {"id": discount_id}, payload.model_dump(exclude_none=True)
#     )
#     return Discount(**updated)


# @api_router.delete("/products/{product_id}/discounts/{discount_id}")
# async def delete_discount(
#     product_id: str,
#     discount_id: str,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if not _delete_one(DISCOUNTS_FILE, {"id": discount_id, "product_id": product_id}):
#         raise HTTPException(404, "Discount not found")
#     return {"message": "Discount deleted"}


# # ══════════════════════════════════════════════════════
# # WHATSAPP
# # ══════════════════════════════════════════════════════
# @api_router.get("/whatsapp-numbers", response_model=List[WhatsappNumber])
# async def get_whatsapp_numbers(
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     return [WhatsappNumber(**d) for d in _read(WHATSAPP_FILE)]

# @api_router.get("/whatsapp-default", response_model=WhatsappNumber)
# async def get_default_whatsapp():
#     doc = next(
#         (
#             w
#             for w in _read(WHATSAPP_FILE)
#             if w.get("is_default") and w.get("owner_scope") == "store"
#         ),
#         None,
#     )

#     if not doc:
#         raise HTTPException(404, "Default WhatsApp not found")

#     return WhatsappNumber(**doc)

# @api_router.post("/whatsapp-numbers", response_model=WhatsappNumber)
# async def create_whatsapp_number(
#     payload: WhatsappNumberCreate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     if payload.is_default:
#         _update_many(
#             WHATSAPP_FILE, {"owner_scope": payload.owner_scope}, {"is_default": False}
#         )
#     wa = WhatsappNumber(**payload.model_dump())
#     _insert(WHATSAPP_FILE, wa.model_dump())
#     log_audit(
#         current_user.id, "create", "whatsapp_number", wa.id, after=wa.model_dump()
#     )
#     return wa


# @api_router.put("/whatsapp-numbers/{wa_id}", response_model=WhatsappNumber)
# async def update_whatsapp_number(
#     wa_id: str,
#     payload: WhatsappNumberUpdate,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     doc = _find_one(WHATSAPP_FILE, {"id": wa_id})
#     if not doc:
#         raise HTTPException(404, "WhatsApp number not found")
#     updates = payload.model_dump(exclude_none=True)
#     if updates.get("is_default"):
#         _update_many(
#             WHATSAPP_FILE,
#             {
#                 "owner_scope": updates.get(
#                     "owner_scope", doc.get("owner_scope", "store")
#                 )
#             },
#             {"is_default": False},
#         )
#     return WhatsappNumber(**_update_one(WHATSAPP_FILE, {"id": wa_id}, updates))


# @api_router.delete("/whatsapp-numbers/{wa_id}")
# async def delete_whatsapp_number(
#     wa_id: str, current_user: User = Depends(require_role(["admin", "shopowner"]))
# ):
#     if not _delete_one(WHATSAPP_FILE, {"id": wa_id}):
#         raise HTTPException(404, "WhatsApp number not found")
#     return {"message": "WhatsApp number deleted"}


# # ══════════════════════════════════════════════════════
# # ENQUIRIES
# # ══════════════════════════════════════════════════════
# @api_router.get("/enquiries", response_model=List[EnquiryLog])
# async def get_enquiries(
#     product_id: Optional[str] = None,
#     limit: int = Query(default=100, le=1000),
#     skip: int = 0,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     docs = _read(ENQUIRIES_FILE)
#     if product_id:
#         docs = [d for d in docs if d.get("product_id") == product_id]
#     docs = sorted(docs, key=lambda x: x.get("created_at", ""), reverse=True)
#     return [EnquiryLog(**d) for d in docs[skip : skip + limit]]


# @api_router.post("/enquiries", response_model=EnquiryLog)
# async def create_enquiry(payload: EnquiryLogCreate):
#     enquiry = EnquiryLog(**payload.model_dump())
#     _insert(ENQUIRIES_FILE, enquiry.model_dump())
#     return enquiry


# # ══════════════════════════════════════════════════════
# # USERS
# # ══════════════════════════════════════════════════════
# @api_router.get("/users", response_model=List[UserResponse])
# async def get_users(current_user: User = Depends(require_role(["admin"]))):
#     return [UserResponse(**u) for u in _read_users()]


# @api_router.post("/users", response_model=UserResponse)
# async def create_user(
#     payload: UserCreate, current_user: User = Depends(require_role(["admin"]))
# ):
#     if any(u.get("email") == payload.email for u in _read_users()):
#         raise HTTPException(400, "Email already registered")
#     user = User(
#         name=payload.name,
#         email=payload.email,
#         role=payload.role,
#         password_hash=hash_password(payload.password),
#     )
#     _upsert_user(user.model_dump())
#     log_audit(
#         current_user.id,
#         "create",
#         "user",
#         user.id,
#         after={"email": user.email, "role": user.role},
#     )
#     return UserResponse(**user.model_dump())


# @api_router.delete("/users/{user_id}")
# async def delete_user(
#     user_id: str, current_user: User = Depends(require_role(["admin"]))
# ):
#     if user_id == current_user.id:
#         raise HTTPException(400, "Cannot delete yourself")
#     users = _read_users()
#     new = [u for u in users if u.get("id") != user_id]
#     if len(new) == len(users):
#         raise HTTPException(404, "User not found")
#     _write_users(new)
#     log_audit(current_user.id, "delete", "user", user_id)
#     return {"message": "User deleted"}


# class RoleUpdate(BaseModel):
#     role: str  # admin | shopowner | viewer


# @api_router.patch("/users/{user_id}/role", response_model=UserResponse)
# async def update_user_role(
#     user_id: str,
#     payload: RoleUpdate,
#     current_user: User = Depends(require_role(["admin"])),
# ):
#     """Change a user's role. Admin only."""
#     valid_roles = {"admin", "shopowner", "viewer"}
#     if payload.role not in valid_roles:
#         raise HTTPException(
#             400, f"Invalid role. Must be one of: {', '.join(valid_roles)}"
#         )
#     users = _read_users()
#     target = next((u for u in users if u.get("id") == user_id), None)
#     if not target:
#         raise HTTPException(404, "User not found")
#     old_role = target.get("role")
#     for i, u in enumerate(users):
#         if u.get("id") == user_id:
#             users[i]["role"] = payload.role
#             target = users[i]
#             break
#     _write_users(users)
#     log_audit(
#         current_user.id,
#         "update",
#         "user",
#         user_id,
#         before={"role": old_role},
#         after={"role": payload.role},
#     )
#     return UserResponse(**target)

# # ══════════════════════════════════════════════════════
# # FEEDBACK
# # ══════════════════════════════════════════════════════


# @api_router.get("/feedback", response_model=List[Feedback])
# async def get_feedback(
#     limit: int = Query(default=100, le=1000),
#     skip: int = 0,
#     current_user: User = Depends(require_role(["admin", "shopowner"])),
# ):
#     docs = sorted(
#         _read(FEEDBACK_FILE), key=lambda x: x.get("created_at", ""), reverse=True
#     )
#     return [Feedback(**d) for d in docs[skip : skip + limit]]


# @api_router.post("/feedback", response_model=Feedback)
# async def create_feedback(payload: FeedbackCreate):
#     feedback = Feedback(**payload.model_dump())
#     _insert(FEEDBACK_FILE, feedback.model_dump())
#     return feedback


# @api_router.patch("/feedback/{feedback_id}/read", response_model=Feedback)
# async def mark_feedback_read(
#     feedback_id: str, current_user: User = Depends(require_role(["admin", "shopowner"]))
# ):
#     doc = _find_one(FEEDBACK_FILE, {"id": feedback_id})
#     if not doc:
#         raise HTTPException(404, "Feedback not found")

#     updated = _update_one(FEEDBACK_FILE, {"id": feedback_id}, {"is_read": True})
#     return Feedback(**updated)


# @api_router.delete("/feedback/{feedback_id}")
# async def delete_feedback(
#     feedback_id: str, current_user: User = Depends(require_role(["admin"]))
# ):
#     if not _delete_one(FEEDBACK_FILE, {"id": feedback_id}):
#         raise HTTPException(404, "Feedback not found")
#     return {"message": "Feedback deleted"}

# # ══════════════════════════════════════════════════════
# # AUDIT LOGS
# # ══════════════════════════════════════════════════════
# @api_router.get("/audit-logs", response_model=List[AuditLog])
# async def get_audit_logs(
#     entity_type: Optional[str] = None,
#     entity_id: Optional[str] = None,
#     limit: int = Query(default=100, le=500),
#     skip: int = 0,
#     current_user: User = Depends(require_role(["admin"])),
# ):
#     docs = _read(AUDIT_FILE)
#     if entity_type:
#         docs = [d for d in docs if d.get("entity_type") == entity_type]
#     if entity_id:
#         docs = [d for d in docs if d.get("entity_id") == entity_id]
#     docs = sorted(docs, key=lambda x: x.get("timestamp", ""), reverse=True)
#     return [AuditLog(**d) for d in docs[skip : skip + limit]]


# # ══════════════════════════════════════════════════════
# # INIT
# # ══════════════════════════════════════════════════════
# @api_router.post("/init")
# async def init_data():
#     """
#     Seeds default WhatsApp number only.
#     User accounts are managed via /auth/register.
#     Call this only on a fresh install.
#     """
#     created = []

#     if not _find_one(WHATSAPP_FILE, {"is_default": True}):
#         _insert(
#             WHATSAPP_FILE,
#             WhatsappNumber(
#                 e164_number="+919876543210", is_default=True, owner_scope="store"
#             ).model_dump(),
#         )
#         created.append("default WhatsApp +91-98765-43210")

#     users = _read_users()
#     return {
#         "message": "Initialisation complete",
#         "created": created or ["nothing new — already initialised"],
#         "total_users": len(users),
#         "users": [{"email": u.get("email"), "role": u.get("role")} for u in users],
#         "userlogs": str(USERS_FILE),
#         "data_dir": str(DATA_DIR),
#     }


# # ══════════════════════════════════════════════════════
# # APP SETUP
# # ══════════════════════════════════════════════════════
# app.include_router(api_router)
# app.add_middleware(
#     CORSMiddleware,
#     allow_credentials=True,
#     allow_origins=os.environ.get(
#         "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
#     ).split(","),
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.on_event("startup")
# async def startup():
#     # Ensure all JSON data files exist
#     for f in [
#         PRODUCTS_FILE,
#         CATEGORIES_FILE,
#         INVENTORY_FILE,
#         DISCOUNTS_FILE,
#         IMAGES_FILE,
#         WHATSAPP_FILE,
#         ENQUIRIES_FILE,
#         FEEDBACK_FILE,
#         AUDIT_FILE,
#     ]:
#         if not f.exists():
#             _write(f, [])

#     # ── Migrate userlogs.txt → userlogs.json ─────────────────────────────
#     old_txt = DATA_DIR / "userlogs.txt"
#     if old_txt.exists():
#         migrated = []
#         for line in old_txt.read_text(encoding="utf-8").splitlines():
#             line = line.strip()
#             if line and not line.startswith("#"):
#                 try:
#                     migrated.append(json.loads(line))
#                 except:
#                     pass
#         if migrated:
#             existing = _read_users()
#             existing_ids = {u.get("id") for u in existing}
#             for u in migrated:
#                 if u.get("id") not in existing_ids:
#                     existing.append(u)
#             _write_users(existing)
#             logger.info(
#                 f"Migrated {len(migrated)} users: userlogs.txt -> userlogs.json"
#             )
#         old_txt.rename(DATA_DIR / "userlogs.txt.bak")

#     if not USERS_FILE.exists():
#         _write_users([])

#     # ── Seed default WhatsApp if none exists ────────────────────────────
#     if not _find_one(WHATSAPP_FILE, {"is_default": True}):
#         _insert(
#             WHATSAPP_FILE,
#             WhatsappNumber(
#                 e164_number="+919876543210", is_default=True, owner_scope="store"
#             ).model_dump(),
#         )
#         logger.info("Auto-seeded: default WhatsApp +919876543210")

#     total_users = len(_read_users())
#     logger.info(
#         f"GM Bastralaya API started | users={total_users} data={DATA_DIR} uploads={UPLOADS_DIR}"
#     )


# @app.on_event("shutdown")
# async def shutdown():
#     logger.info("GM Bastralaya API shutting down.")


# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)















from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException,
    Depends,
    Query,
    UploadFile,
    File,
    Form,
)
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os, json, logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
from jose import jwt, JWTError
import phonenumbers
from phonenumbers import NumberParseException
import cloudinary
import cloudinary.uploader
import cloudinary.api

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ══════════════════════════════════════════════════════
# CLOUDINARY CONFIG
# ══════════════════════════════════════════════════════
_cld_cloud = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
_cld_key = os.environ.get("CLOUDINARY_API_KEY", "")
_cld_secret = os.environ.get("CLOUDINARY_API_SECRET", "")

if _cld_cloud and _cld_key and _cld_secret:
    cloudinary.config(
        cloud_name=_cld_cloud,
        api_key=_cld_key,
        api_secret=_cld_secret,
        secure=True,
    )
    logger.info(f"Cloudinary configured: cloud={_cld_cloud}")
else:
    logger.warning(
        "Cloudinary env vars missing! Image uploads will fail. "
        "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    )

# ══════════════════════════════════════════════════════
# STORAGE BACKEND
# ── Set MONGO_URL env var to enable MongoDB (production)
# ── Without MONGO_URL, falls back to local JSON files (dev)
# ══════════════════════════════════════════════════════
MONGO_URL = os.environ.get("MONGO_URL", "")
DB_NAME = os.environ.get("DB_NAME", "gm_bastralaya")
USE_MONGO = bool(MONGO_URL)

db = None  # set in startup()

# ── JSON file paths (used when USE_MONGO=False) ───────
DATA_DIR = Path(os.environ.get("DATA_DIR", str(ROOT_DIR / "data")))
UPLOADS_DIR = ROOT_DIR / "uploads"
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

USERS_FILE = DATA_DIR / "userlogs.json"
PRODUCTS_FILE = DATA_DIR / "products.json"
CATEGORIES_FILE = DATA_DIR / "categories.json"
INVENTORY_FILE = DATA_DIR / "inventory.json"
DISCOUNTS_FILE = DATA_DIR / "discounts.json"
IMAGES_FILE = DATA_DIR / "images.json"
WHATSAPP_FILE = DATA_DIR / "whatsapp.json"
ENQUIRIES_FILE = DATA_DIR / "enquiries.json"
AUDIT_FILE = DATA_DIR / "audit_logs.json"
FEEDBACK_FILE = DATA_DIR / "feedback.json"

# Map file path → MongoDB collection name
_FILE_TO_COL = {
    PRODUCTS_FILE: "products",
    CATEGORIES_FILE: "categories",
    INVENTORY_FILE: "inventory",
    DISCOUNTS_FILE: "discounts",
    IMAGES_FILE: "product_images",
    WHATSAPP_FILE: "whatsapp_numbers",
    ENQUIRIES_FILE: "enquiries",
    AUDIT_FILE: "audit_logs",
    FEEDBACK_FILE: "feedback",
}


# ══════════════════════════════════════════════════════
# GENERIC ASYNC STORAGE HELPERS
# ══════════════════════════════════════════════════════


def _col(path: Path):
    """Return the Motor collection for a given file path."""
    return db[_FILE_TO_COL.get(path, path.stem)]


def _strip_id(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc = dict(doc)
        del doc["_id"]
    return doc


# ── JSON sync helpers (USE_MONGO=False only) ──────────
def _j_read(path: Path) -> list:
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []


def _j_write(path: Path, data: list) -> None:
    path.write_text(json.dumps(data, default=str, indent=2), encoding="utf-8")


def _j_find_one(path: Path, query: dict) -> Optional[dict]:
    for item in _j_read(path):
        if all(item.get(k) == v for k, v in query.items()):
            return item
    return None


def _j_insert(path: Path, doc: dict) -> dict:
    items = _j_read(path)
    items.append(doc)
    _j_write(path, items)
    return doc


def _j_update_one(path: Path, query: dict, updates: dict) -> Optional[dict]:
    items = _j_read(path)
    for i, item in enumerate(items):
        if all(item.get(k) == v for k, v in query.items()):
            items[i] = {**item, **updates}
            _j_write(path, items)
            return items[i]
    return None


def _j_update_many(path: Path, query: dict, updates: dict) -> int:
    items = _j_read(path)
    count = 0
    for i, item in enumerate(items):
        if all(item.get(k) == v for k, v in query.items()):
            items[i] = {**item, **updates}
            count += 1
    if count:
        _j_write(path, items)
    return count


def _j_delete_one(path: Path, query: dict) -> bool:
    items = _j_read(path)
    for i, item in enumerate(items):
        if all(item.get(k) == v for k, v in query.items()):
            items.pop(i)
            _j_write(path, items)
            return True
    return False


def _j_delete_many(path: Path, query: dict) -> int:
    items = _j_read(path)
    kept = [i for i in items if not all(i.get(k) == v for k, v in query.items())]
    count = len(items) - len(kept)
    if count:
        _j_write(path, kept)
    return count


# ── Async wrappers (route to Mongo or JSON) ───────────
async def _db_find(path: Path, query: dict = {}) -> list:
    if USE_MONGO:
        docs = await _col(path).find(query).to_list(length=10000)
        return [_strip_id(d) for d in docs]
    # JSON: filter manually
    items = _j_read(path)
    if not query:
        return items
    return [i for i in items if all(i.get(k) == v for k, v in query.items())]


async def _db_find_one(path: Path, query: dict) -> Optional[dict]:
    if USE_MONGO:
        doc = await _col(path).find_one(query)
        return _strip_id(doc) if doc else None
    return _j_find_one(path, query)


async def _db_insert(path: Path, doc: dict) -> dict:
    if USE_MONGO:
        to_insert = dict(doc)
        await _col(path).insert_one(to_insert)
        return doc
    return _j_insert(path, doc)


async def _db_update_one(path: Path, query: dict, updates: dict) -> Optional[dict]:
    if USE_MONGO:
        await _col(path).update_one(query, {"$set": updates})
        doc = await _col(path).find_one(query)
        return _strip_id(doc) if doc else None
    return _j_update_one(path, query, updates)


async def _db_update_many(path: Path, query: dict, updates: dict) -> int:
    if USE_MONGO:
        result = await _col(path).update_many(query, {"$set": updates})
        return result.modified_count
    return _j_update_many(path, query, updates)


async def _db_delete_one(path: Path, query: dict) -> bool:
    if USE_MONGO:
        result = await _col(path).delete_one(query)
        return result.deleted_count > 0
    return _j_delete_one(path, query)


async def _db_delete_many(path: Path, query: dict) -> int:
    if USE_MONGO:
        result = await _col(path).delete_many(query)
        return result.deleted_count
    return _j_delete_many(path, query)


# ── Users helpers ─────────────────────────────────────
async def _read_users() -> list:
    if USE_MONGO:
        docs = await db["users"].find({}).to_list(length=10000)
        return [_strip_id(d) for d in docs]
    if not USERS_FILE.exists():
        return []
    try:
        data = json.loads(USERS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []


async def _upsert_user(user_doc: dict) -> None:
    if USE_MONGO:
        await db["users"].replace_one({"id": user_doc["id"]}, user_doc, upsert=True)
    else:
        users = [u for u in await _read_users() if u.get("id") != user_doc.get("id")]
        users.append(user_doc)
        USERS_FILE.write_text(
            json.dumps(users, default=str, indent=2), encoding="utf-8"
        )


# ══════════════════════════════════════════════════════
# JWT
# ══════════════════════════════════════════════════════
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

security = HTTPBearer()
app = FastAPI(title="GM Bastralaya Fashion Catalog API")
api_router = APIRouter(prefix="/api")
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


# ══════════════════════════════════════════════════════
# MODELS
# ══════════════════════════════════════════════════════
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    role: str = "viewer"
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "viewer"


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    role: str
    created_at: datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    slug: Optional[str] = ""
    parent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    slug: Optional[str] = None
    parent_id: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    parent_id: Optional[str] = None


class CategoryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    slug: Optional[str] = ""
    parent_id: Optional[str] = None
    created_at: datetime


class WhatsappNumber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_scope: str = "store"
    e164_number: str
    product_id: Optional[str] = None
    is_default: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("e164_number")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        try:
            parsed = phonenumbers.parse(v, None)
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number")
            return phonenumbers.format_number(
                parsed, phonenumbers.PhoneNumberFormat.E164
            )
        except NumberParseException:
            raise ValueError("Invalid phone number format")


class WhatsappNumberCreate(BaseModel):
    e164_number: str
    is_default: bool = False
    owner_scope: str = "store"
    product_id: Optional[str] = None


class WhatsappNumberUpdate(BaseModel):
    e164_number: Optional[str] = None
    is_default: Optional[bool] = None
    owner_scope: Optional[str] = None
    product_id: Optional[str] = None


class ProductImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    url: str
    alt: str = ""
    sort_order: int = 0


class ProductImageCreate(BaseModel):
    url: str
    alt: str = ""
    sort_order: int = 0


class Inventory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    variant: Optional[dict] = None
    quantity: int = 0


class InventoryUpdate(BaseModel):
    quantity: int
    variant: Optional[dict] = None


class Discount(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    type: str = "percentage"
    value: float
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DiscountCreate(BaseModel):
    type: str = "percentage"
    value: float
    active: bool = True
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None


class DiscountUpdate(BaseModel):
    type: Optional[str] = None
    value: Optional[float] = None
    active: Optional[bool] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    base_price: float
    active: bool = True
    sku: str
    category_id: Optional[str] = None
    default_whatsapp_number_id: Optional[str] = None
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    title: str
    description: str = ""
    base_price: float
    active: bool = True
    sku: str
    category_id: Optional[str] = None
    default_whatsapp_number_id: Optional[str] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    active: Optional[bool] = None
    sku: Optional[str] = None
    category_id: Optional[str] = None
    default_whatsapp_number_id: Optional[str] = None


class ProductWithDetails(Product):
    images: List[ProductImage] = Field(default_factory=list)
    inventory: Optional[Inventory] = None
    discount: Optional[Discount] = None
    final_price: float
    whatsapp_number: Optional[WhatsappNumber] = None


class EnquiryLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    e164_number: str
    message_preview: str
    source_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EnquiryLogCreate(BaseModel):
    product_id: str
    e164_number: str
    message_preview: str
    source_url: str


class AuditLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action: str
    entity_type: str
    entity_id: str
    before: Optional[dict] = None
    after: Optional[dict] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Feedback(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[EmailStr] = None
    rating: int
    message: str
    page_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False


class FeedbackCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    rating: int
    message: str
    page_url: str


class RoleUpdate(BaseModel):
    role: str  # admin | shopowner | viewer


# ══════════════════════════════════════════════════════
# AUTH HELPERS
# ══════════════════════════════════════════════════════
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> User:
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    for u in await _read_users():
        if u.get("id") == user_id:
            return User(**u)
    raise HTTPException(status_code=401, detail="User not found")


def require_role(roles: List[str]):
    async def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user

    return checker


async def log_audit(user_id, action, entity_type, entity_id, before=None, after=None):
    await _db_insert(
        AUDIT_FILE,
        AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            before=before,
            after=after,
        ).model_dump(),
    )


def make_slug(name: str) -> str:
    import re

    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


async def enrich_product(p: dict) -> ProductWithDetails:
    product = Product(**p)
    now = datetime.now(timezone.utc)

    images = sorted(
        await _db_find(IMAGES_FILE, {"product_id": product.id}),
        key=lambda x: x.get("sort_order", 0),
    )
    inv_doc = await _db_find_one(INVENTORY_FILE, {"product_id": product.id})
    inventory = (
        Inventory(**inv_doc)
        if inv_doc
        else Inventory(product_id=product.id, quantity=0)
    )

    discount = None
    for d in await _db_find(DISCOUNTS_FILE, {"product_id": product.id, "active": True}):

        def _dt(v):
            if v is None:
                return None
            dt = datetime.fromisoformat(str(v))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

        s, e = _dt(d.get("starts_at")), _dt(d.get("ends_at"))
        if (s is None or s <= now) and (e is None or e >= now):
            discount = Discount(**d)
            break

    final_price = product.base_price
    if discount:
        final_price = (
            product.base_price * (1 - discount.value / 100)
            if discount.type == "percentage"
            else max(0.0, product.base_price - discount.value)
        )

    wa_doc = None
    if product.default_whatsapp_number_id:
        wa_doc = await _db_find_one(
            WHATSAPP_FILE, {"id": product.default_whatsapp_number_id}
        )
    if not wa_doc:
        wa_list = await _db_find(
            WHATSAPP_FILE, {"is_default": True, "owner_scope": "store"}
        )
        wa_doc = wa_list[0] if wa_list else None

    return ProductWithDetails(
        **product.model_dump(),
        images=[ProductImage(**i) for i in images],
        inventory=inventory,
        discount=discount,
        final_price=final_price,
        whatsapp_number=WhatsappNumber(**wa_doc) if wa_doc else None,
    )


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 10 * 1024 * 1024


# ══════════════════════════════════════════════════════
# AUTH ROUTES
# ══════════════════════════════════════════════════════
@api_router.post("/auth/register", response_model=UserResponse)
async def register(payload: UserCreate):
    if any(u.get("email") == payload.email for u in await _read_users()):
        raise HTTPException(400, "Email already registered")
    user = User(
        name=payload.name,
        email=payload.email,
        role="viewer",  # force viewer on public register
        password_hash=hash_password(payload.password),
    )
    await _upsert_user(user.model_dump())
    logger.info(f"[AUTH] Registered {user.email} role={user.role}")
    return UserResponse(**user.model_dump())


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    doc = next(
        (u for u in await _read_users() if u.get("email") == payload.email), None
    )
    if not doc or not verify_password(payload.password, doc["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    user = User(**doc)
    logger.info(f"[AUTH] Login {user.email} role={user.role}")
    return TokenResponse(
        access_token=create_access_token({"sub": user.id}),
        user=UserResponse(**user.model_dump()),
    )


@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.model_dump())


# ══════════════════════════════════════════════════════
# CATEGORIES
# ══════════════════════════════════════════════════════
@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    return [CategoryResponse(**c) for c in await _db_find(CATEGORIES_FILE)]


@api_router.get("/categories/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    doc = await _db_find_one(CATEGORIES_FILE, {"id": category_id})
    if not doc:
        raise HTTPException(404, "Category not found")
    return CategoryResponse(**doc)


@api_router.post("/categories", response_model=CategoryResponse)
async def create_category(
    payload: CategoryCreate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    slug = payload.slug or make_slug(payload.name)
    if await _db_find_one(CATEGORIES_FILE, {"slug": slug}):
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    cat = Category(
        name=payload.name,
        description=payload.description or "",
        image_url=payload.image_url or "",
        slug=slug,
        parent_id=payload.parent_id,
    )
    await _db_insert(CATEGORIES_FILE, cat.model_dump())
    await log_audit(
        current_user.id, "create", "category", cat.id, after=cat.model_dump()
    )
    return CategoryResponse(**cat.model_dump())


@api_router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    payload: CategoryUpdate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(CATEGORIES_FILE, {"id": category_id})
    if not doc:
        raise HTTPException(404, "Category not found")
    updates = payload.model_dump(exclude_none=True)
    if "name" in updates and "slug" not in updates:
        updates["slug"] = make_slug(updates["name"])
    updated = await _db_update_one(CATEGORIES_FILE, {"id": category_id}, updates)
    await log_audit(
        current_user.id, "update", "category", category_id, before=doc, after=updated
    )
    return CategoryResponse(**updated)


@api_router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(CATEGORIES_FILE, {"id": category_id})
    if not doc:
        raise HTTPException(404, "Category not found")
    await _db_delete_one(CATEGORIES_FILE, {"id": category_id})
    if USE_MONGO:
        await db["products"].update_many(
            {"category_id": category_id}, {"$set": {"category_id": None}}
        )
    else:
        prods = _j_read(PRODUCTS_FILE)
        changed = False
        for i, p in enumerate(prods):
            if p.get("category_id") == category_id:
                prods[i]["category_id"] = None
                changed = True
        if changed:
            _j_write(PRODUCTS_FILE, prods)
    await log_audit(current_user.id, "delete", "category", category_id, before=doc)
    return {"message": "Category deleted"}


@api_router.post(
    "/categories/{category_id}/image/upload", response_model=CategoryResponse
)
async def upload_category_image(
    category_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(CATEGORIES_FILE, {"id": category_id})
    if not doc:
        raise HTTPException(404, "Category not found")
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "Unsupported type. Use JPEG/PNG/WebP/GIF.")
    contents = await file.read()
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "File too large (max 10MB)")
    upload_result = cloudinary.uploader.upload(
        contents,
        folder="gm_bastralaya/categories",
        public_id=f"cat_{category_id}_{uuid.uuid4().hex[:8]}",
    )
    image_url = upload_result.get("secure_url")
    updated = await _db_update_one(
        CATEGORIES_FILE, {"id": category_id}, {"image_url": image_url}
    )
    await log_audit(
        current_user.id,
        "update",
        "category",
        category_id,
        before=doc,
        after={"image_url": image_url},
    )
    return CategoryResponse(**updated)


# ══════════════════════════════════════════════════════
# PRODUCTS
# ══════════════════════════════════════════════════════
@api_router.get("/products", response_model=List[ProductWithDetails])
async def get_products(
    category_id: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    limit: int = Query(default=50, le=500),
    skip: int = 0,
    include_inactive: bool = False,
):
    query = {} if include_inactive else {"active": True}
    if category_id:
        query["category_id"] = category_id
    products = await _db_find(PRODUCTS_FILE, query)

    if search:
        s = search.lower()
        products = [
            p
            for p in products
            if s in p.get("title", "").lower()
            or s in p.get("description", "").lower()
            or s in p.get("sku", "").lower()
        ]
    if min_price is not None:
        products = [p for p in products if p.get("base_price", 0) >= min_price]
    if max_price is not None:
        products = [p for p in products if p.get("base_price", 0) <= max_price]

    products.sort(key=lambda x: str(x.get(sort_by, "")), reverse=(sort_order == "desc"))
    return [await enrich_product(p) for p in products[skip : skip + limit]]


@api_router.get("/products/{product_id}", response_model=ProductWithDetails)
async def get_product(product_id: str):
    doc = await _db_find_one(PRODUCTS_FILE, {"id": product_id})
    if not doc:
        raise HTTPException(404, "Product not found")
    return await enrich_product(doc)


@api_router.post("/products", response_model=ProductWithDetails)
async def create_product(
    payload: ProductCreate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if await _db_find_one(PRODUCTS_FILE, {"sku": payload.sku}):
        raise HTTPException(400, "SKU already exists")
    product = Product(**payload.model_dump(), created_by=current_user.id)
    await _db_insert(PRODUCTS_FILE, product.model_dump())
    await _db_insert(INVENTORY_FILE, Inventory(product_id=product.id).model_dump())
    await log_audit(
        current_user.id, "create", "product", product.id, after=product.model_dump()
    )
    return await enrich_product(product.model_dump())


@api_router.put("/products/{product_id}", response_model=ProductWithDetails)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(PRODUCTS_FILE, {"id": product_id})
    if not doc:
        raise HTTPException(404, "Product not found")
    updates = payload.model_dump(exclude_none=True)
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    if "sku" in updates and updates["sku"] != doc.get("sku"):
        if await _db_find_one(PRODUCTS_FILE, {"sku": updates["sku"]}):
            raise HTTPException(400, "SKU already exists")
    updated = await _db_update_one(PRODUCTS_FILE, {"id": product_id}, updates)
    await log_audit(
        current_user.id, "update", "product", product_id, before=doc, after=updated
    )
    return await enrich_product(updated)


@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(PRODUCTS_FILE, {"id": product_id})
    if not doc:
        raise HTTPException(404, "Product not found")
    await _db_delete_one(PRODUCTS_FILE, {"id": product_id})
    await _db_delete_many(IMAGES_FILE, {"product_id": product_id})
    await _db_delete_many(INVENTORY_FILE, {"product_id": product_id})
    await _db_delete_many(DISCOUNTS_FILE, {"product_id": product_id})
    await log_audit(current_user.id, "delete", "product", product_id, before=doc)
    return {"message": "Product deleted"}


# ══════════════════════════════════════════════════════
# PRODUCT IMAGES
# ══════════════════════════════════════════════════════
@api_router.get("/products/{product_id}/images", response_model=List[ProductImage])
async def get_product_images(product_id: str):
    docs = await _db_find(IMAGES_FILE, {"product_id": product_id})
    return [
        ProductImage(**i) for i in sorted(docs, key=lambda x: x.get("sort_order", 0))
    ]


@api_router.post("/products/{product_id}/images/upload", response_model=ProductImage)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    alt: str = Form(default=""),
    sort_order: int = Form(default=0),
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if not await _db_find_one(PRODUCTS_FILE, {"id": product_id}):
        raise HTTPException(404, "Product not found")
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "Unsupported type. Use JPEG/PNG/WebP/GIF.")
    contents = await file.read()
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "File too large (max 10MB)")
    upload_result = cloudinary.uploader.upload(
        contents,
        folder="gm_bastralaya/products",
        public_id=f"{product_id}_{uuid.uuid4().hex[:8]}",
    )
    url = upload_result.get("secure_url")
    existing_count = len(await _db_find(IMAGES_FILE, {"product_id": product_id}))
    image = ProductImage(
        product_id=product_id,
        url=url,
        alt=alt or file.filename or "",
        sort_order=existing_count,
    )
    await _db_insert(IMAGES_FILE, image.model_dump())
    await log_audit(
        current_user.id,
        "create",
        "product_image",
        image.id,
        after={"product_id": product_id, "url": url},
    )
    return image


@api_router.post("/products/{product_id}/images", response_model=ProductImage)
async def add_product_image_url(
    product_id: str,
    payload: ProductImageCreate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if not await _db_find_one(PRODUCTS_FILE, {"id": product_id}):
        raise HTTPException(404, "Product not found")
    image = ProductImage(product_id=product_id, **payload.model_dump())
    await _db_insert(IMAGES_FILE, image.model_dump())
    return image


@api_router.delete("/products/{product_id}/images/{image_id}")
async def delete_product_image(
    product_id: str,
    image_id: str,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(IMAGES_FILE, {"id": image_id, "product_id": product_id})
    if not doc:
        raise HTTPException(404, "Image not found")
    await _db_delete_one(IMAGES_FILE, {"id": image_id})
    return {"message": "Image deleted"}


# ══════════════════════════════════════════════════════
# INVENTORY
# ══════════════════════════════════════════════════════
@api_router.get("/products/{product_id}/inventory", response_model=Inventory)
async def get_inventory(product_id: str):
    doc = await _db_find_one(INVENTORY_FILE, {"product_id": product_id})
    return Inventory(**doc) if doc else Inventory(product_id=product_id, quantity=0)


@api_router.put("/products/{product_id}/inventory", response_model=Inventory)
async def update_inventory(
    product_id: str,
    payload: InventoryUpdate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if not await _db_find_one(PRODUCTS_FILE, {"id": product_id}):
        raise HTTPException(404, "Product not found")
    updates = payload.model_dump(exclude_none=True)
    existing = await _db_find_one(INVENTORY_FILE, {"product_id": product_id})
    if existing:
        updated = await _db_update_one(
            INVENTORY_FILE, {"product_id": product_id}, updates
        )
    else:
        inv = Inventory(product_id=product_id, **updates)
        await _db_insert(INVENTORY_FILE, inv.model_dump())
        updated = inv.model_dump()
    return Inventory(**updated)


# ══════════════════════════════════════════════════════
# DISCOUNTS
# ══════════════════════════════════════════════════════
@api_router.get("/products/{product_id}/discounts", response_model=List[Discount])
async def get_discounts(product_id: str):
    return [
        Discount(**d)
        for d in await _db_find(DISCOUNTS_FILE, {"product_id": product_id})
    ]


@api_router.post("/products/{product_id}/discounts", response_model=Discount)
async def create_discount(
    product_id: str,
    payload: DiscountCreate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if not await _db_find_one(PRODUCTS_FILE, {"id": product_id}):
        raise HTTPException(404, "Product not found")
    discount = Discount(product_id=product_id, **payload.model_dump())
    await _db_insert(DISCOUNTS_FILE, discount.model_dump())
    await log_audit(
        current_user.id, "create", "discount", discount.id, after=discount.model_dump()
    )
    return discount


@api_router.put(
    "/products/{product_id}/discounts/{discount_id}", response_model=Discount
)
async def update_discount(
    product_id: str,
    discount_id: str,
    payload: DiscountUpdate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(
        DISCOUNTS_FILE, {"id": discount_id, "product_id": product_id}
    )
    if not doc:
        raise HTTPException(404, "Discount not found")
    updated = await _db_update_one(
        DISCOUNTS_FILE, {"id": discount_id}, payload.model_dump(exclude_none=True)
    )
    return Discount(**updated)


@api_router.delete("/products/{product_id}/discounts/{discount_id}")
async def delete_discount(
    product_id: str,
    discount_id: str,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if not await _db_delete_one(
        DISCOUNTS_FILE, {"id": discount_id, "product_id": product_id}
    ):
        raise HTTPException(404, "Discount not found")
    return {"message": "Discount deleted"}


# ══════════════════════════════════════════════════════
# WHATSAPP
# ══════════════════════════════════════════════════════
@api_router.get("/whatsapp-numbers", response_model=List[WhatsappNumber])
async def get_whatsapp_numbers(
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    return [WhatsappNumber(**d) for d in await _db_find(WHATSAPP_FILE)]


@api_router.get("/whatsapp-default", response_model=WhatsappNumber)
async def get_default_whatsapp():
    docs = await _db_find(WHATSAPP_FILE, {"is_default": True, "owner_scope": "store"})
    if not docs:
        raise HTTPException(404, "Default WhatsApp not found")
    return WhatsappNumber(**docs[0])


@api_router.post("/whatsapp-numbers", response_model=WhatsappNumber)
async def create_whatsapp_number(
    payload: WhatsappNumberCreate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if payload.is_default:
        await _db_update_many(
            WHATSAPP_FILE, {"owner_scope": payload.owner_scope}, {"is_default": False}
        )
    wa = WhatsappNumber(**payload.model_dump())
    await _db_insert(WHATSAPP_FILE, wa.model_dump())
    await log_audit(
        current_user.id, "create", "whatsapp_number", wa.id, after=wa.model_dump()
    )
    return wa


@api_router.put("/whatsapp-numbers/{wa_id}", response_model=WhatsappNumber)
async def update_whatsapp_number(
    wa_id: str,
    payload: WhatsappNumberUpdate,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(WHATSAPP_FILE, {"id": wa_id})
    if not doc:
        raise HTTPException(404, "WhatsApp number not found")
    updates = payload.model_dump(exclude_none=True)
    if updates.get("is_default"):
        await _db_update_many(
            WHATSAPP_FILE,
            {
                "owner_scope": updates.get(
                    "owner_scope", doc.get("owner_scope", "store")
                )
            },
            {"is_default": False},
        )
    updated = await _db_update_one(WHATSAPP_FILE, {"id": wa_id}, updates)
    return WhatsappNumber(**updated)


@api_router.delete("/whatsapp-numbers/{wa_id}")
async def delete_whatsapp_number(
    wa_id: str,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    if not await _db_delete_one(WHATSAPP_FILE, {"id": wa_id}):
        raise HTTPException(404, "WhatsApp number not found")
    return {"message": "WhatsApp number deleted"}


# ══════════════════════════════════════════════════════
# ENQUIRIES
# ══════════════════════════════════════════════════════
@api_router.get("/enquiries", response_model=List[EnquiryLog])
async def get_enquiries(
    product_id: Optional[str] = None,
    limit: int = Query(default=100, le=1000),
    skip: int = 0,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    query = {"product_id": product_id} if product_id else {}
    docs = await _db_find(ENQUIRIES_FILE, query)
    docs = sorted(docs, key=lambda x: str(x.get("created_at", "")), reverse=True)
    return [EnquiryLog(**d) for d in docs[skip : skip + limit]]


@api_router.post("/enquiries", response_model=EnquiryLog)
async def create_enquiry(payload: EnquiryLogCreate):
    enquiry = EnquiryLog(**payload.model_dump())
    await _db_insert(ENQUIRIES_FILE, enquiry.model_dump())
    return enquiry


# ══════════════════════════════════════════════════════
# USERS
# ══════════════════════════════════════════════════════
@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(require_role(["admin"]))):
    return [UserResponse(**u) for u in await _read_users()]


@api_router.post("/users", response_model=UserResponse)
async def create_user(
    payload: UserCreate,
    current_user: User = Depends(require_role(["admin"])),
):
    if any(u.get("email") == payload.email for u in await _read_users()):
        raise HTTPException(400, "Email already registered")
    user = User(
        name=payload.name,
        email=payload.email,
        role=payload.role,
        password_hash=hash_password(payload.password),
    )
    await _upsert_user(user.model_dump())
    await log_audit(
        current_user.id,
        "create",
        "user",
        user.id,
        after={"email": user.email, "role": user.role},
    )
    return UserResponse(**user.model_dump())


@api_router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role(["admin"])),
):
    if user_id == current_user.id:
        raise HTTPException(400, "Cannot delete yourself")
    if USE_MONGO:
        result = await db["users"].delete_one({"id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(404, "User not found")
    else:
        users = await _read_users()
        new = [u for u in users if u.get("id") != user_id]
        if len(new) == len(users):
            raise HTTPException(404, "User not found")
        USERS_FILE.write_text(json.dumps(new, default=str, indent=2), encoding="utf-8")
    await log_audit(current_user.id, "delete", "user", user_id)
    return {"message": "User deleted"}


@api_router.patch("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    payload: RoleUpdate,
    current_user: User = Depends(require_role(["admin"])),
):
    valid_roles = {"admin", "shopowner", "viewer"}
    if payload.role not in valid_roles:
        raise HTTPException(
            400, f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )
    if USE_MONGO:
        from pymongo import ReturnDocument

        result = await db["users"].find_one_and_update(
            {"id": user_id},
            {"$set": {"role": payload.role}},
            return_document=ReturnDocument.AFTER,
        )
        if not result:
            raise HTTPException(404, "User not found")
        target = _strip_id(result)
    else:
        users = await _read_users()
        target = next((u for u in users if u.get("id") == user_id), None)
        if not target:
            raise HTTPException(404, "User not found")
        old_role = target.get("role")
        for i, u in enumerate(users):
            if u.get("id") == user_id:
                users[i]["role"] = payload.role
                target = users[i]
                break
        USERS_FILE.write_text(
            json.dumps(users, default=str, indent=2), encoding="utf-8"
        )
        await log_audit(
            current_user.id,
            "update",
            "user",
            user_id,
            before={"role": old_role},
            after={"role": payload.role},
        )
    return UserResponse(**target)


# ══════════════════════════════════════════════════════
# FEEDBACK
# ══════════════════════════════════════════════════════
@api_router.get("/feedback", response_model=List[Feedback])
async def get_feedback(
    limit: int = Query(default=100, le=1000),
    skip: int = 0,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    docs = await _db_find(FEEDBACK_FILE)
    docs = sorted(docs, key=lambda x: str(x.get("created_at", "")), reverse=True)
    return [Feedback(**d) for d in docs[skip : skip + limit]]


@api_router.post("/feedback", response_model=Feedback)
async def create_feedback(payload: FeedbackCreate):
    feedback = Feedback(**payload.model_dump())
    await _db_insert(FEEDBACK_FILE, feedback.model_dump())
    return feedback


@api_router.patch("/feedback/{feedback_id}/read", response_model=Feedback)
async def mark_feedback_read(
    feedback_id: str,
    current_user: User = Depends(require_role(["admin", "shopowner"])),
):
    doc = await _db_find_one(FEEDBACK_FILE, {"id": feedback_id})
    if not doc:
        raise HTTPException(404, "Feedback not found")
    updated = await _db_update_one(
        FEEDBACK_FILE, {"id": feedback_id}, {"is_read": True}
    )
    return Feedback(**updated)


@api_router.delete("/feedback/{feedback_id}")
async def delete_feedback(
    feedback_id: str,
    current_user: User = Depends(require_role(["admin"])),
):
    if not await _db_delete_one(FEEDBACK_FILE, {"id": feedback_id}):
        raise HTTPException(404, "Feedback not found")
    return {"message": "Feedback deleted"}


# ══════════════════════════════════════════════════════
# AUDIT LOGS
# ══════════════════════════════════════════════════════
@api_router.get("/audit-logs", response_model=List[AuditLog])
async def get_audit_logs(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    skip: int = 0,
    current_user: User = Depends(require_role(["admin"])),
):
    query = {}
    if entity_type:
        query["entity_type"] = entity_type
    if entity_id:
        query["entity_id"] = entity_id
    docs = await _db_find(AUDIT_FILE, query)
    docs = sorted(docs, key=lambda x: str(x.get("timestamp", "")), reverse=True)
    return [AuditLog(**d) for d in docs[skip : skip + limit]]


# ══════════════════════════════════════════════════════
# INIT
# ══════════════════════════════════════════════════════
@api_router.post("/init")
async def init_data():
    """Seeds default WhatsApp. Call once on fresh install."""
    created = []
    if not await _db_find(WHATSAPP_FILE, {"is_default": True}):
        wa = WhatsappNumber(
            e164_number="+919876543210", is_default=True, owner_scope="store"
        )
        await _db_insert(WHATSAPP_FILE, wa.model_dump())
        created.append("default WhatsApp +91-98765-43210")
    users = await _read_users()
    return {
        "message": "Initialisation complete",
        "storage": "mongodb" if USE_MONGO else "json-files",
        "created": created or ["nothing new — already initialised"],
        "total_users": len(users),
        "users": [{"email": u.get("email"), "role": u.get("role")} for u in users],
    }


# ══════════════════════════════════════════════════════
# APP SETUP
# ══════════════════════════════════════════════════════
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://gm-bastralaya.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.on_event("startup")
async def startup():
    global db

    if USE_MONGO:
        from motor.motor_asyncio import AsyncIOMotorClient

        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        # Indexes
        await db["users"].create_index("id", unique=True)
        await db["users"].create_index("email", unique=True)
        await db["products"].create_index("id", unique=True)
        await db["products"].create_index("sku", unique=True)
        await db["products"].create_index("category_id")
        await db["product_images"].create_index("product_id")
        await db["inventory"].create_index("product_id")
        await db["discounts"].create_index("product_id")
        await db["enquiries"].create_index("product_id")
        await db["audit_logs"].create_index("entity_id")
        await db["audit_logs"].create_index("timestamp")
        logger.info(f"✅ MongoDB connected: {DB_NAME}")
    else:
        # JSON fallback — ensure files exist
        for f in [
            PRODUCTS_FILE,
            CATEGORIES_FILE,
            INVENTORY_FILE,
            DISCOUNTS_FILE,
            IMAGES_FILE,
            WHATSAPP_FILE,
            ENQUIRIES_FILE,
            FEEDBACK_FILE,
            AUDIT_FILE,
        ]:
            if not f.exists():
                _j_write(f, [])

        # Migrate userlogs.txt → userlogs.json (legacy)
        old_txt = DATA_DIR / "userlogs.txt"
        if old_txt.exists():
            migrated = []
            for line in old_txt.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line and not line.startswith("#"):
                    try:
                        migrated.append(json.loads(line))
                    except Exception:
                        pass
            if migrated:
                existing = await _read_users()
                existing_ids = {u.get("id") for u in existing}
                for u in migrated:
                    if u.get("id") not in existing_ids:
                        existing.append(u)
                USERS_FILE.write_text(
                    json.dumps(existing, default=str, indent=2), encoding="utf-8"
                )
                logger.info(
                    f"Migrated {len(migrated)} users: userlogs.txt -> userlogs.json"
                )
            old_txt.rename(DATA_DIR / "userlogs.txt.bak")

        if not USERS_FILE.exists():
            USERS_FILE.write_text("[]", encoding="utf-8")

        logger.info("⚠️  Using JSON file storage (MONGO_URL not set)")

    # Seed default WhatsApp if missing
    if not await _db_find(WHATSAPP_FILE, {"is_default": True}):
        wa = WhatsappNumber(
            e164_number="+919876543210", is_default=True, owner_scope="store"
        )
        await _db_insert(WHATSAPP_FILE, wa.model_dump())
        logger.info("Auto-seeded: default WhatsApp +919876543210")

    users = await _read_users()
    logger.info(
        f"GM Bastralaya API started | "
        f"storage={'mongodb' if USE_MONGO else 'json'} | users={len(users)}"
    )


@app.on_event("shutdown")
async def shutdown():
    logger.info("GM Bastralaya API shutting down.")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)