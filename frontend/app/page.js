'use client';
import { useState, useEffect } from 'react';

// İnternetten çekilen yüksek kaliteli kategori görselleri
const CATEGORY_DATA = [
  { name: "Günün Menüsü", image: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80" },
  { name: "Ana Yemekler", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" },
  { name: "Et Yemekleri", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80" },
  { name: "Tavuk Yemekleri", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80" },
  { name: "Balık Yemekleri", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80" },
  { name: "Makarnalar", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80" },
  { name: "Salatalar", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
  { name: "Mezeler", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&q=80" },
  { name: "Tatlılar", image: "https://images.unsplash.com/photo-1551024506-0cb4a161728e?w=600&q=80" },
  { name: "İçecekler", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80" }
];

export default function MenuPage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

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
    return <div style={{ height: '100vh', background: '#0a0a0a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>;
  }

  const activeCategoryData = menuData?.menu?.find(c => c.category_name === activeCategory);

  return (
    <main style={{ 
      backgroundColor: '#050505', 
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1f1f2e 0%, #050505 70%)',
      minHeight: '100vh', 
      paddingBottom: '80px', 
      fontFamily: '"SF Pro Display", -apple-system, sans-serif',
      color: '#fff'
    }}>
      
      {/* Premium Glassmorphism Navbar */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10, 10, 10, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {activeCategory && (
          <button onClick={() => setActiveCategory(null)} 
            style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ← 
          </button>
        )}
        <h1 style={{ 
          fontSize: '22px', fontWeight: '800', margin: 0, letterSpacing: '1px',
          background: 'linear-gradient(135deg, #d4af37 0%, #ffdf73 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          {activeCategory || "Pisi QR Sistemi"}
        </h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* ANA SAYFA: GÖRSELLİ LÜKS KATEGORİ KARTLARI */}
        {!activeCategory && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {CATEGORY_DATA.map((cat, index) => (
              <div 
                key={index} 
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  aspectRatio: '4/5',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Karanlık Gradyan Perdesi */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '20px 10px'
                }}>
                  <span style={{ 
                    color: '#fff', fontWeight: '700', fontSize: '16px', letterSpacing: '0.5px', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
                  }}>
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KATEGORİ İÇİ: MODERN CAM (GLASS) ÜRÜN KARTLARI */}
        {activeCategory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            
            {!activeCategoryData || activeCategoryData.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666', fontSize: '15px' }}>
                Bu kategoride özel bir lezzet hazırlanıyor...
              </div>
            ) : (
              activeCategoryData.items.map((item) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', marginRight: '16px', position: 'relative' }}>
                    <img 
                      src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"} 
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '700', color: '#fff', letterSpacing: '0.3px' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: '#d4af37', fontSize: '17px' }}>{item.price} ₺</span>
                      
                      {item.glb_url && (
                        <a href={item.glb_url} target="_blank" rel="noopener noreferrer" 
                           style={{ 
                             background: 'linear-gradient(135deg, #d4af37 0%, #ffdf73 100%)', 
                             color: '#000', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', 
                             textDecoration: 'none', fontWeight: '700', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' 
                           }}>
                          AR Deneyimi ✨
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}