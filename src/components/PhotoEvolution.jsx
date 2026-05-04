import React, { useState } from 'react'
import { Camera, Plus, Calendar, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { motion } from 'framer-motion'

const PhotoCard = ({ label, date, image }) => (
  <div className="card" style={{ padding: '0.5rem' }}>
    <div style={{ 
      height: '300px', 
      backgroundColor: '#f1f5f9', 
      borderRadius: '8px', 
      backgroundImage: `url(${image})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem' }}>
        {date}
      </div>
    </div>
    <p style={{ textAlign: 'center', marginTop: '0.75rem', fontWeight: '600', fontSize: '0.875rem' }}>{label}</p>
  </div>
)

const PhotoEvolution = ({ patient }) => {
  const [view, setView] = useState('comparison') // 'gallery' or 'comparison'
  const [showModal, setShowModal] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ label: 'Frente', date: new Date().toISOString().split('T')[0], image: null })
  const [photos, setPhotos] = useState([
    { id: 1, label: "Frente (Janeiro)", date: "10 Jan, 2026", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400", category: 'Início', weight: '85kg' },
    { id: 2, label: "Frente (Abril)", date: "25 Abr, 2026", image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400", category: 'Atual', weight: '78kg' }
  ])

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPhoto({ ...newPhoto, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddPhoto = () => {
    if (newPhoto.image) {
      const photo = {
        id: Date.now(),
        ...newPhoto,
        category: 'Evolução',
        weight: '--'
      }
      setPhotos([photo, ...photos])
      setShowModal(false)
      setNewPhoto({ label: 'Frente', date: new Date().toISOString().split('T')[0], image: null })
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn ${view === 'comparison' ? 'btn-primary' : ''}`} 
            style={{ backgroundColor: view === 'comparison' ? 'var(--primary)' : '#f1f5f9', color: view === 'comparison' ? 'white' : '#64748b' }}
            onClick={() => setView('comparison')}
          >
            Comparativo Antes e Depois
          </button>
          <button 
            className={`btn ${view === 'gallery' ? 'btn-primary' : ''}`} 
            style={{ backgroundColor: view === 'gallery' ? 'var(--primary)' : '#f1f5f9', color: view === 'gallery' ? 'white' : '#64748b' }}
            onClick={() => setView('gallery')}
          >
            Galeria de Fotos
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Camera size={18} /> Nova Foto
        </button>
      </div>

      {view === 'comparison' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {photos.slice(0, 2).map((photo, index) => (
            <motion.div key={photo.id} initial={{ opacity: 0, x: index === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem' }}>{photo.date} ({photo.category})</h4>
                <span className={`badge ${index === 1 ? 'badge-success' : ''}`} style={{ background: index === 0 ? '#f1f5f9' : '' }}>Peso: {photo.weight}</span>
              </div>
              <PhotoCard label={photo.label} date={photo.date} image={photo.image} />
            </motion.div>
          ))}

          <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '2rem' }}>
            <div className="card glass" style={{ display: 'inline-flex', gap: '2rem', padding: '1.5rem 3rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Redução de Medidas</p>
                <h3 style={{ color: 'var(--primary)' }}>-7.2 cm</h3>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Diferença de Peso</p>
                <h3 style={{ color: 'var(--primary)' }}>-7.0 kg</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {photos.map((photo) => (
            <div key={photo.id} className="card" style={{ padding: '0.5rem', cursor: 'pointer' }}>
              <div style={{ height: '250px', backgroundColor: '#f1f5f9', borderRadius: '8px', backgroundImage: `url(${photo.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{photo.date}</p>
              <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>{photo.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova Foto */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Adicionar Foto</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ângulo/Etiqueta</label>
                <select className="input" style={{ width: '100%' }} value={newPhoto.label} onChange={e => setNewPhoto({...newPhoto, label: e.target.value})}>
                  <option>Frente</option>
                  <option>Costas</option>
                  <option>Lado Esquerdo</option>
                  <option>Lado Direito</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Data da Foto</label>
                <input type="date" className="input" style={{ width: '100%' }} value={newPhoto.date} onChange={e => setNewPhoto({...newPhoto, date: e.target.value})} />
              </div>

              <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', position: 'relative' }}>
                {newPhoto.image ? (
                  <img src={newPhoto.image} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <Camera size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.75rem' }}>Clique para fazer upload</p>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} onChange={handlePhotoUpload} />
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleAddPhoto} disabled={!newPhoto.image}>
                Salvar Evolução
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default PhotoEvolution
