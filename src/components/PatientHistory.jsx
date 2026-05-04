import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, 
  Calendar, 
  Activity, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  ClipboardList, 
  Activity as ActivityIcon,
  Apple,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Search,
  Filter,
  Sparkles,
  X
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell
} from 'recharts'

const PatientHistory = ({ patient }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  if (!patient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '24px', border: '2px dashed var(--border)' }}>
        <History size={64} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
        <h3 style={{ color: 'var(--text-muted)' }}>Nenhum paciente selecionado</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginTop: '0.5rem' }}>Selecione um paciente na lista para visualizar o histórico clínico completo e as métricas de evolução.</p>
      </div>
    )
  }

  // Dados Mockados para demonstração caso o paciente não tenha dados reais ainda
  const chartData = [
    { date: 'Jan', peso: 85, gordura: 28, massa: 58, adesao: 65 },
    { date: 'Fev', peso: 83.5, gordura: 26.5, massa: 58.5, adesao: 78 },
    { date: 'Mar', peso: 82, gordura: 25, massa: 59, adesao: 82 },
    { date: 'Abr', peso: 80.5, gordura: 23.5, massa: 60, adesao: 90 },
  ]

  const rankingData = [
    { name: 'Peso', value: -4.5, unit: 'kg', improved: true },
    { name: 'Gordura', value: -4.5, unit: '%', improved: true },
    { name: 'Massa Magra', value: +2.0, unit: 'kg', improved: true },
    { name: 'Adesão', value: +25, unit: '%', improved: true },
  ]

  const consultations = [
    { 
      id: 1, 
      date: '25/04/2026', 
      type: 'Consulta de Retorno', 
      summary: 'Paciente apresentou excelente evolução. Redução significativa de percentual de gordura e ganho de massa magra consistente.',
      metrics: { weight: 80.5, fat: 23.5, adherence: 90 },
      status: 'improved'
    },
    { 
      id: 2, 
      date: '25/03/2026', 
      type: 'Acompanhamento Mensal', 
      summary: 'Ajuste no plano alimentar para aumentar o aporte proteico. Paciente relatou maior disposição nos treinos.',
      metrics: { weight: 82, fat: 25, adherence: 82 },
      status: 'stable'
    },
    { 
      id: 3, 
      date: '25/02/2026', 
      type: 'Consulta Inicial', 
      summary: 'Definição de metas e primeiro plano alimentar. Foco em reeducação e organização da rotina.',
      metrics: { weight: 85, fat: 28, adherence: 65 },
      status: 'initial'
    }
  ]

  // Mock de dados por categoria
  const categoryDetails = {
    'Exames': [
      { id: 1, date: '10/04/2026', title: 'Hemograma Completo', result: 'Normal', note: 'Glicemia em 88mg/dL. Perfil lipídico excelente.' },
      { id: 2, date: '15/01/2026', title: 'Bioquímica do Sangue', result: 'Alerta', note: 'Vitamina D levemente baixa (28 ng/mL).' }
    ],
    'Antropometria': [
      { id: 1, date: '25/04/2026', title: 'Avaliação Retorno Abr', result: 'Melhora', note: 'Redução de dobra abdominal de 18mm para 15mm.' },
      { id: 2, date: '25/03/2026', title: 'Avaliação Março', result: 'Melhora', note: 'Ganho de 400g de massa magra nos membros superiores.' }
    ],
    'Planos Alimentares': [
      { id: 1, date: '25/04/2026', title: 'Plano Hipertrofia v2', result: 'Ativo', note: 'Inclusão de carboidratos complexos no pré-treino.' },
      { id: 2, date: '25/02/2026', title: 'Plano Inicial Transição', result: 'Inativo', note: 'Foco em adaptação palatável.' }
    ],
    'Anamneses': [
      { id: 1, date: '25/02/2026', title: 'Anamnese de Admissão', result: 'Concluído', note: 'Paciente relata sono regular e intestino funcional.' }
    ]
  }

  const handlePointClick = (data) => {
    if (data && data.activePayload) {
      setSelectedPoint(data.activePayload[0].payload)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Resumo de Evolução / Ranking */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {rankingData.map((item, i) => (
          <div key={i} className="card glass" style={{ borderLeft: `4px solid ${item.improved ? '#10b981' : '#ef4444'}` }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.name}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '0.5rem 0' }}>
              <h3 style={{ fontSize: '1.75rem' }}>{item.value > 0 ? '+' : ''}{item.value}{item.unit}</h3>
              {item.improved ? <ArrowUpRight size={18} color="#10b981" /> : <ArrowDownRight size={18} color="#ef4444" />}
            </div>
            <p style={{ fontSize: '0.7rem', color: item.improved ? '#10b981' : '#ef4444', fontWeight: '600' }}>
              {item.improved ? 'Melhora' : 'Atenção'} desde o início
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Gráficos de Evolução */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} color="var(--primary)" /> Evolução de Composição</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>* Clique nos pontos para ver detalhes</span>
              </div>
            </div>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} onClick={handlePointClick}>
                  <defs>
                    <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="peso" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPeso)" activeDot={{ r: 8, onClick: (e, payload) => setSelectedPoint(payload.payload) }} />
                  <Area type="monotone" dataKey="gordura" stroke="#ef4444" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={20} color="#f59e0b" /> Adesão ao Plano por Consulta</h3>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="adesao" radius={[6, 6, 0, 0]} onClick={(data) => setSelectedPoint(data)}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.adesao > 80 ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Timeline de Consultas */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Resumo de Consultas</h3>
            <div style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}><Filter size={16} color="var(--text-muted)" /></div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#f1f5f9' }}></div>
            
            {consultations.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedConsultation(c)}
                style={{ 
                  display: 'flex', 
                  gap: '1.25rem', 
                  cursor: 'pointer', 
                  position: 'relative',
                  padding: '0.5rem',
                  borderRadius: '12px',
                  transition: 'background 0.2s',
                  backgroundColor: selectedConsultation?.id === c.id ? '#f8fafc' : 'transparent'
                }}
                className="hover-bg"
              >
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: c.status === 'improved' ? '#dcfce7' : '#f1f5f9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 1,
                  color: c.status === 'improved' ? '#166534' : '#64748b'
                }}>
                  {c.id === 1 ? <TrendingUp size={16} /> : <Calendar size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{c.type}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.date}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedConsultation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--primary)' }}>Análise da Consulta - {selectedConsultation.date}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peso</p>
                  <p style={{ fontWeight: '700' }}>{selectedConsultation.metrics.weight} kg</p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Adesão</p>
                  <p style={{ fontWeight: '700', color: '#10b981' }}>{selectedConsultation.metrics.adherence}%</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: '1.6', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {selectedConsultation.summary}
              </p>
            </motion.div>
          )}
        </div>

      </div>

      {/* Histórico por Categoria */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Histórico por Categoria (Clique para ver detalhes)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { label: 'Exames', icon: FileText, count: 5, last: 'há 2 semanas', color: '#3b82f6' },
            { label: 'Antropometria', icon: ActivityIcon, count: 8, last: 'ontem', color: '#10b981' },
            { label: 'Planos Alimentares', icon: Apple, count: 4, last: 'há 1 mês', color: '#f59e0b' },
            { label: 'Anamneses', icon: ClipboardList, count: 2, last: 'há 6 meses', color: '#8b5cf6' },
          ].map((cat, i) => (
            <div key={i} className="hover-bg" onClick={() => setSelectedCategory(cat.label)} style={{ padding: '1.25rem', borderRadius: '16px', border: selectedCategory === cat.label ? '2px solid ' + cat.color : '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: `${cat.color}15`, color: cat.color, padding: '0.75rem', borderRadius: '12px' }}>
                <cat.icon size={20} />
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{cat.label}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat.count} registros</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modais de Detalhes */}
      <AnimatePresence>
        {selectedCategory && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <History size={24} color="var(--primary)" /> Histórico de {selectedCategory}
                </h3>
                <button onClick={() => setSelectedCategory(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categoryDetails[selectedCategory]?.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' }}
                    className="hover-bg"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)' }}>{item.date}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{item.result}</span>
                    </div>
                    <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>{item.title}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.note}</p>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>Ver Detalhes <ArrowUpRight size={12} /></span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setSelectedCategory(null)}>Fechar</button>
            </motion.div>
          </div>
        )}

        {/* Modal de Detalhe Específico do Item */}
        {selectedItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card" style={{ width: '600px', padding: '3rem', borderRadius: '32px', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.45)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2.5rem' }}>
                <div>
                  <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: 'var(--primary)15', color: 'var(--primary)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    {selectedCategory}
                  </span>
                  <h2 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>{selectedItem.title}</h2>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem' }}>
                    <Calendar size={16} /> Realizado em {selectedItem.date}
                  </p>
                </div>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={28}/></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Status / Resultado</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: selectedItem.result === 'Normal' || selectedItem.result === 'Melhora' ? '#10b981' : '#f59e0b' }}>
                    {selectedItem.result}
                  </p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tipo de Registro</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--secondary)' }}>{selectedCategory}</p>
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '1rem' }}>Observações Detalhadas</p>
                <div style={{ padding: '2rem', backgroundColor: '#f0fdf4', borderRadius: '24px', border: '1px solid #dcfce7', position: 'relative', overflow: 'hidden' }}>
                  <Sparkles size={20} color="#10b981" style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '1rem', color: '#166534', lineHeight: '1.8', fontStyle: 'italic' }}>
                    "{selectedItem.note}"
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, height: '56px', borderRadius: '16px' }} onClick={() => setSelectedItem(null)}>Voltar para a Lista</button>
                <button className="btn btn-primary" style={{ flex: 1, height: '56px', borderRadius: '16px' }} onClick={() => { alert('Exportando relatório detalhado...'); setSelectedItem(null); }}>
                  <FileText size={20} /> Exportar Relatório
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedPoint && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="card" style={{ width: '400px', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <ActivityIcon size={32} />
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Métricas de {selectedPoint.date}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Resumo detalhado dos indicadores</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peso</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>{selectedPoint.peso} kg</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gordura</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ef4444' }}>{selectedPoint.gordura}%</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Massa Magra</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>{selectedPoint.massa} kg</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Adesão</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f59e0b' }}>{selectedPoint.adesao}%</p>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSelectedPoint(null)}>Voltar ao Histórico</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientHistory
