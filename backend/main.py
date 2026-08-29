from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
from database import engine, get_db
from pydantic import BaseModel

class MenuItemCreate(BaseModel):
    name: str
    price: float
    description: str = None
    glb_url: str = None
    usdz_url: str = None

# Tabloları veritabanında oluştur (Gerçek projelerde Alembic kullanılır, başlangıç için bu idealdir)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR AR Menü API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Yeni bir restoranın menüsünü getiren dinamik Endpoint
@app.get("/api/menu/{restaurant_slug}")
def get_restaurant_menu(restaurant_slug: str, db: Session = Depends(get_db)):
    # 1. Önce URL'den restoranı bul
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.slug == restaurant_slug).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restoran bulunamadı")

    # 2. Restorana ait kategorileri ve ürünleri toparla
    menu_data = []
    for category in restaurant.categories:
        cat_data = {
            "category_name": category.name,
            "items": []
        }
        for item in category.items:
            cat_data["items"].append({
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "price": item.price,
                "glb_url": item.glb_url,
                "usdz_url": item.usdz_url
            })
        menu_data.append(cat_data)
        
    return {
        "restaurant_name": restaurant.name,
        "menu": menu_data
    }
@app.get("/api/verileri-olustur")
def seed_database(db: Session = Depends(get_db)):
    # Eğer restoran zaten varsa tekrar ekleme
    if db.query(models.Restaurant).first():
        return {"mesaj": "Veriler zaten MS SQL veritabanında mevcut!"}
    
    # 1. Restoranı oluştur
    restaurant = models.Restaurant(name="Pisi Pizza", slug="pisi-pizza")
    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)

    # 2. Kategori oluştur
    category = models.Category(name="Popüler Seçimler", restaurant_id=restaurant.id)
    db.add(category)
    db.commit()
    db.refresh(category)

    # 3. Ürünü ve 3D Modeli ekle
    item = models.MenuItem(
        name="Margarita Pizza",
        description="Odun ateşinde pişmiş enfes İtalyan lezzeti.",
        price=250.0,
        glb_url="https://modelviewer.dev/shared-assets/models/Astronaut.glb",
        usdz_url="https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
        category_id=category.id
    )
    db.add(item)
    db.commit()

    return {"mesaj": "Pisi Pizza menüsü başarıyla MS SQL veritabanına eklendi!"}

@app.post("/api/menu-ekle")
def add_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    # 1. Önce restoranı ve ilk kategorisini bul
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.slug == "pisi-pizza").first()
    category = db.query(models.Category).filter(models.Category.restaurant_id == restaurant.id).first()
    
    # 2. Gelen verilerle yeni bir ürün oluştur
    new_item = models.MenuItem(
        name=item.name,
        price=item.price,
        description=item.description,
        glb_url=item.glb_url,
        usdz_url=item.usdz_url,
        category_id=category.id
    )
    
    # 3. Veritabanına (MS SQL) kaydet
    db.add(new_item)
    db.commit()
    
    return {"mesaj": f"{item.name} başarıyla MS SQL veritabanına eklendi!"}