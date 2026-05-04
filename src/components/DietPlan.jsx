import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, Printer, Calculator, ChevronDown, ChevronUp, Info, UtensilsCrossed, Utensils, Zap, Droplets, Beef, Check, X, Search, Sparkles } from 'lucide-react'

import { TACO_DATABASE } from '../data/tacoData'

const DietPlan = ({ patient, onSave }) => {
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem(`diet_${patient?.id || 'default'}`)
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Café da Manhã', time: '07:30', items: [], expanded: true },
      { id: 2, name: 'Lanche da Manhã', time: '10:00', items: [], expanded: false },
      { id: 3, name: 'Almoço', time: '12:30', items: [], expanded: false },
    ]
  })

  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem(`targets_${patient?.id || 'default'}`)
    return saved ? JSON.parse(saved) : {
      calories: 2200,
      protein: 160,
      carbs: 220,
      fats: 75
    }
  })

  useEffect(() => {
    localStorage.setItem(`diet_${patient?.id || 'default'}`, JSON.stringify(meals))
    localStorage.setItem(`targets_${patient?.id || 'default'}`, JSON.stringify(targets))
  }, [meals, targets, patient])

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })

  useEffect(() => {
    let cal = 0, p = 0, c = 0, f = 0
    meals.forEach(meal => {
      meal.items.forEach(item => {
        cal += item.calories
        p += item.protein
        c += item.carbs
        f += item.fats
      })
    })
    setTotals({ calories: cal, protein: p, carbs: c, fats: f })
  }, [meals])

  const [showTargetModal, setShowTargetModal] = useState(false)
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [activeMealId, setActiveMealId] = useState(null)
  const [foodSearch, setFoodSearch] = useState('')
  const [newFood, setNewFood] = useState({ name: '', amount: '100g', calories: 0, protein: 0, carbs: 0, fats: 0 })

  const [showFinalizeModal, setShowFinalizeModal] = useState(null)
  const [attachedRecipes, setAttachedRecipes] = useState([])
  const [recipeSearch, setRecipeSearch] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [manualShoppingItems, setManualShoppingItems] = useState([])
  const [newManualItem, setNewManualItem] = useState('')

  const filteredMockFoods = TACO_DATABASE.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()))

  const selectMockFood = (food) => {
    setNewFood(food)
    setFoodSearch(food.name)
  }

  const handleAddFood = () => {
    if (newFood.name) {
      setMeals(prev => prev.map(meal => {
        if (meal.id === activeMealId) {
          return { ...meal, items: [...meal.items, { ...newFood, id: Date.now() }] }
        }
        return meal
      }))
      setNewFood({ name: '', amount: '100g', calories: 0, protein: 0, carbs: 0, fats: 0 })
      setFoodSearch('')
      setShowFoodModal(false)
    }
  }

  const smartPrescription = () => {
    setIsAiLoading(true)
    
    setTimeout(() => {
      // Metas sugeridas
      setTargets({
        calories: 1850,
        protein: 140,
        carbs: 180,
        fats: 62
      })

      // Refeições sugeridas
      const suggestedMeals = [
        { 
          id: 1, name: 'Café da Manhã', time: '07:30', expanded: true,
          items: [
            { id: Date.now() + 1, name: 'Ovo Cozido', amount: '2 un (100g)', calories: 156, protein: 12.6, carbs: 1.2, fats: 10.6 },
            { id: Date.now() + 2, name: 'Banana Prata', amount: '1 un (80g)', calories: 71, protein: 0.9, carbs: 18.2, fats: 0.1 }
          ]
        },
        { 
          id: 2, name: 'Lanche da Manhã', time: '10:00', expanded: false,
          items: [
            { id: Date.now() + 3, name: 'Aveia em Flocos', amount: '30g', calories: 117, protein: 4.3, carbs: 17.0, fats: 2.2 }
          ]
        },
        { 
          id: 3, name: 'Almoço', time: '12:30', expanded: true,
          items: [
            { id: Date.now() + 4, name: 'Peito de Frango Grelhado', amount: '150g', calories: 238, protein: 48.0, carbs: 0, fats: 3.7 },
            { id: Date.now() + 5, name: 'Arroz Integral Cozido', amount: '100g', calories: 124, protein: 2.6, carbs: 25.8, fats: 1.0 },
            { id: Date.now() + 6, name: 'Feijão Carioca Cozido', amount: '100g', calories: 76, protein: 4.8, carbs: 13.6, fats: 0.5 }
          ]
        }
      ]
      
      setMeals(suggestedMeals)
      setIsAiLoading(false)
      alert('Plano Alimentar sugerido com sucesso pela IA!')
    }, 2000)
  }

  const addMeal = () => {
    const id = meals.length + 1
    setMeals([...meals, { id, name: 'Nova Refeição', time: '00:00', items: [], expanded: true }])
  }

  const removeItem = (mealId, itemId) => {
    setMeals(prev => prev.map(meal => {
      if (meal.id === mealId) {
        return { ...meal, items: meal.items.filter(i => i.id !== itemId) }
      }
      return meal
    }))
  }

  const removeMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  const toggleExpand = (id) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, expanded: !m.expanded } : m))
  }

  const shoppingList = [...meals.flatMap(m => m.items.map(i => i.name)), ...manualShoppingItems]

  return (
    <div style={{ padding: '1rem', position: 'relative' }}>
      <AnimatePresence>
        {isAiLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', backdropFilter: 'blur(4px)' }}
          >
            <div style={{ width: '60px', height: '60px', border: '4px solid #f3f3f3', borderTop: '4px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ fontWeight: '800', color: '#8b5cf6', fontSize: '1.2rem' }}>A IA NutriSystem está prescrevendo...</p>
            <p style={{ color: '#64748b' }}>Analisando anamnese e objetivos do paciente.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Prescrição Inteligente</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Montando dieta para: <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{patient?.name || 'Selecione um Paciente'}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={smartPrescription} style={{ backgroundColor: '#8b5cf6', color: 'white', border: 'none' }}>
            <Sparkles size={18} /> Sugestão IA
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> Imprimir PDF
          </button>
          <button className="btn btn-primary" onClick={() => onSave(meals)}>
            <Save size={18} /> Salvar Plano
          </button>
        </div>
      </div>

      {/* Dashboard de Análise de Nutrientes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Análise de nutrientes do cardápio
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '12px 8px', color: '#64748b' }}>Parâmetro</th>
                <th style={{ padding: '12px 8px', color: '#64748b' }}>Prescrito</th>
                <th style={{ padding: '12px 8px', color: '#64748b' }}>Teórico</th>
                <th style={{ padding: '12px 8px', color: '#64748b' }}>Diferença</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Proteínas totais', val: totals.protein, theo: targets.protein, unit: 'g' },
                { label: 'Lipídios totais', val: totals.fats, theo: targets.fats, unit: 'g' },
                { label: 'Carboidratos totais', val: totals.carbs, theo: targets.carbs, unit: 'g' },
                { label: 'Calorias totais', val: totals.calories, theo: targets.calories, unit: 'Kcal' },
              ].map((row, i) => {
                const diff = row.val - row.theo
                const isOver = diff > 0
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{row.label}</td>
                    <td style={{ padding: '12px 8px' }}>{row.val.toFixed(1)}{row.unit}</td>
                    <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{row.theo}{row.unit}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold', color: Math.abs(diff) < 5 ? '#10b981' : '#ef4444' }}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)}{row.unit}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button className="btn" onClick={() => setShowTargetModal(true)} style={{ marginTop: '1.5rem', width: 'auto', padding: '0 1.5rem', height: '40px', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.8rem', borderRadius: '10px' }}>
            + adicionar planejamento teórico
          </button>
        </div>

        {/* Gráfico de Macronutrientes */}
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '50%', background: `conic-gradient(#3b82f6 0% 45%, #ef4444 45% 75%, #f59e0b 75% 100%)`, marginBottom: '2rem', boxShadow: 'inset 0 0 0 30px white' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '900' }}>{totals.calories.toFixed(0)}</p>
              <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' }}>KCAL TOTAL</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
            {[
              { label: 'Prot', color: '#ef4444', val: totals.protein },
              { label: 'Carb', color: '#3b82f6', val: totals.carbs },
              { label: 'Gord', color: '#f59e0b', val: totals.fats },
              { label: 'Fibras', color: '#10b981', val: 0 }
            ].map((m, i) => (
              <div key={i} style={{ padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: `3px solid ${m.color}` }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{m.label}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: '900' }}>{m.val.toFixed(1)}g</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finalização do Planejamento */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.5rem' }}>Finalização do planejamento</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Etapas cruciais para garantir a adesão do paciente ao plano.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={() => setShowFinalizeModal('products')} style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0', color: 'var(--secondary)', borderRadius: '12px', height: '50px', fontWeight: 'bold' }}>
            <Plus size={18} color="var(--primary)" /> recomendação de produtos
          </button>
          <button className="btn" onClick={() => setShowFinalizeModal('recipes')} style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0', color: 'var(--secondary)', borderRadius: '12px', height: '50px', fontWeight: 'bold' }}>
            <Plus size={18} color="var(--primary)" /> anexar receitas
          </button>
          <button className="btn" onClick={() => setShowFinalizeModal('shopping')} style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e2e8f0', color: 'var(--secondary)', borderRadius: '12px', height: '50px', fontWeight: 'bold' }}>
            <Check size={18} color="#10b981" /> lista de compras
          </button>
        </div>
      </div>

      {/* Editor de Refeições */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {meals.map(meal => (
          <div key={meal.id} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <div 
              onClick={() => toggleExpand(meal.id)}
              style={{ padding: '1.5rem 2rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: meal.expanded ? '1px solid #e2e8f0' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <UtensilsCrossed size={18} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{meal.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Horário: <span style={{ fontWeight: 'bold' }}>{meal.time}</span></p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '900' }}>{meal.items.reduce((acc, curr) => acc + curr.calories, 0).toFixed(0)} kcal</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b' }}>{meal.items.length} alimentos</p>
                </div>
                {meal.expanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
              </div>
            </div>

            <AnimatePresence>
              {meal.expanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem 2rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                          <th style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Alimento</th>
                          <th style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Qtd</th>
                          <th style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Kcal</th>
                          <th style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>P</th>
                          <th style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>C</th>
                          <th style={{ padding: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>G</th>
                          <th style={{ padding: '0.75rem' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {meal.items.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '0.75rem', fontWeight: '700', fontSize: '0.9rem' }}>{item.name}</td>
                            <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{item.amount}</td>
                            <td style={{ padding: '0.75rem', fontWeight: '800' }}>{item.calories}</td>
                            <td style={{ padding: '0.75rem' }}>{item.protein}</td>
                            <td style={{ padding: '0.75rem' }}>{item.carbs}</td>
                            <td style={{ padding: '0.75rem' }}>{item.fats}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              <button onClick={() => removeItem(meal.id, item.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button className="btn" onClick={() => { setActiveMealId(meal.id); setShowFoodModal(true); }} style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 12px', border: '1px solid var(--primary)30', borderRadius: '8px' }}>
                        <Plus size={14} /> Adicionar Alimento
                      </button>
                      <button onClick={() => removeMeal(meal.id)} style={{ color: '#ef4444', border: 'none', background: 'transparent', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Remover Refeição</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <button 
          onClick={addMeal}
          style={{ width: '100%', padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '20px', backgroundColor: 'transparent', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={24} /> Adicionar Nova Refeição
        </button>
      </div>

      {/* Modais de Finalização */}
      <AnimatePresence>
        {showFinalizeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '500px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>
                  {showFinalizeModal === 'products' && 'Recomendação de Produtos'}
                  {showFinalizeModal === 'recipes' && 'Anexar Receitas'}
                  {showFinalizeModal === 'shopping' && 'Lista de Compras'}
                </h3>
                <button onClick={() => setShowFinalizeModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
              </div>
              
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '2rem' }}>
                {showFinalizeModal === 'shopping' ? (
                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#64748b' }}>ADICIONAR ITEM PERSONALIZADO</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          className="input" 
                          placeholder="Ex: Azeite Extra Virgem..." 
                          style={{ flex: 1 }} 
                          value={newManualItem}
                          onChange={e => setNewManualItem(e.target.value)}
                        />
                        <button 
                          className="btn btn-primary" 
                          onClick={() => {
                            if (newManualItem.trim()) {
                              setManualShoppingItems([...manualShoppingItems, newManualItem.trim()]);
                              setNewManualItem('');
                            }
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#64748b' }}>ITENS DA LISTA ({Array.from(new Set(shoppingList)).length})</p>
                      <button 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.7rem', padding: '4px 12px' }}
                        onClick={() => {
                          const text = Array.from(new Set(shoppingList)).join('\n');
                          navigator.clipboard.writeText(text);
                          alert('Lista copiada para a área de transferência!');
                        }}
                      >
                        Copiar Lista
                      </button>
                    </div>
                    {shoppingList.length > 0 ? (
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         {Array.from(new Set(shoppingList)).map(item => (
                           <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                             <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                             <span style={{ flex: 1, fontWeight: '600', color: '#334155' }}>{item}</span>
                             {manualShoppingItems.includes(item) && (
                               <button 
                                 onClick={() => setManualShoppingItems(manualShoppingItems.filter(i => i !== item))}
                                 style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                               >
                                 <Trash2 size={14} />
                               </button>
                             )}
                           </div>
                         ))}
                       </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Utensils size={32} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: '#94a3b8', margin: 0 }}>Nenhum item adicionado ao plano ainda.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {showFinalizeModal === 'products' ? (
                      ['Whey Protein', 'Creatina', 'Multivitamínico', 'BCAA', 'Glutamina', 'Ômega 3'].map(item => (
                        <div key={item} style={{ padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600' }}>{item}</span>
                          <button 
                            className="btn btn-primary" 
                            style={{ 
                              fontSize: '0.7rem', 
                              height: '30px', 
                              padding: '0 12px',
                              backgroundColor: attachedRecipes.includes(item) ? '#10b981' : 'var(--primary)'
                            }}
                            onClick={() => {
                              if (attachedRecipes.includes(item)) {
                                setAttachedRecipes(attachedRecipes.filter(r => r !== item))
                              } else {
                                setAttachedRecipes([...attachedRecipes, item])
                              }
                            }}
                          >
                            {attachedRecipes.includes(item) ? 'Incluído' : 'Incluir'}
                          </button>
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input 
                            className="input" 
                            placeholder="Buscar nas 5.000+ receitas..." 
                            style={{ width: '100%', paddingLeft: '40px', fontSize: '0.85rem' }} 
                            value={recipeSearch}
                            onChange={e => setRecipeSearch(e.target.value)}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {[
                            'Omelete Fit de Espinafre', 'Salada Nutritiva de Grão de Bico', 'Shake Pré-treino de Banana', 
                            'Cuscuz Nordestino com Ovos', 'Pão de Queijo de Tapioca', 'Vitamina de Abacate',
                            'Panqueca de Aveia', 'Moqueca de Peixe Fit', 'Frango Teriyaki', 'Caldo Verde Light'
                          ].filter(r => r.toLowerCase().includes(recipeSearch.toLowerCase())).map(item => (
                            <div key={item} style={{ padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600' }}>{item}</span>
                              <button 
                                className="btn btn-primary" 
                                style={{ 
                                  fontSize: '0.7rem', 
                                  height: '30px', 
                                  padding: '0 12px',
                                  backgroundColor: attachedRecipes.includes(item) ? '#10b981' : 'var(--primary)'
                                }}
                                onClick={() => {
                                  if (attachedRecipes.includes(item)) {
                                    setAttachedRecipes(attachedRecipes.filter(r => r !== item))
                                  } else {
                                    setAttachedRecipes([...attachedRecipes, item])
                                  }
                                }}
                              >
                                {attachedRecipes.includes(item) ? 'Anexado' : 'Anexar'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {attachedRecipes.length > 0 && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>Itens Selecionados ({attachedRecipes.length}):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {attachedRecipes.map(r => (
                      <span key={r} style={{ padding: '2px 8px', backgroundColor: 'white', borderRadius: '4px', fontSize: '0.65rem', border: '1px solid #bbf7d0' }}>{r}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { 
                alert(`${attachedRecipes.length} itens anexados ao plano com sucesso!`); 
                setShowFinalizeModal(null); 
              }}>Finalizar Etapa</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Planejamento Teórico */}
      <AnimatePresence>
        {showTargetModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '400px', padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '2rem' }}>Definir Metas Teóricas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div><label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>CALORIAS (kcal)</label><input type="number" className="input" style={{ width: '100%' }} value={targets.calories} onChange={e => setTargets({...targets, calories: parseInt(e.target.value)})} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div><label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>PROT (g)</label><input type="number" className="input" style={{ width: '100%' }} value={targets.protein} onChange={e => setTargets({...targets, protein: parseInt(e.target.value)})} /></div>
                  <div><label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>CARB (g)</label><input type="number" className="input" style={{ width: '100%' }} value={targets.carbs} onChange={e => setTargets({...targets, carbs: parseInt(e.target.value)})} /></div>
                  <div><label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>GORD (g)</label><input type="number" className="input" style={{ width: '100%' }} value={targets.fats} onChange={e => setTargets({...targets, fats: parseInt(e.target.value)})} /></div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem' }} onClick={() => setShowTargetModal(false)}>Salvar Metas</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Adicionar Alimento */}
      <AnimatePresence>
        {showFoodModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '550px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>Buscar Alimento</h3>
                <button onClick={() => setShowFoodModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <input className="input" style={{ width: '100%', paddingLeft: '40px' }} placeholder="Ex: Arroz, Frango, Whey..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)} />
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>

                {foodSearch && (
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                    {filteredMockFoods.map(f => (
                      <div key={f.name} onClick={() => selectMockFood(f)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f8fafc', fontSize: '0.9rem' }} className="hover-bg">
                        <span style={{ fontWeight: 'bold' }}>{f.name}</span> <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({f.amount})</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div><label style={{ fontSize: '0.7rem', fontWeight: '800' }}>NOME</label><input className="input" style={{ width: '100%' }} value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} /></div>
                    <div><label style={{ fontSize: '0.7rem', fontWeight: '800' }}>QTD</label><input className="input" style={{ width: '100%' }} value={newFood.amount} onChange={e => setNewFood({...newFood, amount: e.target.value})} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    <div><label style={{ fontSize: '0.65rem', fontWeight: '800' }}>KCAL</label><input type="number" className="input" style={{ width: '100%' }} value={newFood.calories} onChange={e => setNewFood({...newFood, calories: parseInt(e.target.value) || 0})} /></div>
                    <div><label style={{ fontSize: '0.65rem', fontWeight: '800' }}>P</label><input type="number" className="input" style={{ width: '100%' }} value={newFood.protein} onChange={e => setNewFood({...newFood, protein: parseFloat(e.target.value) || 0})} /></div>
                    <div><label style={{ fontSize: '0.65rem', fontWeight: '800' }}>C</label><input type="number" className="input" style={{ width: '100%' }} value={newFood.carbs} onChange={e => setNewFood({...newFood, carbs: parseFloat(e.target.value) || 0})} /></div>
                    <div><label style={{ fontSize: '0.65rem', fontWeight: '800' }}>G</label><input type="number" className="input" style={{ width: '100%' }} value={newFood.fats} onChange={e => setNewFood({...newFood, fats: parseFloat(e.target.value) || 0})} /></div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ height: '50px', borderRadius: '14px' }} onClick={handleAddFood}>Adicionar ao Plano</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DietPlan
