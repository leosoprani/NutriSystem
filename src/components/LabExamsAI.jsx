import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Brain, AlertCircle, CheckCircle, Info, Sparkles, Send, FileText, Activity } from 'lucide-react'

const LabExamsAI = ({ patient }) => {
  const [analyzing, setAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [exams, setExams] = useState({
    glicemia: '95',
    colesterol: '210',
    vitaminaD: '22',
    ferritina: '45'
  })

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setShowResult(true)
    }, 2500)
  }

  const handleSimulateScan = () => {
    setAnalyzing(true)
    setExams({ glicemia: '', colesterol: '', vitaminaD: '', ferritina: '' }) // Clear first
    setTimeout(() => {
      setExams({
        glicemia: '105',
        colesterol: '195',
        vitaminaD: '18',
        ferritina: '32'
      })
      setAnalyzing(false)
      setShowResult(true)
      alert('Dados extraídos do PDF com sucesso pela IA NutriSystem!')
    }, 3000)
  }

  const analysisData = [
    { label: 'Glicemia', value: '95 mg/dL', status: 'Normal', desc: 'Níveis dentro da faixa de normalidade. Manter ingestão controlada de carboidratos complexos.' },
    { label: 'Colesterol Total', value: '210 mg/dL', status: 'Alerta', desc: 'Levemente elevado. Sugere-se aumentar o aporte de fibras solúveis e Ômega-3.' },
    { label: 'Vitamina D', value: '22 ng/mL', status: 'Crítico', desc: 'Nível de insuficiência detectado. Recomendado suplementação de 2.000 UI a 5.000 UI/dia conforme exposição solar.' },
    { label: 'Ferritina', value: '45 ng/mL', status: 'Normal', desc: 'Dentro do limite, mas próximo ao limite inferior para atletas. Monitorar ingestão de fontes de ferro heme.' }
  ]

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Interpretador de Exames <span style={{ color: 'var(--primary)' }}>AI</span></h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Análise bioquímica avançada para: <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{patient?.name}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
            onClick={handleSimulateScan}
            disabled={analyzing}
          >
            <FileText size={18} /> {analyzing ? 'Escaneando...' : 'Simular Scanner PDF'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
        {/* Formulário de Entrada */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FlaskConical color="var(--primary)" /> Valores Bioquímicos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.keys(exams).map(key => (
              <div key={key} className="form-group">
                <label style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                <input 
                  className="input" 
                  value={exams[key]} 
                  onChange={e => setExams({...exams, [key]: e.target.value})}
                  placeholder="Insira o valor..."
                />
              </div>
            ))}
            <button 
              className="btn btn-primary" 
              onClick={handleAnalyze} 
              disabled={analyzing}
              style={{ width: '100%', height: '56px', marginTop: '1rem' }}
            >
              {analyzing ? 'Analisando com IA...' : <><Brain size={20} /> Analisar com Inteligência Artificial</>}
            </button>
          </div>
        </div>

        {/* Resultados da IA */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {!showResult && !analyzing && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '32px' }}
              >
                <Sparkles size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                <p style={{ maxWidth: '300px' }}>Insira os valores dos exames para receber a interpretação e sugestão de conduta da IA.</p>
              </motion.div>
            )}

            {analyzing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '60px', height: '60px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '2rem' }}
                />
                <h4 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--secondary)' }}>Processando dados...</h4>
                <p style={{ color: '#64748b' }}>A IA está consultando as bases científicas mais recentes.</p>
              </motion.div>
            )}

            {showResult && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--primary)', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)' }}>
                  <Sparkles size={24} />
                  <p style={{ fontWeight: 'bold' }}>Análise concluída com sucesso. Veja as sugestões abaixo.</p>
                </div>

                {analysisData.map((res, i) => (
                  <div key={i} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '900' }}>{res.label}</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>({res.value})</span>
                      </div>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '50px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        backgroundColor: res.status === 'Normal' ? '#dcfce7' : (res.status === 'Alerta' ? '#fef3c7' : '#fee2e2'),
                        color: res.status === 'Normal' ? '#166534' : (res.status === 'Alerta' ? '#92400e' : '#991b1b')
                      }}>{res.status}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>{res.desc}</p>
                  </div>
                ))}

                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                  <Send size={18} /> Enviar Relatório para o Paciente
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default LabExamsAI
