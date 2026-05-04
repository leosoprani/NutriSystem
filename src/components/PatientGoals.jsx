import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, CheckCircle2, Circle, TrendingUp, Droplets, Moon, Zap, Plus, Trash2, X } from 'lucide-react'

const ICON_MAP = {
  'Droplets': Droplets,
  'Moon': Moon,
  'Zap': Zap,
  'Target': Target
}

const PatientGoals = ({ patient }) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(`goals_${patient?.id || 'default'}`)
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Beber 3L de água/dia', category: 'Hidratação', progress: 75, target: 100, iconName: 'Droplets', color: '#3b82f6' },
      { id: 2, title: 'Dormir 8h por noite', category: 'Sono', progress: 60, target: 100, iconName: 'Moon', color: '#8b5cf6' },
      { id: 3, title: 'Treino de Força (4x)', category: 'Atividade', progress: 50, target: 100, iconName: 'Zap', color: '#ef4444' }
    ]
  })

  useEffect(() => {
    localStorage.setItem(`goals_${patient?.id || 'default'}`, JSON.stringify(goals))
  }, [goals, patient])

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', category: 'Hidratação', progress: 0, color: '#3b82f6' })

  const categories = [
    { name: 'Hidratação', iconName: 'Droplets', color: '#3b82f6' },
    { name: 'Sono', iconName: 'Moon', color: '#8b5cf6' },
    { name: 'Atividade', iconName: 'Zap', color: '#ef4444' },
    { name: 'Outros', iconName: 'Target', color: '#10b981' }
  ]

  const handleAddGoal = () => {
    if (newGoal.title) {
      const cat = categories.find(c => c.name === newGoal.category)
      setGoals([...goals, { ...newGoal, id: Date.now(), iconName: cat.iconName, color: cat.color, target: 100 }])
      setNewGoal({ title: '', category: 'Hidratação', progress: 0, color: '#3b82f6' })
      setShowAddGoal(false)
    }
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Metas & Hábitos</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Acompanhamento de objetivos para: <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{patient?.name || 'Selecione um Paciente'}</span></p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddGoal(true)}>
          <Plus size={20} /> Nova Meta
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {goals.map(goal => {
          const IconComp = ICON_MAP[goal.iconName] || Target
          return (
            <motion.div 
              key={goal.id}
              whileHover={{ y: -5 }}
              className="card"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: `${goal.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComp size={24} color={goal.color} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{goal.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{goal.category}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: goal.color }}>{goal.progress}%</span>
                </div>
              </div>

              <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1 }}
                  style={{ height: '100%', backgroundColor: goal.color }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1,2,3,4,5,6,7].map(day => (
                    <div key={day} style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: day < 5 ? goal.color : '#e2e8f0' }} />
                  ))}
                </div>
                <button onClick={() => deleteGoal(goal.id)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {showAddGoal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '400px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>Adicionar Meta</h3>
                <button onClick={() => setShowAddGoal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>TÍTULO DA META</label>
                  <input className="input" placeholder="Ex: Meditação diária" style={{ width: '100%' }} value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>CATEGORIA</label>
                  <select className="input" style={{ width: '100%' }} value={newGoal.category} onChange={e => setNewGoal({...newGoal, category: e.target.value})}>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem' }} onClick={handleAddGoal}>Criar Meta</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientGoals
