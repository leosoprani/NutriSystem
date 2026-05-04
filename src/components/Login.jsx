import React, { useState } from 'react'
import { LogIn, Mail, Lock, Activity, ShieldCheck, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { securityService } from '../services/securityService'
import logoIcon from '../assets/logo-icon.png'
import { API_URL } from '../services/apiConfig'

const Login = ({ onLogin, onPatientLogin, onBack, patients = [] }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Check for Master Admin (Hardcoded)
    if (email === 'admin@nutrisystem.com.br' && password === 'admin123') {
      securityService.setSecureItem('is_auth', true)
      securityService.setSecureItem('is_configured', true)
      securityService.setSecureItem('nutri_name', 'Master Admin')
      onLogin()
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();

      if (result.success) {
        if (result.type === 'nutritionist') {
          securityService.setSecureItem('is_auth', true)
          // Removido o is_configured: true fixo para permitir que o SetupWizard apareça
          // O status real será controlado pelo localStorage ou futuramente pelo banco
          securityService.setSecureItem('nutri_name', result.user.name)
          securityService.setSecureItem('tenant_id', result.user.id)
          onLogin()
        } else if (result.type === 'patient') {
          securityService.setSecureItem('logged_patient', result.user)
          securityService.setSecureItem('is_patient_mode', true)
          onPatientLogin(result.user)
        }
      } else {
        setError(result.error || 'E-mail ou senha incorretos')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: '3rem', 
          textAlign: 'center',
          backgroundColor: '#192334', 
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          color: 'white',
          position: 'relative'
        }}
      >
        {onBack && (
          <button 
            onClick={onBack}
            style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            ← Voltar
          </button>
        )}
        <div style={{ 
          width: '90px', 
          height: '90px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1.5rem',
          overflow: 'hidden',
          borderRadius: '22%' // Arredondamento premium que casa com a logo
        }}>
          <img src={logoIcon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'white' }}>NutriSystem</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>Painel do Especialista Titanium Ultra</p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Seu E-mail ou CPF</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input 
                type="text" 
                required
                placeholder="Digite seu acesso..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.875rem 1rem 0.875rem 3rem', 
                  borderRadius: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Sua Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.875rem 1rem 0.875rem 3rem', 
                  borderRadius: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <input 
              type="checkbox" 
              id="consent" 
              required 
              style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--primary)' }} 
            />
            <label htmlFor="consent" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', lineHeight: '1.4' }}>
              Li e concordo com os <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong> em conformidade com a <strong>LGPD</strong>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', height: '52px', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}
          >
            {loading ? 'Autenticando...' : <><LogIn size={20} /> Entrar no Sistema</>}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} />
          Conexão Segura e Criptografada
        </div>
      </motion.div>
    </div>
  )
}

export default Login
