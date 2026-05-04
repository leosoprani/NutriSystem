import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Utensils, Trash2, Edit2, ChevronRight, Apple, Activity, Clock, Target, Info, Sparkles, X } from 'lucide-react'

import { TACO_DATABASE } from '../data/tacoData'

const FoodRecall = ({ patient }) => {
  const [activeMealTab, setActiveMealTab] = useState('Café da Manhã')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedMeasure, setSelectedMeasure] = useState('Grama')
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem(`recall_${patient?.id || 'default'}`)
    return saved ? JSON.parse(saved) : {
      'Café da Manhã': [],
      'Almoço': [],
      'Lanche': [],
      'Jantar': []
    }
  })

  useEffect(() => {
    localStorage.setItem(`recall_${patient?.id || 'default'}`, JSON.stringify(meals))
  }, [meals, patient])

  const filteredFoods = TACO_DATABASE.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFood = () => {
    if (selectedFood) {
      const multiplier = selectedMeasure === 'Grama' ? quantity / 100 : quantity
      const newEntry = {
        ...selectedFood,
        id: Date.now(),
        qty: quantity,
        measure: selectedMeasure,
        calculatedKcal: Math.round(selectedFood.calories * multiplier),
        calculatedProt: (selectedFood.protein * multiplier).toFixed(1),
        calculatedCarb: (selectedFood.carbs * multiplier).toFixed(1),
        calculatedGord: (selectedFood.fats * multiplier).toFixed(1)
      }
      
      setMeals({
        ...meals,
        [activeMealTab]: [...(meals[activeMealTab] || []), newEntry]
      })
      setSelectedFood(null)
      setSearchQuery('')
      setQuantity(1)
    }
  }

  const removeFood = (id) => {
    setMeals({
      ...meals,
      [activeMealTab]: meals[activeMealTab].filter(f => f.id !== id)
    })
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Estudo Alimentar</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Recordatório 24h: <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{patient?.name || 'Selecione um Paciente'}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '12px' }}>
          {['Café da Manhã', 'Almoço', 'Lanche', 'Jantar'].map(meal => (
            <button
              key={meal}
              onClick={() => setActiveMealTab(meal)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeMealTab === meal ? 'white' : 'transparent',
                color: activeMealTab === meal ? 'var(--primary)' : '#64748b',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: activeMealTab === meal ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr', gap: '1.5rem', alignItems: 'end' }}>
            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>Buscar Alimento (TACO/IBGE)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className="input" 
                    style={{ width: '100%', paddingRight: '40px' }} 
                    placeholder="Ex: Arroz, Frango..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
                {searchQuery && !selectedFood && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', zIndex: 100, border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    {filteredFoods.map(f => (
                      <div key={f.id} onClick={() => { setSelectedFood(f); setSearchQuery(f.name); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }} className="hover-bg">
                        <span style={{ fontWeight: 'bold' }}>{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>Medida</label>
              <select className="input" style={{ width: '100%' }} value={selectedMeasure} onChange={e => setSelectedMeasure(e.target.value)}>
                <option value="Grama">Grama</option>
                <option value="Colher Sopa">Colher Sopa</option>
                <option value="Unid. M">Unid. M</option>
                <option value="Copo Duplo">Copo Duplo</option>
                <option value="Fatia">Fatia</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>Quantidade</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {selectedMeasure !== 'Grama' && (
                  <button className="btn" style={{ padding: '4px 12px', backgroundColor: '#22c55e', color: 'white' }} onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                )}
                <input 
                  type="number" 
                  className="input" 
                  value={quantity} 
                  onChange={e => setQuantity(parseInt(e.target.value) || 0)} 
                  style={{ width: selectedMeasure === 'Grama' ? '100px' : '60px', textAlign: 'center', padding: '4px', fontSize: '1rem', fontWeight: 'bold' }} 
                />
                {selectedMeasure !== 'Grama' && (
                  <button className="btn" style={{ padding: '4px 12px', backgroundColor: '#22c55e', color: 'white' }} onClick={() => setQuantity(q => q+1)}>+</button>
                )}
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddFood} style={{ backgroundColor: '#22c55e', border: 'none', height: '44px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 1.5rem' }}>
              <Plus size={18} /> Incluir
            </button>
         </div>

         <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
               <thead>
                 <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Alimento</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Medida</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Qt.</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Kcal</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Prot.(g)</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Carb.(g)</th>
                   <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Gord.(g)</th>
                 </tr>
               </thead>
               <tbody>
                 {(meals[activeMealTab] || []).map(food => (
                   <tr key={food.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeFood(food.id)} />
                        </div>
                     </td>
                     <td style={{ padding: '1rem', fontWeight: '600' }}>{food.name}</td>
                     <td style={{ padding: '1rem' }}>{food.measure}</td>
                     <td style={{ padding: '1rem' }}>{food.qty}</td>
                     <td style={{ padding: '1rem', fontWeight: 'bold', color: '#ef4444' }}>{food.calculatedKcal}</td>
                     <td style={{ padding: '1rem' }}>{food.calculatedProt}</td>
                     <td style={{ padding: '1rem' }}>{food.calculatedCarb}</td>
                     <td style={{ padding: '1rem' }}>{food.calculatedGord}</td>
                   </tr>
                 ))}
                 {(!meals[activeMealTab] || meals[activeMealTab].length === 0) && (
                   <tr>
                     <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Nenhum alimento registrado nesta refeição.</td>
                   </tr>
                 )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}

export default FoodRecall
