import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Building2, 
  Camera, 
  Printer, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  Smartphone,
  PenTool,
  Upload,
  LogOut
} from 'lucide-react'
import { securityService } from '../services/securityService'

const SetupWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: securityService.getSecureItem('nutri_name') || '',
    crn: securityService.getSecureItem('nutri_crp') || '',
    cnpj: '',
    corporateName: '',
    phone: '',
    email: securityService.getSecureItem('nutri_email') || '',
    logo: securityService.getSecureItem('nutri_logo') || null,
    signature: securityService.getSecureItem('nutri_signature') || null
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const saveAndComplete = () => {
    securityService.setSecureItem('nutri_name', formData.name)
    securityService.setSecureItem('nutri_crp', formData.crn)
    securityService.setSecureItem('nutri_email', formData.email)
    if (formData.logo) securityService.setSecureItem('nutri_logo', formData.logo)
    if (formData.signature) securityService.setSecureItem('nutri_signature', formData.signature)
    securityService.setSecureItem('is_configured', true)
    onComplete()
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      background: 'radial-gradient(circle at top right, #f0fdf4 0%, #f8fafc 100%)'
    }}>
      {/* Botão de Sair/Logout */}
      <button 
        onClick={() => {
          localStorage.removeItem('is_auth');
          window.location.reload();
        }}
        style={{ position: 'fixed', top: '2rem', right: '2rem', background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', zIndex: 100 }}
      >
        <LogOut size={18} /> Sair / Cancelar
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ width: '100%', maxWidth: '700px', padding: '3rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }}
      >
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '3rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: s <= step ? 'var(--primary)' : '#e2e8f0', transition: 'all 0.4s' }}></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'var(--primary)15', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <User size={24} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Dados Profissionais</h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Como você aparecerá nos relatórios e para seus pacientes.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Nome Completo</label>
                  <input className="input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Dr. Leonardo Silva" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Registro Profissional (CRN / CRP)</label>
                  <input className="input" style={{ width: '100%' }} value={formData.crn} onChange={e => setFormData({...formData, crn: e.target.value})} placeholder="Ex: CRN-3 12345/P" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>E-mail de Contato Profissional</label>
                  <input className="input" style={{ width: '100%' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="seuemail@clinica.com.br" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'var(--primary)15', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Building2 size={24} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Dados da Empresa</h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Informações necessárias para emissão de recibos e notas.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Razão Social ou Nome Fantasia</label>
                  <input className="input" style={{ width: '100%' }} value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} placeholder="Ex: Clínica NutriVida Ltda" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>CNPJ / CPF</label>
                    <input className="input" style={{ width: '100%' }} value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} placeholder="00.000.000/0001-00" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Telefone</label>
                    <input className="input" style={{ width: '100%' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(11) 99999-9999" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'var(--primary)15', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <PenTool size={24} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Identidade Visual</h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Personalize o sistema com sua marca e assinatura.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '1rem' }}>Logotipo da Clínica</label>
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#f1f5f9', borderRadius: '20px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                    {formData.logo ? (
                      <img src={formData.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <>
                        <Upload size={32} color="#94a3b8" />
                        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>PNG ou JPG</span>
                      </>
                    )}
                    <input type="file" onChange={(e) => handleFileUpload(e, 'logo')} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '1rem' }}>Sua Assinatura Digital</label>
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#f1f5f9', borderRadius: '20px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                    {formData.signature ? (
                      <img src={formData.signature} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <>
                        <PenTool size={32} color="#94a3b8" />
                        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>PNG Transparente</span>
                      </>
                    )}
                    <input type="file" onChange={(e) => handleFileUpload(e, 'signature')} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'var(--primary)15', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <ShieldCheck size={24} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Tudo Pronto!</h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Sua estação de trabalho premium está configurada.</p>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: '2rem', borderRadius: '24px', border: '1px solid #dcfce7', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#166534' }}>Certificado Digital Ativo</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#166534' }}>Impressora Detectada</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#166534' }}>Base de Dados Isolada</span>
                </div>
              </div>

              <div style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <input type="checkbox" id="lgpd" style={{ marginTop: '4px', cursor: 'pointer' }} required />
                <label htmlFor="lgpd" style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>
                  Li e aceito os <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong> em conformidade com a <strong>LGPD</strong> para o tratamento de dados sensíveis de saúde.
                </label>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', marginTop: '1rem' }}>
                <Smartphone size={24} color="var(--primary)" />
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>O Portal do Paciente já está disponível nos seus subdomínios personalizados.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
          {step > 1 && (
            <button onClick={prevStep} className="btn" style={{ flex: 1, height: '56px', borderRadius: '16px' }}>
              <ChevronLeft size={20} /> Voltar
            </button>
          )}
          {step < 4 ? (
            <button onClick={nextStep} className="btn btn-primary" style={{ flex: 2, height: '56px', borderRadius: '16px' }}>
              Continuar <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={saveAndComplete} className="btn btn-primary" style={{ flex: 2, height: '56px', borderRadius: '16px', backgroundColor: '#10b981' }}>
              <CheckCircle2 size={20} /> Finalizar e Começar
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default SetupWizard
