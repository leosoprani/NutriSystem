import React, { useState } from 'react'
import { X, Save, User, Mail, Briefcase, Phone, Calendar, Users as UsersIcon } from 'lucide-react'

import { API_URL } from '../services/apiConfig'

const PatientForm = ({ onClose, onSave, tenant_id }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'Feminino',
    plan_type: 'Emagrecimento',
    status: 'Ativo'
  })
  const [submitting, setSubmitting] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Gerando senha automática
    const generatedPassword = Math.random().toString(36).slice(-6).toUpperCase()

    try {
      console.log('Tentando salvar paciente em:', `${API_URL}/patients.php`);
      const response = await fetch(`${API_URL}/patients.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password: generatedPassword, tenant_id })
      })

      const result = await response.json();

      if (result.success || result.id) {
        const newPatient = {
          ...formData,
          id: result.id || Date.now(),
          password: generatedPassword,
          status: 'Ativo'
        }
        setSuccessData({ email: formData.email, password: generatedPassword })
        onSave(newPatient)
      } else {
        throw new Error(result.error || 'Erro ao salvar no servidor');
      }
    } catch (err) {
      console.error('Erro ao salvar paciente:', err)
      setError('Falha ao conectar com o servidor. Verifique sua conexão ou se a API está online em ' + API_URL)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2.5rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
          <User size={28} color="var(--primary)" /> Cadastro de Novo Paciente
        </h2>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {successData ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Save size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Paciente Cadastrado!</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>As credenciais de acesso foram geradas:</p>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Usuário (E-mail)</label>
                <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{successData.email}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Senha Temporária</label>
                <p style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '2px', color: 'var(--primary)' }}>{successData.password}</p>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Concluir e Voltar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Nome Completo</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Nome do paciente"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>E-mail</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="exemplo@email.com"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>WhatsApp / Telefone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Data de Nascimento</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sexo</label>
                <div style={{ position: 'relative' }}>
                  <UsersIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', appearance: 'none', background: 'white' }}
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option>Feminino</option>
                    <option>Masculino</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Objetivo Principal</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', appearance: 'none', background: 'white' }}
                    value={formData.plan_type}
                    onChange={e => setFormData({ ...formData, plan_type: e.target.value })}
                  >
                    <option>Emagrecimento</option>
                    <option>Hipertrofia (Ganho de Massa)</option>
                    <option>Performance Esportiva</option>
                    <option>Saúde / Reeducação Alimentar</option>
                    <option>Vegetariano / Vegano</option>
                    <option>Gestante / Lactante</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <button
                type="button"
                className="btn"
                onClick={onClose}
                style={{ flex: 1, backgroundColor: '#f1f5f9' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={submitting}
              >
                {submitting ? 'Salvando...' : <><Save size={18} /> Cadastrar Paciente</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default PatientForm
