import React, { useState } from 'react'
import { Pill, Plus, Trash2, Send, Clock, Info, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SupplementItem = ({ name, dosage, timing, notes }) => (
  <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--accent)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ backgroundColor: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0369a1' }}>
          <Pill size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{name}</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>{dosage}</span> • {timing}
          </p>
          {notes && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Info size={12} /> {notes}
            </p>
          )}
        </div>
      </div>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
        <Trash2 size={18} />
      </button>
    </div>
  </div>
)

const Supplementation = ({ patient, patients, onSelectPatient, onSave }) => {
  const [supplements, setSupplements] = useState([
    { type: 'individual', name: 'Creatina Monohidratada', dosage: '5g', timing: 'Pós-treino ou com a maior refeição', notes: 'Tomar todos os dias, inclusive fins de semana.' },
    { type: 'formula', name: 'Pool de Antioxidantes', components: ['Coenzima Q10 - 100mg', 'Resveratrol - 50mg', 'Vitamina C - 500mg'], dosage: '1 cápsula', timing: 'Após o café da manhã', notes: 'Manipular em cápsulas vegetais.' },
    { type: 'individual', name: 'Whey Protein Isolado', dosage: '30g', timing: 'Lanche da tarde ou pós-treino', notes: 'Misturar com 200ml de água ou leite desnatado.' }
  ])
  const [showModal, setShowModal] = useState(false)
  const [newSup, setNewSup] = useState({ type: 'individual', name: '', dosage: '', timing: '', notes: '', components: '' })

  const handleSendWhatsApp = () => {
    const phone = patient?.phone || '5500000000000'
    const appLink = window.location.origin
    const text = encodeURIComponent(`Olá ${patient?.name || 'Paciente'}, aqui está sua prescrição de suplementação:\n\n` + 
      supplements.map(s => `*${s.name}*\n- Dosagem: ${s.dosage}\n- Horário: ${s.timing}\n`).join('\n') +
      `\n🚀 Acesse seu aplicativo aqui: ${appLink}\n\n` +
      `Qualquer dúvida, conte comigo!`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  const handleAdd = () => {
    if (newSup.name && newSup.dosage) {
      setSupplements([...supplements, newSup])
      setNewSup({ name: '', dosage: '', timing: '', notes: '' })
      setShowModal(false)
    }
  }

  const handleDelete = (index) => {
    setSupplements(supplements.filter((_, i) => i !== index))
  }

  if (!patient) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Pill size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Prescrição de Suplementos</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Selecione um paciente para gerenciar a suplementação e enviar prescrições via WhatsApp.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {patients?.map(p => (
              <button key={p.id} onClick={() => onSelectPatient(p)} className="hover-bg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{p.name.charAt(0)}</div>
                  <div style={{ textAlign: 'left' }}><p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{p.name}</p></div>
                </div>
                <ArrowRight size={18} color="var(--primary)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>Prescrição de Suplementos - {patient.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Defina a estratégia de suplementação do paciente.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{ backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleSendWhatsApp}
          >
            <Send size={18} /> Enviar via WhatsApp
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Novo Suplemento
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {supplements.map((s, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0369a1' }}>
                    <Pill size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{s.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>{s.dosage}</span> • {s.timing}
                    </p>
                    {s.type === 'formula' && s.components && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>COMPOSIÇÃO:</p>
                        {s.components.map((comp, ci) => (
                          <div key={ci} style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                            {comp}
                          </div>
                        ))}
                      </div>
                    )}
                    {s.notes && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Info size={12} /> {s.notes}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card glass">
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--primary)" /> Cronograma Diário
          </h4>
          <div style={{ fontSize: '0.875rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #e2e8f0' }}>
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.9rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              <p style={{ fontWeight: 'bold' }}>Manhã</p>
              <p style={{ color: 'var(--text-muted)' }}>Multivitamínico</p>
            </div>
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.9rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <p style={{ fontWeight: 'bold' }}>Tarde</p>
              <p style={{ color: 'var(--text-muted)' }}>Whey Protein + Creatina</p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.9rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
              <p style={{ fontWeight: 'bold' }}>Noite</p>
              <p style={{ color: 'var(--text-muted)' }}>Ômega 3</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '450px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Novo Suplemento</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <button 
                    className="btn" 
                    style={{ flex: 1, backgroundColor: newSup.type === 'individual' ? 'var(--secondary)' : '#f1f5f9', color: newSup.type === 'individual' ? 'white' : '#64748b', height: '40px', fontSize: '0.8rem' }}
                    onClick={() => setNewSup({...newSup, type: 'individual'})}
                  >
                    Individual
                  </button>
                  <button 
                    className="btn" 
                    style={{ flex: 1, backgroundColor: newSup.type === 'formula' ? 'var(--secondary)' : '#f1f5f9', color: newSup.type === 'formula' ? 'white' : '#64748b', height: '40px', fontSize: '0.8rem' }}
                    onClick={() => setNewSup({...newSup, type: 'formula'})}
                  >
                    Fórmula
                  </button>
                </div>

                <div><label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{newSup.type === 'individual' ? 'Nome do Suplemento' : 'Nome da Fórmula'}</label><input className="input" style={{ width: '100%' }} value={newSup.name} onChange={e => setNewSup({...newSup, name: e.target.value})} placeholder={newSup.type === 'individual' ? "ex: Creatina" : "ex: Pool de Antioxidantes"} /></div>
                
                {newSup.type === 'formula' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Composição (um por linha)</label>
                    <textarea className="input" style={{ width: '100%', minHeight: '100px' }} value={newSup.components} onChange={e => setNewSup({...newSup, components: e.target.value})} placeholder="ex: Coenzima Q10 - 100mg&#10;Resveratrol - 50mg" />
                  </div>
                )}

                <div><label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Dosagem</label><input className="input" style={{ width: '100%' }} value={newSup.dosage} onChange={e => setNewSup({...newSup, dosage: e.target.value})} placeholder="ex: 5g ou 1 cápsula" /></div>
                <div><label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Horário/Instrução</label><input className="input" style={{ width: '100%' }} value={newSup.timing} onChange={e => setNewSup({...newSup, timing: e.target.value})} placeholder="ex: Pós-treino" /></div>
                <div><label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Observações</label><textarea className="input" style={{ width: '100%', minHeight: '60px' }} value={newSup.notes} onChange={e => setNewSup({...newSup, notes: e.target.value})} placeholder="Dicas adicionais..." /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Salvar Suplemento</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Supplementation
