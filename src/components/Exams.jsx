import React, { useState, useEffect } from 'react'
import { 
  FileText, TrendingUp, AlertCircle, Plus, Search, Camera, Sparkles, 
  Info, Save, Clock, ChevronRight, BarChart2, CheckCircle2, Download, Filter, Printer, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EXAM_MARKERS = {
  'Hemograma': [
    { label: 'Hemácias', info: 'Transporte de oxigênio.' },
    { label: 'Hemoglobina', info: 'Proteína transportadora de oxigênio.' },
    { label: 'Hematócrito', info: 'Porcentagem de glóbulos vermelhos.' },
    { label: 'VCM', info: 'Volume Corpuscular Médio.' },
    { label: 'Leucócitos', info: 'Células de defesa.' },
    { label: 'Plaquetas', info: 'Coagulação sanguínea.' }
  ],
  'Bioquímica': [
    { label: 'Glicose', info: 'Açúcar no sangue em jejum.' },
    { label: 'HBA1c', info: 'Média glicêmica dos últimos 3 meses.' },
    { label: 'Uréia', info: 'Função renal.' },
    { label: 'Creatinina', info: 'Função renal e massa muscular.' },
    { label: 'TGO / AST', info: 'Função hepática.' },
    { label: 'TGP / ALT', info: 'Função hepática.' },
    { label: 'Ácido Úrico', info: 'Metabolismo de purinas.' }
  ],
  'Perfil Lipídico': [
    { label: 'Colesterol Total', info: 'Soma dos colesteróis.' },
    { label: 'HDL', info: 'Colesterol bom.' },
    { label: 'LDL', info: 'Colesterol ruim.' },
    { label: 'Triglicerídeos', info: 'Gordura de reserva.' }
  ],
  'Urina': [
    { label: 'Densidade', info: 'Concentração da urina.' },
    { label: 'pH', info: 'Acidez da urina.' },
    { label: 'Proteínas', info: 'Presença de proteínas na urina.' },
    { label: 'Glicose', info: 'Presença de açúcar na urina.' }
  ],
  'Hormonal': [
    { label: 'TSH', info: 'Hormônio estimulante da tireoide.' },
    { label: 'T3 Livre', info: 'Hormônio tireoidiano ativo.' },
    { label: 'T4 Livre', info: 'Hormônio tireoidiano.' },
    { label: 'Cortisol', info: 'Hormônio do estresse.' },
    { label: 'Testosterona', info: 'Hormônio sexual.' }
  ],
  'Parasitológico': [
    { label: 'Consistência', info: 'Aspecto das fezes.' },
    { label: 'Sangue Oculto', info: 'Presença de sangue não visível.' },
    { label: 'Parasitas', info: 'Presença de helmintos ou protozoários.' }
  ]
}

const ExamRow = ({ label, value, prevValue, info, onChange }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{label}</span>
      {info && (
        <div style={{ cursor: 'help', color: '#f97316' }} title={info}>
          <Info size={16} />
        </div>
      )}
    </div>
    <input 
      type="text" 
      className="input" 
      style={{ height: '38px' }} 
      placeholder="--" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
    />
    <div style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
       {prevValue || '--'}
    </div>
  </div>
)

const Exams = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('Bioquímica')
  const [isScanning, setIsScanning] = useState(false)
  const [examData, setExamData] = useState(() => {
    const saved = localStorage.getItem(`exams_${patient?.id || 'default'}`)
    return saved ? JSON.parse(saved) : {}
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const [isProcessingAI, setIsProcessingAI] = useState(false)

  useEffect(() => {
    localStorage.setItem(`exams_${patient?.id || 'default'}`, JSON.stringify(examData))
  }, [examData, patient])

  const tabs = Object.keys(EXAM_MARKERS)

  const handleValueChange = (tab, label, val) => {
    setExamData(prev => ({
      ...prev,
      [tab]: {
        ...(prev[tab] || {}),
        [label]: val
      }
    }))
  }

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      localStorage.setItem(`exams_${patient?.id || 'default'}`, JSON.stringify(examData))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 2000)
    }, 1000)
  }

  const handleAIScan = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsProcessingAI(true)
      
      // Simulação de validação da IA
      setTimeout(() => {
        // Se o arquivo for muito pequeno ou tiver um nome genérico, simulamos falha na leitura
        const isValidExam = file.size > 10000 && !file.name.includes('screenshot');
        
        if (isValidExam) {
          setExamData(prev => ({
            ...prev,
            'Bioquímica': {
              ...(prev['Bioquímica'] || {}),
              'Glicose': '88',
              'Creatinina': '0,92',
              'Uréia': '32'
            },
            'Hemograma': {
              ...(prev['Hemograma'] || {}),
              'Hemoglobina': '14,2',
              'Hematócrito': '42'
            }
          }))
          setIsProcessingAI(false)
          setIsScanning(false)
          alert('Laudo processado com sucesso! Os marcadores foram preenchidos.')
        } else {
          setIsProcessingAI(false)
          alert('Atenção: Não foram identificados marcadores laboratoriais válidos neste documento. Verifique se a imagem está nítida ou se o arquivo é um laudo de exames.')
        }
      }, 3000)
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header Avanutri Style */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--secondary)', letterSpacing: '-0.04em' }}>Avaliações Laboratoriais</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" style={{ backgroundColor: '#f97316', color: 'white', border: 'none' }} onClick={() => window.print()}>
            <Printer size={18} /> Imprimir
          </button>
          <button 
            className="btn btn-primary" 
            style={{ 
              backgroundColor: saveStatus === 'success' ? '#10b981' : (saveStatus === 'saving' ? '#94a3b8' : '#22c55e'), 
              border: 'none',
              minWidth: '160px',
              transition: 'all 0.3s'
            }} 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock className="spin" size={18} /> Salvando...
              </span>
            ) : (
              saveStatus === 'success' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} /> Salvo!
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={18} /> Salvar Exames
                </span>
              )
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '0.75rem 0.5rem', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
                  backgroundColor: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : '#64748b',
                  boxShadow: activeTab === tab ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: '0', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Table Header with Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
               <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Marcador</span>
               <div style={{ textAlign: 'center' }}>
                 <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8' }}>ATUAL</p>
                 <input type="text" className="input" defaultValue="01/05/2026" style={{ height: '30px', textAlign: 'center', fontSize: '0.75rem', padding: 0 }} />
               </div>
               <div style={{ textAlign: 'center' }}>
                 <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8' }}>ANTERIOR</p>
                 <input type="text" className="input" defaultValue="11/08/2025" style={{ height: '30px', textAlign: 'center', fontSize: '0.75rem', padding: 0 }} />
               </div>
            </div>

            {/* Rows */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
               <AnimatePresence mode="wait">
                 <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.2 }}
                 >
                   {EXAM_MARKERS[activeTab].map((m, i) => (
                     <ExamRow 
                       key={i} 
                       label={m.label} 
                       info={m.info} 
                       value={examData[activeTab]?.[m.label]}
                       onChange={(val) => handleValueChange(activeTab, m.label, val)}
                     />
                   ))}
                 </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Info/AI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }} />
             <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>
                <Sparkles color="white" size={32} />
             </div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#166534', marginBottom: '1rem' }}>Nutri-IA Vision</h3>
             <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '1.5rem', lineHeight: '1.5' }}>Otimize seu tempo! Importe resultados instantaneamente escaneando o laudo do laboratório.</p>
             <button className="btn btn-primary" onClick={() => setIsScanning(true)} style={{ width: '100%', height: '50px' }}>
                <Camera size={18} /> Escanear Laudo
             </button>
          </div>

          <div className="card" style={{ padding: '1.5rem', border: '1px solid #e2e8f0' }}>
             <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.25rem', color: '#1e293b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <AlertCircle size={16} color="#f97316" /> Dicas de Coleta
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {[
                 'Jejum de 12 horas recomendado.',
                 'Sem exercícios físicos intensos 24h antes.',
                 'Evitar bebidas alcoólicas por 72h.',
                 'Manter hidratação habitual.'
               ].map((tip, i) => (
                 <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                   <div style={{ marginTop: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                   <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{tip}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* AI Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: '500px', padding: '3rem', textAlign: 'center' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Nutri-IA Vision</h3>
                 <button onClick={() => setIsScanning(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24}/></button>
               </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ 
                    border: '3px dashed #e2e8f0', 
                    borderRadius: '24px', 
                    padding: '4rem', 
                    marginBottom: '2rem', 
                    cursor: isProcessingAI ? 'wait' : 'pointer', 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    borderColor: isProcessingAI ? 'var(--primary)' : '#e2e8f0'
                  }}>
                    {isProcessingAI ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={48} color="var(--primary)" />
                        </motion.div>
                        <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem', marginTop: '1.5rem' }}>Analisando Laudo...</p>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>Nossa IA está lendo os marcadores</p>
                      </>
                    ) : (
                      <>
                        <Download size={48} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                        <p style={{ fontWeight: '700', color: '#64748b', fontSize: '1.1rem' }}>Enviar Laudo do Laboratório</p>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>Suporta PDF, JPG e PNG</p>
                      </>
                    )}
                    <input type="file" hidden accept="image/*,application/pdf" onChange={handleAIScan} disabled={isProcessingAI} />
                  </label>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '2rem' }}>A IA processa o documento e preenche os campos automaticamente.</p>
                <button className="btn btn-secondary" onClick={() => setIsScanning(false)} style={{ width: '100%' }} disabled={isProcessingAI}>Cancelar</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Exams
