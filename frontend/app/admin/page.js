'use client';
import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function AdminPanel() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', image_url: '', glb_url: '', usdz_url: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  // Canlı Vercel Adresi (Müşteri Menüsüne Yönlendirir)
  const menuUrl = "https://ar-menu-saas1.vercel.app"; 

  // Sayfanın sadece tarayıcıda yüklendiğinden emin oluyoruz (Hydration sorununu çözer)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Kaydediliyor...' });
    
    try {
      // Canlı Render (Backend) API Adresi
      const response = await fetch('https://ar-menu-saas-2.onrender.com/api/menu-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          image_url: formData.image_url,
          glb_url: formData.glb_url,
          usdz_url: formData.usdz_url
        }),
      });
      
      if(response.ok) {
        setStatus({ type: 'success', message: 'Ürün başarıyla menüye eklendi.' });
        e.target.reset();
        // Form verilerini temizle
        setFormData({ name: '', price: '', description: '', image_url: '', glb_url: '', usdz_url: '' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        setStatus({ type: 'error', message: 'Sistem hatası: Kayıt yapılamadı.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Sunucuya bağlanılamıyor.' });
    }
  };

  // Eğer bileşen henüz tarayıcıya monte edilmediyse boş döndür
  if (!isMounted) return null;

  return (
    <div className="saas-container" suppressHydrationWarning>
      <style>{`
        .saas-container {
          min-height: 100vh;
          background-color: #f9fafb;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #111827;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
        }
        
        .header-section { width: 100%; max-width: 1000px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
        .header-section h1 { font-size: 24px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: -0.025em; }
        .header-section p { font-size: 14px; color: #6b7280; margin: 0; }
        .content-grid { width: 100%; max-width: 1000px; display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
        
        @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } }
        
        .panel { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .form-group { margin-bottom: 20px; }
        .form-row { display: flex; gap: 16px; }
        .form-row .form-group { flex: 1; }
        label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
        
        input, textarea {
          width: 100%; padding: 10px 12px; background-color: #ffffff; border: 1px solid #d1d5db;
          border-radius: 6px; font-size: 14px; color: #111827; box-sizing: border-box;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; font-family: inherit;
        }
        input:focus, textarea:focus { outline: none; border-color: #000000; box-shadow: 0 0 0 1px #000000; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
        
        .section-divider { margin: 32px 0 24px 0; padding-top: 24px; border-top: 1px solid #f3f4f6; }
        .section-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 16px; }
        
        .submit-btn {
          width: 100%; background-color: #000000; color: #ffffff; border: none; border-radius: 6px;
          padding: 12px 16px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; margin-top: 8px;
        }
        .submit-btn:hover { background-color: #374151; }
        
        .status-message { margin-top: 16px; padding: 12px; border-radius: 6px; font-size: 13px; font-weight: 500; }
        .status-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .status-loading { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
        
        .qr-header { margin-bottom: 24px; }
        .qr-header h2 { font-size: 16px; font-weight: 600; margin: 0 0 4px 0; }
        .qr-header p { font-size: 13px; color: #6b7280; margin: 0; line-height: 1.5; }
        .qr-box { background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 8px; padding: 32px; display: flex; justify-content: center; align-items: center; margin-bottom: 16px; }
        .qr-footer { font-size: 12px; color: #9ca3af; text-align: center; }
      `}</style>

      <div className="header-section">
        <h1>Ürün Yönetimi</h1>
        <p>AR menünüz için yeni ürünler tanımlayın ve yönetin.</p>
      </div>

      <div className="content-grid">
        
        <div className="panel">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Ürün Adı</label>
                <input type="text" placeholder="Örn: Trüflü Burger" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Birim Fiyatı (TL)</label>
                <input type="number" step="0.01" placeholder="0.00" required onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Açıklama</label>
              <textarea rows="3" placeholder="İçerik ve detayları girin..." style={{ resize: 'vertical' }} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Ürün Görseli (URL)</label>
              <input type="url" placeholder="https://.../urun-resmi.jpg" onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
            </div>

            <div className="section-divider">
              <div className="section-title">3D Kaynak Dosyaları</div>
              
              <div className="form-group">
                <label>GLB Formatı (.glb)</label>
                <input type="url" placeholder="https://.../model.glb" onChange={(e) => setFormData({...formData, glb_url: e.target.value})} />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>USDZ Formatı (.usdz)</label>
                <input type="url" placeholder="https://.../model.usdz" onChange={(e) => setFormData({...formData, usdz_url: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Ürünü Kaydet
            </button>

            {status.message && (
              <div className={`status-message status-${status.type}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        <div className="panel">
          <div className="qr-header">
            <h2>Masa QR Kodu</h2>
            <p>Müşterilerin menüye erişimi için taranabilir kod.</p>
          </div>
          
          <div className="qr-box">
            <QRCodeCanvas value={menuUrl} size={160} level={"H"} />
          </div>
          
          <div className="qr-footer">
            Kodu indirmek için sağ tıklayıp resmi kaydedin.
          </div>
        </div>

      </div>
    </div>
  );
}