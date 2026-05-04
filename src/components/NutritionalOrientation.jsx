import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, CheckCircle2, AlertCircle, Plus, Search, ChevronRight, X, Send, Save, Printer } from 'lucide-react'

const INITIAL_ORIENTATIONS = {
  'Geral': {
    recommendations: [
      'Aumentar o fracionamento da dieta (6 refeições/dia)',
      'Reduzir o volume das refeições',
      'Mastigar bastante os alimentos',
      'Alimentar-se em ambiente tranquilo',
      'Ingerir líquidos em quantidade adequada (2L/dia)'
    ],
    avoid: [
      'Alimentos flatulentos (repolho, batata-doce, feijão)',
      'Refrigerantes e bebidas gaseificadas',
      'Alimentos ricos em enxofre (milho, cebola, couve)',
      'Frituras e gorduras em excesso'
    ]
  },
  'Colostomia': {
    description: 'A Colostomia é uma abertura da parede cólica para eliminação de dejetos.',
    recommendations: [
      'Aumentar o fracionamento para 6-8 refeições pequenas',
      'Consumir vegetais cozidos e sem casca/semente',
      'Manter hidratação rigorosa (8-10 copos de água)',
      'Introduzir novos alimentos um a um para observar tolerância'
    ],
    avoid: [
      'Alimentos que causam odor forte (ovos, aspargos, alho)',
      'Alimentos que causam gases (brócolis, repolho, leguminosas)',
      'Bebidas gaseificadas e canudos (ingerir ar)'
    ]
  },
  'Diabetes': {
    description: 'Orientação para controle glicêmico e prevenção de complicações.',
    recommendations: [
      'Priorizar alimentos integrais e ricos em fibras',
      'Fracionar o consumo de frutas ao longo do dia',
      'Associar carboidratos a fibras, proteínas ou gorduras boas',
      'Praticar atividade física regularmente'
    ],
    avoid: [
      'Açúcares refinados, doces e mel',
      'Farinhas brancas e produtos de panificação refinados',
      'Sucos de fruta coados e refrigerantes comuns'
    ]
  },
  'Hipertensão': {
    description: 'Dieta focada na redução da pressão arterial (Padrão DASH).',
    recommendations: [
      'Reduzir drasticamente o uso de sal de cozinha',
      'Utilizar temperos naturais (limão, ervas, alho, cebola)',
      'Aumentar o consumo de alimentos ricos em potássio',
      'Consumir laticínios magros e carnes brancas'
    ],
    avoid: [
      'Embutidos (presunto, mortadela, peito de peru)',
      'Alimentos industrializados ultraprocessados',
      'Temperos prontos em cubos ou pó (ricos em sódio)'
    ]
  },
  'Gastrite / Refluxo': {
    description: 'Orientações para proteção da mucosa gástrica e redução de azia.',
    recommendations: [
      'Fazer refeições pequenas e frequentes',
      'Evitar deitar-se logo após as refeições (esperar 2h)',
      'Elevar a cabeceira da cama se houver refluxo noturno',
      'Preferir preparações cozidas, assadas ou grelhadas'
    ],
    avoid: [
      'Café, chá preto, mate e bebidas com cafeína',
      'Frutas cítricas e molho de tomate em crises',
      'Pimenta, condimentos picantes e frituras',
      'Chicletes e balas (estimulam secreção ácida)'
    ]
  },
  'Constipação': {
    description: 'Estratégia para melhora do trânsito intestinal e saúde da microbiota.',
    recommendations: [
      'Aumentar o consumo de fibras (mínimo 25g/dia)',
      'Ingerir água abundantemente (fundamental para a fibra agir)',
      'Consumir frutas com casca e bagaço (ameixa, mamão, laranja)',
      'Incluir sementes como linhaça e chia'
    ],
    avoid: [
      'Alimentos refinados (arroz branco, pão francês)',
      'Frutas constipantes (banana prata, maçã sem casca, goiaba)',
      'Consumo insuficiente de água durante o dia'
    ]
  },
  'Emagrecimento': {
    description: 'Foco em densidade nutricional, saciedade e balanço calórico negativo.',
    recommendations: [
      'Iniciar as refeições principais por um prato de salada',
      'Priorizar proteínas magras em todas as refeições',
      'Beber 500ml de água 30 min antes das refeições principais',
      'Dormir pelo menos 7-8h por noite para regulação hormonal'
    ],
    avoid: [
      'Calorias líquidas (sucos açucarados, refrigerantes, álcool)',
      'Beliscos ao longo do dia sem planejamento',
      'Alimentos com alta densidade calórica e baixa saciedade'
    ]
  },
  'Hipertrofia': {
    description: 'Estratégia para ganho de massa muscular com aporte proteico adequado.',
    recommendations: [
      'Garantir aporte de 1.6g a 2.2g de proteína por kg de peso',
      'Distribuir a proteína de forma equilibrada no dia',
      'Consumir carboidratos complexos no pré e pós-treino',
      'Não pular refeições para manter o estado anabólico'
    ],
    avoid: [
      'Longos períodos de jejum sem orientação',
      'Substituir refeições sólidas apenas por shakes',
      'Consumo excessivo de gorduras saturadas'
    ]
  },
  'Intolerância à Lactose': {
    description: 'Substituições para pacientes com sensibilidade ao açúcar do leite.',
    recommendations: [
      'Utilizar versões "Zero Lactose" ou extratos vegetais',
      'Consumir queijos curados (parmesão, reino) que têm menos lactose',
      'Testar tolerância a iogurtes naturais (fermentação reduz lactose)',
      'Ler rótulos buscando termos como: soro de leite, caseína'
    ],
    avoid: [
      'Leite de vaca integral ou desnatado comum',
      'Doces à base de leite (leite condensado, creme de leite)',
      'Manteiga e margarinas com leite na composição'
    ]
  }
}

const NutritionalOrientation = ({ patient }) => {
  const [orientations, setOrientations] = useState(() => {
    const saved = localStorage.getItem('clinical_orientations')
    return saved ? JSON.parse(saved) : INITIAL_ORIENTATIONS
  })
  
  const [selectedCondition, setSelectedCondition] = useState('Geral')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [newOrientation, setNewOrientation] = useState({
    title: '',
    description: '',
    recommendations: '',
    avoid: ''
  })

  useEffect(() => {
    localStorage.setItem('clinical_orientations', JSON.stringify(orientations))
  }, [orientations])

  const handleAddOrientation = () => {
    if (!newOrientation.title) return
    
    const formatted = {
      description: newOrientation.description,
      recommendations: newOrientation.recommendations.split('\n').filter(i => i.trim()),
      avoid: newOrientation.avoid.split('\n').filter(i => i.trim())
    }
    
    setOrientations({ ...orientations, [newOrientation.title]: formatted })
    setSelectedCondition(newOrientation.title)
    setShowAddModal(false)
    setNewOrientation({ title: '', description: '', recommendations: '', avoid: '' })
  }

  const handleSend = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      alert(`Orientação "${selectedCondition}" enviada com sucesso para o paciente ${patient?.name || ''}!`)
    }, 1500)
  }

  const current = orientations[selectedCondition] || orientations['Geral']
  const filteredConditions = Object.keys(orientations).filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Orientações Clínicas</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Prescrição de condutas e orientações dietéticas</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Nova Orientação
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Sidebar: Condições */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content', border: '1px solid #e2e8f0' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              className="input" 
              placeholder="Buscar condição..." 
              style={{ paddingLeft: '35px', width: '100%' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredConditions.map(cond => (
              <button 
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '12px', border: 'none', textAlign: 'left', cursor: 'pointer',
                  backgroundColor: selectedCondition === cond ? 'var(--primary)' : 'transparent',
                  color: selectedCondition === cond ? 'white' : 'var(--text)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontWeight: '700' }}>{cond}</span>
                <ChevronRight size={16} opacity={0.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Content: Document Preview */}
        <div className="card" style={{ padding: '3rem', maxWidth: '850px', backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', position: 'relative' }}>
          <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)' }}>{selectedCondition}</h3>
            {current.description && <p style={{ marginTop: '1rem', color: '#64748b', lineHeight: '1.6', fontSize: '1.1rem' }}>{current.description}</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: '800', color: '#10b981', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <CheckCircle2 size={20} /> Recomendações
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                {current.recommendations.map((item, i) => (
                  <li key={i} style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', borderRadius: '14px', fontSize: '1.1rem', borderLeft: '4px solid #10b981' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: '800', color: '#ef4444', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <AlertCircle size={20} /> Evitar / Reduzir
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                {current.avoid.map((item, i) => (
                  <li key={i} style={{ padding: '1.25rem', backgroundColor: '#fef2f2', borderRadius: '14px', fontSize: '1.1rem', borderLeft: '4px solid #ef4444' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
             <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={18} /> Imprimir
             </button>
             <button 
               className="btn btn-primary" 
               style={{ padding: '1rem 3rem', minWidth: '240px' }} 
               onClick={handleSend}
               disabled={isSending}
             >
                {isSending ? 'Enviando...' : <><Send size={18} /> Enviar para o Paciente</>}
             </button>
          </div>
        </div>
      </div>

      {/* Modal Nova Orientação */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '600px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Criar Nova Orientação</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Título / Condição</label>
                  <input className="input" style={{ width: '100%' }} value={newOrientation.title} onChange={e => setNewOrientation({...newOrientation, title: e.target.value})} placeholder="Ex: Gastrite, Vegana..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Descrição Curta</label>
                  <input className="input" style={{ width: '100%' }} value={newOrientation.description} onChange={e => setNewOrientation({...newOrientation, description: e.target.value})} placeholder="Breve resumo da conduta" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Recomendações (uma por linha)</label>
                  <textarea className="input" style={{ width: '100%', height: '100px', resize: 'none' }} value={newOrientation.recommendations} onChange={e => setNewOrientation({...newOrientation, recommendations: e.target.value})} placeholder="Item 1\nItem 2..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>O que Evitar (uma por linha)</label>
                  <textarea className="input" style={{ width: '100%', height: '100px', resize: 'none' }} value={newOrientation.avoid} onChange={e => setNewOrientation({...newOrientation, avoid: e.target.value})} placeholder="Item 1\nItem 2..." />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancelar</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddOrientation}>
                    <Save size={18} /> Salvar Orientação
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NutritionalOrientation
