'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  "🗓️ Günün Menüsü", "🥘 Ana Yemekler", "🥩 Et Yemekleri", "🍗 Tavuk Yemekleri",
  "🐟 Balık Yemekleri", "🥦 Sebze Yemekleri", "🍋 Zeytinyağlılar", "🥣 Çorbalar",
  "🍛 Pilavlar", "🍝 Makarnalar", "🥗 Salatalar", "🌮 Mezeler",
  "🍮 Tatlılar", "🧁 Kek Tarifleri", "🍪 Kurabiye Tarifleri", "🍰 Pasta Tarifleri",
  "🍳 Kahvaltılıklar", "🥨 Hamur İşleri", "🥯 Poğaça Tarifleri", "🥐 Börek Tarifleri"
];

export default function MenuPage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null); // Seçilen kategoriyi tutar

  useEffect(() => {
    fetch('https://ar-menu-saas-2.onrender.com/api/menu/pisi-qr-sistemi')
      .then((res) => res.json())
      .then((data) => {
        setMenuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hata:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Yükleniyor...</div>;
  }

  // Aktif kategorinin içindeki ürünleri bul
  const activeCategoryData = menuData?.menu?.find(c => c.category_name === activeCategory);

  return (
    <main style={{ background: '#f4f5f7', minHeight: '100vh', paddingBottom: '80px', fontFamily: '-apple-system, sans-serif' }}>
      
      {/* Üst Navbar */}
      <div style={{ background: '#ffffff', padding: '20px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {activeCategory && (
          <button 
            onClick={() => setActiveCategory(null)} 
            style={{ position: 'absolute', left: '20px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← 
          </button>
        )}
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
          {activeCategory || (menuData?.restaurant_name || "Pisi QR Sistemi")}
        </h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* ANA SAYFA: KUTULU KATEGORİLER (GRID) */}
        {!activeCategory && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {CATEGORIES.map((cat, index) => {
              const isSpecial = cat.includes("Günün Menüsü");
              return (
                <div 
                  key={index} 
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: isSpecial ? '#fef2f2' : '#ffffff',
                    border: `1px solid ${isSpecial ? '#fecaca' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    color: isSpecial ? '#dc2626' : '#111827',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  {cat}
                </div>
              );
            })}
          </div>
        )}

        {/* KATEGORİ İÇİ: ÜRÜN LİSTESİ */}
        {activeCategory && (
          <div>
            {!activeCategoryData || activeCategoryData.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Bu kategoride henüz ürün bulunmuyor.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeCategoryData.items.map((item) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    {/* Ürün Görseli */}
                    <div style={{ width: '90px', height: '90px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', marginRight: '16px' }}>
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} 
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Metin Alanı */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>{item.name}</h3>
                        <span style={{ fontWeight: '800', color: '#111827', fontSize: '15px', marginLeft: '10px' }}>{item.price} ₺</span>
                      </div>
                      
                      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                      
                      {item.glb_url && (
                        <a href={item.glb_url} target="_blank" rel="noopener noreferrer" 
                           style={{ display: 'inline-block', background: '#f3f4f6', color: '#111827', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none', fontWeight: '600', border: '1px solid #d1d5db' }}>
                          AR ile Gör 👀
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}