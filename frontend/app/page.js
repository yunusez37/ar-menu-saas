'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    // API artık spesifik bir restoranın (pisi-pizza) menüsünü getiriyor
    fetch('http://192.168.1.109:8000/api/menu/pisi-pizza')
      .then(res => res.json())
      .then(data => {
        setRestaurantName(data.restaurant_name);
        setMenuCategories(data.menu);
      });
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>🍽️ {restaurantName} AR Menü</h1>
      
      {menuCategories.map((category, index) => (
        <div key={index}>
          <h2 style={{ marginTop: '30px', borderBottom: '2px solid #eee', color: '#333' }}>
            {category.category_name}
          </h2>
          
          {category.items.map(item => (
            <div key={item.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginTop: '15px' }}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p style={{ fontWeight: 'bold', color: '#ff5722' }}>Fiyat: {item.price} TL</p>

              <div style={{ width: '100%', height: '300px', backgroundColor: '#f9f9f9', borderRadius: '10px', overflow: 'hidden' }}>
                <model-viewer
                  src={item.glb_url}
                  ios-src={item.usdz_url}
                  alt={item.name}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  auto-rotate
                  style={{ width: '100%', height: '100%' }}
                >
                  <button slot="ar-button" style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '10px 15px', backgroundColor: '#ff5722', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    📱 Masanda Gör
                  </button>
                </model-viewer>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}