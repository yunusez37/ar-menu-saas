'use client';
import { useState, useEffect } from 'react';

export default function MenuPage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div style={{ height: '100vh', background: '#121629', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <main style={{ background: '#121629', minHeight: '100vh', paddingBottom: '80px', fontFamily: '-apple-system, sans-serif', color: '#ffffff' }}>
      
      {/* Üst Kısım / Navbar */}
      <div style={{ background: '#1a1f35', padding: '20px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>
          {menuData?.restaurant_name || "Pisi QR Sistemi 🚀"}
        </h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {menuData?.menu?.length > 0 ? (
          menuData.menu.map((category, index) => (
            <div key={index} style={{ marginBottom: '40px' }}>
              
              {/* Kategori Başlığı */}
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {category.category_name}
              </h2>
              
              {/* Ürün Listesi (Karanlık Tema Kartları) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {category.items?.map((item) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingBottom: '16px'
                  }}>
                    {/* Görsel Kutusu (Görseldeki gibi beyaz zeminli oval veya köşeli yuvarlak) */}
                    <div style={{ width: '100px', height: '100px', flexShrink: 0, background: '#fff', borderRadius: '12px', padding: '2px', marginRight: '16px' }}>
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} 
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </div>

                    {/* Metin ve Fiyat Alanı */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>{item.name}</h3>
                        <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '16px', whiteSpace: 'nowrap', marginLeft: '10px' }}>{item.price} TL</span>
                      </div>
                      
                      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#9ca3af', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                      
                      {item.glb_url && (
                        <a href={item.glb_url} target="_blank" rel="noopener noreferrer" 
                           style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', textDecoration: 'none', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)' }}>
                          AR 👁️
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            Menü hazırlanıyor...
          </div>
        )}
      </div>
    </main>
  );
}