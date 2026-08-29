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
    image_url: str = None
    glb_url: str = None
    usdz_url: str = None
    category_name: str  # YENİ: Dinamik kategori adı

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pisi QR Menü API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/menu/{restaurant_slug}")
def get_restaurant_menu(restaurant_slug: str, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.slug == restaurant_slug).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restoran bulunamadı")

    menu_data = []
    for category in restaurant.categories:
        cat_data = {"category_name": category.name, "items": []}
        for item in category.items:
            cat_data["items"].append({
                "id": item.id, "name": item.name, "description": item.description,
                "price": item.price, "image_url": item.image_url,
                "glb_url": item.glb_url, "usdz_url": item.usdz_url
            })
        menu_data.append(cat_data)
        
    return {"restaurant_name": restaurant.name, "menu": menu_data}

@app.post("/api/menu-ekle")
def add_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    # Restoranı bul veya oluştur (Yeni isimle)
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.slug == "pisi-qr-sistemi").first()
    if not restaurant:
        restaurant = models.Restaurant(name="Pisi QR Sistemi 🚀", slug="pisi-qr-sistemi")
        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)
        
    # Kategoriyi bul veya yeni oluştur
    category = db.query(models.Category).filter(
        models.Category.restaurant_id == restaurant.id,
        models.Category.name == item.category_name
    ).first()
    
    if not category:
        category = models.Category(name=item.category_name, restaurant_id=restaurant.id)
        db.add(category)
        db.commit()
        db.refresh(category)
    
    new_item = models.MenuItem(
        name=item.name, price=item.price, description=item.description,
        image_url=item.image_url, glb_url=item.glb_url, usdz_url=item.usdz_url,
        category_id=category.id
    )
    db.add(new_item)
    db.commit()
    return {"mesaj": f"{item.name} başarıyla eklendi!"}

# YENİ: Ürün Silme Endpoint'i
@app.delete("/api/menu-sil/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    db.delete(item)
    db.commit()
    return {"mesaj": "Ürün başarıyla silindi"}