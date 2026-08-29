'use client';
import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const CATEGORIES = [
  "🗓️ Günün Menüsü", "🥘 Ana Yemekler", "🥩 Et Yemekleri", "🍗 Tavuk Yemekleri",
  "🐟 Balık Yemekleri", "🥦 Sebze Yemekleri", "🍋 Zeytinyağlılar", "🥣 Çorbalar",
  "🍛 Pilavlar", "🍝 Makarnalar", "🥗 Salatalar", "🌮 Mezeler",
  "🍮 Tatlılar", "🧁 Kek Tarifleri", "🍪 Kurabiye Tarifleri", "🍰 Pasta Tarifleri",
  "🍳 Kahvaltılıklar", "🥨 Hamur İşleri", "🥯 Poğaça Tarifleri", "🥐 Börek Tarifleri"
];

export default function AdminPanel() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', image_url: '', glb_url: '', usdz_url: '', category_name: CATEGORIES[0]
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [menuItems, setMenuItems] = useState([]);

  const menuUrl = "https://ar-menu-saas1.vercel.app"; 
  const apiUrl = "https://ar-menu-saas-2.onrender.com";

  useEffect(() => {
    setIsMounted(true);
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/menu/pisi-qr-sistemi`);
      const data = await res.json();
      setMenuItems(data.menu || []);
    } catch (err) {
      console.error("Menü çekilemedi");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Kaydediliyor...' });
    
    try {
      const response = await fetch(`${apiUrl}/api/menu-ekle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });
      
      if(response.ok) {
        setStatus({ type: 'success', message: 'Ürün eklendi.' });
        setFormData({ ...formData, name: '', price: '', description: '', image_url: '', glb_url: '', usdz_url: '' });
        fetchMenu();
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Hata oluştu.' });
    }
  };

  const handleDelete = async (itemId) => {
    if(!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${apiUrl}/api/menu-sil/${itemId}`, { method: 'DELETE' });
      if(res.ok) fetchMenu();
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="saas-container" suppressHydrationWarning>
      <style>{`
        .saas-container { min-height: 100vh; background-color: #f9fafb; font-family: sans-serif; color: #111827; padding: 40px 20px; }
        .header-section { max-width: 1000px; margin: 0 auto 32px auto; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
        .content-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
        @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } }
        .panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; background: #fff; }
        .submit-btn { width: 100%; background: #000; color: #fff; border: none; border-radius: 6px; padding: 12px; font-weight: 600; cursor: pointer; }
        .delete-btn { background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px; }
        .list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
      `}</style>

      <div className="header-section">
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Admin Yönetim Paneli ⚙️</h1>
      </div>

      <div className="content-grid">
        <div>
          <div className="panel" style={{marginBottom: '24px'}}>
            <h2 style={{fontSize: '18px', marginBottom: '20px'}}>Yeni Ürün Ekle</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Kategori Seçiniz</label>
                <select required value={formData.category_name} onChange={(e) => setFormData({...formData, category_name: e.target.value})}>
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Ürün Adı</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Fiyat (TL)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Görsel URL</label>
                <input type="url" placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>GLB URL (AR için)</label>
                  <input type="url" value={formData.glb_url} onChange={(e) => setFormData({...formData, glb_url: e.target.value})} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>USDZ URL (Apple AR için)</label>
                  <input type="url" value={formData.usdz_url} onChange={(e) => setFormData({...formData, usdz_url: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="submit-btn">Ürünü Kaydet</button>
              {status.message && <div style={{marginTop: '10px', color: status.type === 'success' ? 'green' : 'red'}}>{status.message}</div>}
            </form>
          </div>

          <div className="panel">
            <h2 style={{fontSize: '18px', marginBottom: '20px'}}>Mevcut Ürünler (Silme İşlemi)</h2>
            {menuItems.map((cat, i) => (
              <div key={i} style={{marginBottom: '20px'}}>
                <h3 style={{fontSize: '15px', color: '#6b7280', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>{cat.category_name}</h3>
                {cat.items.map(item => (
                  <div key={item.id} className="list-item">
                    <div>
                      <span style={{fontWeight: '600'}}>{item.name}</span> - {item.price} TL
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="delete-btn">Sil</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2 style={{fontSize: '16px', marginBottom: '10px'}}>Masa QR Kodu</h2>
          <div style={{background: '#f9fafb', padding: '30px', textAlign: 'center', borderRadius: '8px'}}>
            <QRCodeCanvas value={menuUrl} size={180} level={"H"} />
          </div>
        </div>
      </div>
    </div>
  );
}