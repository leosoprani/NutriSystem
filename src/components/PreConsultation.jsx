import React, { useState } from 'react'
import { ClipboardList, Send, CheckCircle, Clock, FileText, ChevronRight, MessageSquare, Plus, Trash2, Edit3, Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PreConsultation = ({ patient }) => {
  const [view, setView] = useState('list') // 'list' or 'builder'
  const [categories, setCategories] = useState([
    { id: 1, name: 'Questionário Pré-Atendimento (Emagrecimento)', questions: ['Hábitos alimentares atuais?', 'Compulsões detectadas?', 'Uso de medicamentos?'] },
    { id: 2, name: 'Protocolo de Nutrição Esportiva', questions: ['Rotina de treinos?', 'Suplementação atual?', 'Objetivos de performance?'] },
    { id: 3, name: 'Ficha Clínica (Doenças Crônicas)', questions: ['Patologias diagnosticadas?', 'Histórico familiar?', 'Alergias?'] },
    { id: 4, name: 'Recordatório 24 Horas', questions: ['Café da manhã?', 'Lanche?', 'Almoço?', 'Jantar?', 'Ceia?'] }
  ])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [newQuestion, setNewQuestion] = useState('')

  const [sentForms, setSentForms] = useState([
    { id: 1, title: 'Anamnese Geral', status: 'Respondido', date: '25/04/2026' }
  ])

  const addCategory = () => {
    if (!newCategoryName) return
    const newCat = { id: Date.now(), name: newCategoryName, questions: [] }
    setCategories([...categories, newCat])
    setNewCategoryName('')
  }

  const addQuestion = (catId) => {
    if (!newQuestion) return
    setCategories(categories.map(cat => 
      cat.id === catId ? { ...cat, questions: [...cat.questions, newQuestion] } : cat
    ))
    setNewQuestion('')
  }

  const removeQuestion = (catId, qIndex) => {
    setCategories(categories.map(cat => 
      cat.id === catId ? { ...cat, questions: cat.questions.filter((_, i) => i !== qIndex) } : cat
    ))
  }

  const editCategory = (cat) => {
    setActiveCategory(cat)
    setNewCategoryName(cat.name)
    setView('builder')
  }

  const handleSend = (title) => {
    const phone = patient?.phone || '5500000000000'
    const link = `https://nutrisystem.app/form/${Math.random().toString(36).substring(7)}`
    const message = `Olá ${patient?.name || 'Paciente'}! 👋\n\nPara agilizarmos sua consulta, por favor preencha este formulário: ${link}\n\n*Passo a passo:*\n1. Clique no link acima.\n2. Responda as perguntas (leva apenas 3 min).\n3. Ao final, clique em "Enviar" e eu receberei aqui na hora.\n\nObrigado(a)!`
    const text = encodeURIComponent(message)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
    setSentForms([{ id: Date.now(), title, status: 'Enviado', date: 'Hoje' }, ...sentForms])
    setView('list')
  }

  if (!patient && view === 'list') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Selecione um paciente ou gerencie seus modelos abaixo.</p>
        <button className="btn btn-primary" onClick={() => { setView('builder'); setActiveCategory(null); setNewCategoryName(''); }} style={{ marginTop: '1rem' }}>
          Criar Novo Modelo
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>{view === 'list' ? 'Seus Questionários' : activeCategory ? 'Editando Formulário' : 'Criar Novo Formulário'}</h3>
          <button 
            className="btn" 
            style={{ backgroundColor: view === 'list' ? 'var(--primary)' : '#f1f5f9', color: view === 'list' ? 'white' : 'var(--text)' }}
            onClick={() => {
              if (view === 'list') {
                setView('builder')
                setActiveCategory(null)
                setNewCategoryName('')
              } else {
                setView('list')
              }
            }}
          >
            {view === 'list' ? <Plus size={18} /> : <X size={18} />} {view === 'list' ? 'Criar Personalizado' : 'Cancelar'}
          </button>
        </div>

        {view === 'list' ? (
          <div>
            {categories.map((cat) => (
              <div key={cat.id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div 
                  style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', flex: 1 }}
                  onClick={() => editCategory(cat)}
                >
                  <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '12px' }}>
                    <ClipboardList size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{cat.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.questions.length} perguntas • Clique para editar</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" style={{ backgroundColor: '#f1f5f9', padding: '8px' }} onClick={() => editCategory(cat)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="btn" style={{ backgroundColor: 'var(--primary)', color: 'white' }} onClick={() => handleSend(cat.name)}>
                    <Send size={16} /> Enviar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card glass">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nome da Categoria</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Ex: Histórico Familiar" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addCategory}>Adicionar</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {categories
                .filter(cat => !activeCategory || cat.id === activeCategory.id)
                .map(cat => (
                <div key={cat.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{cat.name}</h4>
                    <button 
                      className="btn" 
                      style={{ color: '#ef4444', padding: '4px' }}
                      onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {cat.questions.map((q, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.875rem' }}>{q}</span>
                        <button onClick={() => removeQuestion(cat.id, idx)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={14}/></button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Nova pergunta..." 
                      style={{ height: '36px', fontSize: '0.875rem' }}
                      value={activeCategory?.id === cat.id ? newQuestion : ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addQuestion(cat.id)
                        }
                      }}
                      onChange={(e) => {
                        setNewQuestion(e.target.value)
                        setActiveCategory(cat)
                      }}
                    />
                    <button className="btn" style={{ backgroundColor: '#f1f5f9' }} onClick={() => addQuestion(cat.id)}><Plus size={16}/></button>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setView('list')}>
              <Save size={18} /> Salvar Todos os Modelos
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Histórico de Envios</h3>
        <div className="card" style={{ padding: '0' }}>
          {sentForms.map(form => (
            <div key={form.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{form.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.date}</p>
              </div>
              <span className="badge" style={{ 
                backgroundColor: form.status === 'Respondido' ? '#dcfce7' : '#fef9c3',
                color: form.status === 'Respondido' ? '#166534' : '#854d0e'
              }}>
                {form.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PreConsultation
