'use client';
import { useState, useEffect } from 'react';

export default function MenuPage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Render üzerindeki canlı API adresimiz
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

  if (loading) return <div style={{textAlign: 'center', padding: '50px', fontFamily: 'sans-serif'}}>Yükleniyor...</div>;

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: '-apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        {menuData?.restaurant_name || "Restoran Menüsü"}
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Masadaki deneyim için ürünleri inceleyin.</p>

      {/* Güvenli Map (Soru işaretleri ile patlaması engellendi) */}
      {menuData?.menu?.length > 0 ? (
        menuData.menu.map((category, index) => (
          <div key={index} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px' }}>
              {category.category_name}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {category.items?.map((item) => (
                <div key={item.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>{item.description}</p>
                    <span style={{ fontWeight: '700', color: '#111827' }}>{item.price} TL</span>
                  </div>
                  
                  {item.glb_url && (
                    <a href={`https://modelviewer.dev/shared-assets/models/Astronaut.glb`} target="_blank" rel="noopener noreferrer" style={{ background: '#000', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                      AR ile İncele 🚀
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#9ca3af' }}>Henüz menüye eklenmiş ürün bulunmuyor. Admin panelinden ürün ekleyebilirsiniz.</p>
      )}
    </main>
  );
}