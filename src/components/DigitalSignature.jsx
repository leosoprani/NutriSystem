import React, { useState } from 'react'
import { PenTool, FileText, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DigitalSignature = ({ patient }) => {
  const [signing, setSigning] = useState(false)
  const [signature, setSignature] = useState(null)
  const [documentType, setDocumentType] = useState('LGPD')
  
  const documents = [
    { id: 1, type: 'Termo de Consentimento LGPD', status: 'Assinado', date: '25/04/2026' },
    { id: 2, type: 'Contrato de Acompanhamento Nutricional', status: 'Pendente', date: 'Aguardando' }
  ]

  const handleSign = () => {
    setSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')
    setSigning(false)
    alert('Documento assinado digitalmente com sucesso!')
  }

  if (!patient) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Selecione um paciente para gerenciar assinaturas digitais.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Assinatura Digital</h3>
          <button className="btn btn-primary" onClick={() => setSigning(true)}>
            <PenTool size={18} /> Novo Documento
          </button>
        </div>

        <div className="card" style={{ padding: '0' }}>
          {documents.map(doc => (
            <div key={doc.id} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '12px' }}>
                  <FileText size={20} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '1rem' }}>{doc.type}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Emitido em: {doc.date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="badge" style={{ 
                  backgroundColor: doc.status === 'Assinado' ? '#dcfce7' : '#fee2e2',
                  color: doc.status === 'Assinado' ? '#166534' : '#991b1b'
                }}>
                  {doc.status}
                </span>
                <button className="btn" style={{ padding: '8px' }}><Download size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card glass">
        <h4 style={{ marginBottom: '1rem' }}>Segurança e Validade</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Todas as assinaturas coletadas possuem carimbo de tempo (Timestamp) e registro de IP do dispositivo, garantindo validade jurídica conforme a MP 2.200-2/2001.
        </p>
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>LOG DE AUDITORIA:</p>
          <p style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>IP: 187.45.XXX.XXX</p>
          <p style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>HASH: 8f2d9e1...a341</p>
        </div>
      </div>

      <AnimatePresence>
        {signing && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="card" style={{ width: '500px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PenTool size={24} color="var(--primary)" /> Assinar Documento
                </h3>
                <button onClick={() => setSigning(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Selecione o Documento</label>
                <select className="input" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                  <option>Termo de Consentimento LGPD</option>
                  <option>Contrato de Prestação de Serviços</option>
                  <option>Autorização de Uso de Imagem</option>
                </select>
              </div>

              <div style={{ backgroundColor: '#f1f5f9', border: '2px dashed #cbd5e1', height: '200px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Assine aqui usando o mouse ou tela touch</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => setSigning(false)}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSign}>Confirmar Assinatura</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DigitalSignature
