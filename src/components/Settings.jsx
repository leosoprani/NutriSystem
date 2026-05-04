import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Image, Save, Check, User, Mail, Phone, Award, Camera, Globe, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { securityService } from '../services/securityService'

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <Icon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      <input 
        type={type}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }}
      />
    </div>
  </div>
)

const ProfileSettings = ({ onSaveSuccess }) => {
  const [profileData, setProfileData] = useState({
    name: securityService.getSecureItem('nutri_name') || 'Dr. Leonardo Silva',
    crp: securityService.getSecureItem('nutri_crp') || 'CRN-3 12345/P',
    specialty: securityService.getSecureItem('nutri_specialty') || 'Nutrição Esportiva e Clínica',
    email: securityService.getSecureItem('nutri_email') || 'contato@drleonardo.com.br',
    phone: securityService.getSecureItem('nutri_phone') || '(11) 99999-9999',
    instagram: securityService.getSecureItem('nutri_instagram') || '@dr.leonardo_nutri',
    website: securityService.getSecureItem('nutri_website') || 'www.drleonardonutri.com.br',
    address: securityService.getSecureItem('nutri_address') || 'Av. Paulista, 1000 - São Paulo, SP',
    cnpj: securityService.getSecureItem('nutri_cnpj') || '00.000.000/0001-00',
    bio: securityService.getSecureItem('nutri_bio') || 'Especialista em emagrecimento e performance esportiva com mais de 10 anos de experiência.',
    specialties: securityService.getSecureItem('nutri_specialties') || 'Hipertrofia, Emagrecimento, Performance, Nutrição Vegetariana'
  })

  const [accentColor, setAccentColor] = useState(localStorage.getItem('app_accent_color') || '#00c49a')
  const [avatar, setAvatar] = useState(securityService.getSecureItem('nutri_avatar') || '')
  const [saved, setSaved] = useState(false)

  const handleColorChange = (color) => {
    setAccentColor(color)
    localStorage.setItem('app_accent_color', color)
    document.documentElement.style.setProperty('--primary', color)
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    securityService.setSecureItem('nutri_avatar', avatar)
    Object.keys(profileData).forEach(key => {
      securityService.setSecureItem(`nutri_${key}`, profileData[key])
    })
    setSaved(true)
    
    setTimeout(() => {
      setSaved(false)
      if (onSaveSuccess) onSaveSuccess()
    }, 1500)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card glass" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 1.5rem' }}>
              <div style={{ 
                width: '140px', 
                height: '140px', 
                borderRadius: '50%', 
                backgroundColor: '#e2e8f0', 
                backgroundImage: avatar ? `url(${avatar})` : `url(https://ui-avatars.com/api/?name=${profileData.name.replace(' ', '+')}&background=00c49a&color=fff&size=140)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '4px solid white',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}></div>
              <label style={{ 
                position: 'absolute', 
                bottom: '5px', 
                right: '5px', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '8px', 
                borderRadius: '50%', 
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Camera size={18} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{profileData.name}</h3>
            <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem', marginBottom: '1rem' }}>{profileData.crp}</p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '800' }}>IDENTIDADE VISUAL</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Escolha a cor de destaque do seu NutriSystem:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['#00c49a', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#1e293b'].map(color => (
                <div 
                  key={color} 
                  onClick={() => handleColorChange(color)}
                  style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    backgroundColor: color, 
                    cursor: 'pointer', 
                    border: accentColor === color ? '3px solid white' : 'none',
                    boxShadow: accentColor === color ? '0 0 0 2px var(--primary)' : 'none'
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>COR PERSONALIZADA</label>
              <input 
                type="color" 
                value={accentColor} 
                onChange={(e) => handleColorChange(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={24} color="var(--primary)" /> Perfil do Especialista
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <InputGroup 
              label="Nome Completo" icon={User} placeholder="Seu nome" 
              value={profileData.name} onChange={(v) => setProfileData({...profileData, name: v})} 
            />
            <InputGroup 
              label="Registro Profissional" icon={Award} placeholder="CRN-3 0000/P" 
              value={profileData.crp} onChange={(v) => setProfileData({...profileData, crp: v})} 
            />
            <InputGroup 
              label="E-mail Profissional" icon={Mail} placeholder="email@exemplo.com" type="email"
              value={profileData.email} onChange={(v) => setProfileData({...profileData, email: v})} 
            />
            <InputGroup 
              label="WhatsApp / Telefone" icon={Phone} placeholder="(11) 90000-0000" 
              value={profileData.phone} onChange={(v) => setProfileData({...profileData, phone: v})} 
            />
            <InputGroup 
              label="Especialidade" icon={Award} placeholder="Ex: Nutrição Esportiva" 
              value={profileData.specialty} onChange={(v) => setProfileData({...profileData, specialty: v})} 
            />
            <InputGroup 
              label="Instagram" icon={Camera} placeholder="@usuario" 
              value={profileData.instagram} onChange={(v) => setProfileData({...profileData, instagram: v})} 
            />
            <div style={{ gridColumn: 'span 2' }}>
              <InputGroup 
                label="Endereço do Consultório" icon={MapPin} placeholder="Rua, Número, Cidade - UF" 
                value={profileData.address} onChange={(v) => setProfileData({...profileData, address: v})} 
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Bio / Resumo Profissional</label>
              <textarea 
                className="input"
                rows="4"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', resize: 'none', marginBottom: '1.5rem' }}
              ></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: '180px', height: '48px', fontSize: '1rem' }}>
              {saved ? <><Check size={20} /> Alterações Salvas!</> : <><Save size={20} /> Salvar Perfil</>}
            </button>
          </div>
        </div>
      </div>

      {/* System Info Section */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', opacity: 0.6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text)' }}>NutriSystem Premium Management</p>
            <p style={{ fontSize: '0.7rem' }}>Versão do Sistema: 2.4.0 Titanium Ultra</p>
            <p style={{ fontSize: '0.7rem' }}>Data de Criação: Abril de 2026</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem' }}>Desenvolvido por: AI Engineering Team</p>
            <p style={{ fontSize: '0.7rem' }}>Build ID: 585b4152-premium-full</p>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
