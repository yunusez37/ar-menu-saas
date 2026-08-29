'use client';
import { useState, useEffect } from 'react';

export default function MenuPage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://ar-menu-saas-2.onrender.com/api/menu/pisi-pizza')
      .then((res) => res.json())
      .then((data) => {
        setMenuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Menü yüklenirken hata:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
        <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: '500' }}>
          Menü Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Restoran Header Alanı */}
      <div style={{ background: '#fff', padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 5px 0', color: '#111827' }}>
          {menuData?.restaurant_name || "Restoran Adı"}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Lezzetlerimizi Keşfedin</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {menuData?.menu?.length > 0 ? (
          menuData.menu.map((category, index) => (
            <div key={index} style={{ marginBottom: '40px' }}>
              {/* Kategori Başlığı */}
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '4px', height: '20px', background: '#ef4444', borderRadius: '4px' }}></span>
                {category.category_name}
              </h2>
              
              {/* Ürün Listesi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {category.items?.map((item) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.02)'
                  }}>
                    {/* Sol: Ürün Görseli */}
                    <div style={{ width: '120px', flexShrink: 0, background: '#f3f4f6', position: 'relative' }}>
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"} 
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                      />
                    </div>

                    {/* Sağ: İçerik */}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#111827' }}>{item.name}</h3>
                        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                          {item.description}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '800', color: '#ef4444', fontSize: '16px' }}>{item.price} ₺</span>
                        
                        {item.glb_url && (
                          <a href={item.glb_url} target="_blank" rel="noopener noreferrer" 
                             style={{ background: '#111827', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            AR
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '16px' }}>
            <p style={{ color: '#9ca3af', margin: 0 }}>Menü hazırlanıyor...</p>
          </div>
        )}
      </div>
    </main>
  );
}