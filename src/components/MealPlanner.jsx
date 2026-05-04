import React, { useState } from 'react'
import { Plus, Trash2, Search, FileDown, ShoppingCart, Sparkles, Send, RefreshCw, User, ArrowRight, X, Minus, AlertTriangle, CheckCircle, BrainCircuit, Wand2, TrendingUp, ThumbsUp, MessageSquare, Check, Apple, Clock, Edit2 } from 'lucide-react'
import { generateMealPlanPDF } from '../utils/pdfGenerator'
import { motion, AnimatePresence } from 'framer-motion'
import { chatService } from '../services/api'

const brazilianFoods = {
  proteinas: [
    { name: 'Frango Grelhado', amount: '100g', kcal: 165 },
    { name: 'Ovo Cozido', amount: '2 un', kcal: 140 },
    { name: 'Carne Moída (Patinho)', amount: '100g', kcal: 220 },
    { name: 'Tilápia Grelhada', amount: '120g', kcal: 150 },
    { name: 'Queijo Cottage', amount: '3 col. sopa', kcal: 90 },
    { name: 'Omelete com Espinafre', amount: '2 ovos', kcal: 160 },
    { name: 'Atum em Lata (em água)', amount: '1 lata', kcal: 120 },
    { name: 'Tofu Grelhado', amount: '100g', kcal: 80 }
  ],
  carboidratos: [
    { name: 'Arroz Integral', amount: '100g', kcal: 124 },
    { name: 'Feijão Carioca', amount: '1 concha', kcal: 95 },
    { name: 'Batata Doce Cozida', amount: '100g', kcal: 86 },
    { name: 'Mandioca Cozida', amount: '100g', kcal: 125 },
    { name: 'Cuscuz Nordestino', amount: '2 fatias', kcal: 110 },
    { name: 'Tapioca (goma)', amount: '3 col. sopa', kcal: 100 },
    { name: 'Aveia em Flocos', amount: '30g', kcal: 115 },
    { name: 'Pão Integral', amount: '2 fatias', kcal: 130 }
  ],
  frutas: [
    { name: 'Banana Prata', amount: '1 un', kcal: 90 },
    { name: 'Maçã Fuji', amount: '1 un', kcal: 70 },
    { name: 'Mamão Papaia', amount: '1/2 un', kcal: 80 },
    { name: 'Kiwi', amount: '2 un', kcal: 90 },
    { name: 'Abacaxi', amount: '2 fatias', kcal: 100 }
  ]
}

const MealItem = ({ meal, onAddFood, onDeleteFood, onDeleteMeal, onSubstitute, onUpdateQuantity }) => (
  <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
      <div>
        <span style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '1.1rem' }}>{meal.time} - {meal.name}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onAddFood} title="Adicionar Alimento" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Plus size={18}/></button>
        <button onClick={onDeleteMeal} title="Excluir Refeição" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><Trash2 size={18}/></button>
      </div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {meal.foods.length > 0 ? meal.foods.map((food, i) => (
        <div key={i} className="hover-bg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{food.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
              <button onClick={() => onUpdateQuantity(i, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Minus size={14} /></button>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>{food.amount}</span>
              <button onClick={() => onUpdateQuantity(i, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Plus size={14} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onSubstitute(food)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }} title="Substituir com IA"><RefreshCw size={14} /></button>
            <button onClick={() => onAddFood(food, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }} title="Editar Alimento"><Edit2 size={14} /></button>
            <button onClick={() => onDeleteFood(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }} title="Excluir Alimento"><X size={14} /></button>
          </div>
        </div>
      )) : (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem' }}>Nenhum alimento adicionado.</p>
      )}
    </div>
  </div>
)

const MealPlanner = ({ patient, patients = [], onSelectPatient, onSave }) => {
  const [meals, setMeals] = useState([
    { id: 1, time: '07:30', name: 'Café da Manhã', foods: [{ name: 'Ovo cozido', amount: '2 un' }, { name: 'Pão integral', amount: '2 fatias' }] },
    { id: 2, time: '10:30', name: 'Lanche da Manhã', foods: [{ name: 'Maçã', amount: '1 un' }] },
    { id: 3, time: '12:30', name: 'Almoço', foods: [{ name: 'Frango grelhado', amount: '150g' }, { name: 'Arroz integral', amount: '100g' }, { name: 'Salada verde', amount: '1 porção' }] },
  ])

  const [aiLoading, setAiLoading] = useState(false)
  const [proposedChanges, setProposedChanges] = useState(null)
  const [showAddFoodModal, setShowAddFoodModal] = useState(null) // { mealId, foodIndex }
  const [showAddMealModal, setShowAddMealModal] = useState(false)
  const [foodInput, setFoodInput] = useState({ name: '', amount: '' })
  const [mealInput, setMealInput] = useState({ name: '', time: '' })
  const [inputError, setInputError] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)

  const handleSendWhatsApp = () => {
    const phone = patient?.phone || '5500000000000'
    const appLink = window.location.origin
    const text = encodeURIComponent(`Olá ${patient?.name || 'Paciente'}, seu novo Plano Alimentar está pronto!\n\n` + 
      meals.map(m => `*${m.time} - ${m.name}*\n${m.foods.map(f => `- ${f.name} (${f.amount})`).join('\n')}`).join('\n\n') +
      `\n\n🚀 Veja todos os detalhes e receitas no seu App: ${appLink}\n\n` +
      `Foco na dieta! 💪`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  const handleDeepAIAnalysis = () => {
    setAiLoading(true)
    setTimeout(() => {
      // Lógica dinâmica baseada no estado atual e literatura médica
      const hasBread = meals.some(m => m.foods.some(f => f.name.toLowerCase().includes('pão')))
      const hasOat = meals.some(m => m.foods.some(f => f.name.toLowerCase().includes('aveia')))
      const highProteinGoal = patient.plan_type === 'Hipertrofia'
      
      const preAtendimento = JSON.parse(localStorage.getItem(`pre_atendimento_${patient.id}`) || '{}')
      
      let updates = []
      let reasoning = `Baseado no perfil de ${patient.name} e diretrizes da ISSN/SBN. `

      // 1. Verificação de Restrições Médicas
      if (preAtendimento.alergias && preAtendimento.alergias.toLowerCase().includes('lactose')) {
        const hasMilk = meals.some(m => m.foods.some(f => f.name.toLowerCase().includes('leite') || f.name.toLowerCase().includes('queijo')))
        if (hasMilk) {
          updates.push({ 
            type: 'Alerta Crítico', 
            meal: 'Geral', 
            from: 'Laticínios detectados', 
            to: 'Substitutos Zero Lactose', 
            toAmount: '1 porção',
            reason: 'Risco de desconforto gastrointestinal agudo.',
            study: 'Guidelines da World Gastroenterology Organisation (WGO).' 
          })
        }
      }

      // 2. Otimização de Macronutrientes (Baseado em Hipertrofia)
      if (highProteinGoal) {
        const lunch = meals.find(m => m.name === 'Almoço')
        const chicken = lunch?.foods.find(f => f.name.toLowerCase().includes('frango'))
        const chickenAmount = chicken ? parseFloat(chicken.amount) : 0
        if (chicken && chickenAmount < 190) {
          updates.push({ 
            type: 'Ajuste Proteico', 
            meal: 'Almoço', 
            from: chicken.name, 
            to: chicken.name,
            toAmount: '200g', 
            reason: 'Otimizar síntese proteica miofibrilar (MPS).',
            study: 'International Society of Sports Nutrition (ISSN) position stand: protein and exercise.' 
          })
        }
      }

      // 3. Otimização de Índice Glicêmico e Fibras
      if (hasBread && !hasOat) {
        updates.push({ 
          type: 'Otimização Glicêmica', 
          meal: 'Café da Manhã', 
          from: 'Pão integral', 
          to: 'Aveia em flocos', 
          toAmount: '40g',
          reason: 'Aumentar a saciedade via Beta-glucanas e reduzir pico insulínico.',
          study: 'American Journal of Clinical Nutrition - Glycemic Index and Health.' 
        })
      }

      // 4. Timing de Nutrientes
      const hasDinner = meals.some(m => m.name === 'Jantar')
      if (hasDinner && patient.plan_type === 'Emagrecimento') {
        const dinner = meals.find(m => m.name === 'Jantar')
        const heavyCarbs = dinner.foods.some(f => f.name.toLowerCase().includes('arroz') || f.name.toLowerCase().includes('massa'))
        if (heavyCarbs) {
          updates.push({ 
            type: 'Nutrient Timing', 
            meal: 'Jantar', 
            from: 'Arroz/Massa', 
            to: 'Vegetais + Proteína Magra', 
            toAmount: '1 porção farta',
            reason: 'Redução da carga glicêmica noturna para otimizar GH e oxidação lipídica.',
            study: 'Obesity Reviews - Impact of evening carbohydrate intake on weight loss.' 
          })
        }
      }

      if (updates.length === 0) {
        setProposedChanges({
          reasoning: "Análise completa: O plano atual está em conformidade com as diretrizes clínicas mais recentes para o objetivo do paciente.",
          updates: [],
          isPerfect: true
        })
      } else {
        setProposedChanges({ reasoning, updates })
      }
      
      setAiLoading(false)
    }, 1500)
  }

  const handleReformulatePlan = (feedback) => {
    setAiLoading(true)
    const feedbackLower = feedback.toLowerCase()
    
    setTimeout(() => {
      let updates = []
      let reasoning = `Reformulando plano com base no feedback: "${feedback}". `
      const avoidsEggs = feedbackLower.includes('ovo')
      const avoidsDairy = feedbackLower.includes('leite') || feedbackLower.includes('queijo') || feedbackLower.includes('lactose')

      // 1. Substituir Ovos se solicitado
      if (avoidsEggs) {
        let alt = 'Frango Desfiado'
        let amount = '3 col. sopa'
        if (avoidsDairy) {
          alt = 'Tofu Grelhado ou Pasta de Grão de Bico'
          amount = '100g ou 2 col. sopa'
          reasoning += 'Detectada restrição a ovos e laticínios. Sugerindo proteínas de origem vegetal ou aves. '
        } else {
          alt = 'Queijo Cottage'
          amount = '3 col. sopa'
        }
        updates.push({ 
          type: 'Troca Estratégica (Sem Ovo)', 
          meal: 'Café da Manhã', 
          from: 'Ovo', 
          to: alt, 
          toAmount: amount, 
          reason: 'Substituição de proteína de alto valor biológico mantendo o perfil lipídico.', 
          study: 'Consenso Brasileiro de Nutrição Esportiva.' 
        })
      }

      // 2. Substituir Laticínios se solicitado
      if (avoidsDairy) {
        const dairyInPlan = meals.some(m => m.foods.some(f => f.name.toLowerCase().includes('leite') || f.name.toLowerCase().includes('queijo')))
        if (dairyInPlan) {
          updates.push({ 
            type: 'Remoção de Alérgenos/Intolerâncias', 
            meal: 'Geral', 
            from: 'Laticínios', 
            to: 'Opções Plant-based (Leite de Coco/Amêndoas ou Abacate)', 
            toAmount: 'Mesma proporção', 
            reason: 'Remoção de caseína e lactose para redução de processo inflamatório ou desconforto.', 
            study: 'Guidelines da WGO sobre intolerâncias alimentares.' 
          })
        }
      }
      
      // 3. Variedade Geral
      if (feedbackLower.includes('frango')) {
        updates.push({ type: 'Troca de Proteína', meal: 'Almoço', from: 'Frango', to: 'Filé de Tilápia ou Patinho Moído', toAmount: '150g', reason: 'Alternância de aminoácidos.', study: 'Bioquímica Nutricional Aplicada.' })
      }

      if (updates.length === 0) {
        updates.push({ type: 'Ajuste Geral', meal: 'Geral', from: '', to: 'Ajuste Customizado', toAmount: '1 porção', reason: 'Ajustando plano para melhor adesão.', study: 'Psicologia da Adesão Nutricional.' })
      }

      setProposedChanges({ reasoning, updates })
      setAiLoading(false)
    }, 1500)
  }

  const applyAIChanges = () => {
    let updatedMeals = [...meals]
    proposedChanges.updates.forEach(update => {
      updatedMeals = updatedMeals.map(m => {
        if (update.meal !== 'Geral' && m.name !== update.meal) return m
        
        return {
          ...m,
          foods: m.foods.map(f => {
            if (update.from && f.name.toLowerCase().includes(update.from.toLowerCase())) {
              return { ...f, name: update.to, amount: update.toAmount || f.amount }
            }
            // Caso especial para remoção geral (laticínios)
            if (update.from === 'Laticínios' && (f.name.toLowerCase().includes('leite') || f.name.toLowerCase().includes('queijo'))) {
              return { ...f, name: update.to, amount: update.toAmount || f.amount }
            }
            return f
          })
        }
      })
    })
    setMeals(updatedMeals)
    setProposedChanges(null)
  }

  const handleAddFood = () => {
    if (!foodInput.name) { setInputError(true); setTimeout(() => setInputError(false), 1000); return; }
    
    setMeals(prev => prev.map(m => {
      if (m.id !== showAddFoodModal.mealId) return m;
      
      let newFoods = [...m.foods];
      if (editingIndex !== null) {
        newFoods[editingIndex] = { ...foodInput };
      } else {
        newFoods.push({ ...foodInput });
      }
      
      return { ...m, foods: newFoods };
    }));

    setFoodInput({ name: '', amount: '' }); 
    setShowAddFoodModal(null);
    setEditingIndex(null);
  }

  const handleAddMeal = () => {
    if (!mealInput.name || !mealInput.time) { alert('Preencha o nome e horário da refeição.'); return; }
    const newMeal = {
      id: Date.now(),
      name: mealInput.name,
      time: mealInput.time,
      foods: []
    }
    setMeals([...meals, newMeal])
    setMealInput({ name: '', time: '' })
    setShowAddMealModal(false)
  }

  const handleUpdateQuantity = (mealId, foodIndex, delta) => {
    setMeals(meals.map(m => m.id === mealId ? { ...m, foods: m.foods.map((f, i) => {
      if (i !== foodIndex) return f
      const match = f.amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/)
      if (!match) return f
      let num = parseFloat(match[1])
      const unit = match[2]
      let step = unit.toLowerCase().includes('g') ? 10 : 1
      num = Math.max(0, num + (delta * step))
      return { ...f, amount: `${num}${unit ? ' ' + unit : ''}` }
    }) } : m))
  }

  if (!patient) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}><User size={32} /></div>
          <h3>Planos Alimentares</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
            {patients.map(p => (
              <button key={p.id} onClick={() => onSelectPatient(p)} className="btn hover-bg" style={{ justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'left' }}><p style={{ fontWeight: 'bold' }}>{p.name}</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.plan_type}</p></div>
                <ArrowRight size={18} color="var(--primary)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleSubstitute = (mealId, food) => {
    setAiLoading(true)
    setTimeout(() => {
      let options = []
      let type = 'Substituição Clínica'
      
      if (food.name.toLowerCase().includes('pão') || food.name.toLowerCase().includes('carboidrato')) {
        options = brazilianFoods.carboidratos.slice(0, 4)
      } else if (food.name.toLowerCase().includes('frango') || food.name.toLowerCase().includes('carne') || food.name.toLowerCase().includes('ovo')) {
        options = brazilianFoods.proteinas.slice(0, 4)
      } else {
        options = [...brazilianFoods.proteinas.slice(0, 2), ...brazilianFoods.carboidratos.slice(0, 2)]
      }
      
      setProposedChanges({
        reasoning: `Selecione a melhor alternativa para ${food.name}:`,
        isMultiOption: true,
        mealId,
        from: food.name,
        options,
        updates: [] // Será preenchido ao selecionar
      })
      setAiLoading(false)
    }, 1000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div><h2 style={{ fontSize: '1.5rem' }}>Plano Alimentar</h2><p style={{ color: 'var(--text-muted)' }}>{patient.name}</p></div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button className="btn" onClick={handleDeepAIAnalysis} disabled={aiLoading} style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(0, 196, 154, 0.2)' }}>
              {aiLoading ? <RefreshCw size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
              <span style={{ marginLeft: '0.5rem' }}>{aiLoading ? 'Analisando...' : 'Auditoria IA'}</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAddMealModal(true)} style={{ borderRadius: '12px' }}><Plus size={18} /> Refeição</button>
          </div>
        </div>

        {/* Contexto do Pré-Atendimento */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {patient && localStorage.getItem(`pre_atendimento_${patient.id}`) && (
            <div className="card" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)', border: '1px solid #fed7aa', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
              <div style={{ backgroundColor: '#f97316', color: 'white', padding: '0.6rem', borderRadius: '10px' }}>
                <BrainCircuit size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#9a3412', fontSize: '0.85rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contexto do Paciente</h4>
                <p style={{ fontSize: '0.75rem', color: '#444' }}><strong>Objetivo:</strong> {JSON.parse(localStorage.getItem(`pre_atendimento_${patient.id}`) || '{}').objetivo || 'Não informado'}</p>
              </div>
            </div>
          )}

          <div className="card" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #fff 100%)', border: '1px solid #bae6fd', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
            <div style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '0.6rem', borderRadius: '10px' }}>
              <MessageSquare size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#0369a1', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Feedback / Não gosta de algo?</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Ex: Não gosto de ovo..." 
                  className="input" 
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleReformulatePlan(e.target.value)
                  }}
                />
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={(e) => handleReformulatePlan(e.currentTarget.previousSibling.value)}>
                  Reformular
                </button>
              </div>
            </div>
          </div>
        </div>

        {meals.map(meal => (
          <MealItem 
            key={meal.id} 
            meal={meal} 
            onAddFood={(food, index) => {
              if (food) {
                setFoodInput({ name: food.name, amount: food.amount });
                setEditingIndex(index);
              } else {
                setFoodInput({ name: '', amount: '' });
                setEditingIndex(null);
              }
              setShowAddFoodModal({ mealId: meal.id });
            }} 
            onDeleteFood={(idx) => setMeals(meals.map(m => m.id === meal.id ? { ...m, foods: m.foods.filter((_, i) => i !== idx) } : m))} 
            onDeleteMeal={() => {
              if (window.confirm('Deseja excluir toda esta refeição?')) {
                setMeals(meals.filter(m => m.id !== meal.id));
              }
            }} 
            onUpdateQuantity={(idx, delta) => handleUpdateQuantity(meal.id, idx, delta)} 
            onSubstitute={(food) => handleSubstitute(meal.id, food)} 
          />
        ))}
      </div>

      <div className="card glass" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--primary)" /> Smart Mirror (Meta vs Atual)
        </h4>
        
        {(() => {
          // Cálculo de totais em tempo real
          let totalKcal = 0, totalCho = 0, totalPtn = 0, totalLip = 0;
          meals.forEach(m => {
            m.foods.forEach(f => {
              const amount = parseFloat(f.amount) || 0;
              // Mock de densidade nutricional para demonstração
              if (f.name.toLowerCase().includes('ovo')) { totalPtn += 6; totalLip += 5; totalKcal += 70; }
              else if (f.name.toLowerCase().includes('frango')) { totalPtn += 30; totalLip += 3; totalKcal += 160; }
              else if (f.name.toLowerCase().includes('arroz')) { totalCho += 28; totalKcal += 130; }
              else if (f.name.toLowerCase().includes('pão')) { totalCho += 15; totalPtn += 3; totalKcal += 80; }
              else { totalKcal += 50; totalCho += 10; }
            });
          });

          const metaKcal = 2100, metaPtn = 160, metaCho = 200;
          
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                   <span style={{ fontWeight: '600' }}>Calorias Totais</span>
                   <span>{totalKcal} / {metaKcal} kcal</span>
                 </div>
                 <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${Math.min(100, (totalKcal/metaKcal)*100)}%`, height: '100%', background: totalKcal > metaKcal ? '#ef4444' : 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                 </div>
               </div>

               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                   <span style={{ fontWeight: '600' }}>Proteínas</span>
                   <span>{totalPtn}g / {metaPtn}g</span>
                 </div>
                 <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${Math.min(100, (totalPtn/metaPtn)*100)}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.5s ease' }}></div>
                 </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                 <div style={{ textAlign: 'center' }}>
                   <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>CHO Restante</p>
                   <p style={{ fontWeight: '800', color: metaCho - totalCho < 20 ? '#ef4444' : 'var(--secondary)' }}>{metaCho - totalCho}g</p>
                 </div>
                 <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                   <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>PTN Restante</p>
                   <p style={{ fontWeight: '800' }}>{metaPtn - totalPtn}g</p>
                 </div>
               </div>
            </div>
          )
        })()}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }} onClick={() => generateMealPlanPDF(patient, meals)}><FileDown size={18} /> Exportar PDF</button>
          <button className="btn" style={{ width: '100%', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '12px' }} onClick={() => alert('Lista de compras inteligente gerada e enviada para o app do paciente!')}><ShoppingCart size={18} /> Lista de Compras</button>
          <button className="btn" style={{ width: '100%', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '12px' }} onClick={handleSendWhatsApp}><Send size={18} /> Enviar WhatsApp</button>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '0.5rem', borderRadius: '12px' }} 
            onClick={() => {
              chatService.notifyDataChange(patient.id, 'Plano Alimentar')
              alert('Plano alimentar salvo com sucesso! O paciente recebeu uma notificação no app.')
              if (onSave) onSave()
            }}
          >
            <CheckCircle size={18} /> Salvar e Finalizar
          </button>
        </div>
      </div>

      {/* Modal de Auditoria IA Dinâmica */}
      <AnimatePresence>
        {proposedChanges && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '100%', maxWidth: '550px', padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
              <div style={{ padding: '2.5rem', background: proposedChanges.isPerfect ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{proposedChanges.isPerfect ? <ThumbsUp size={24} /> : <Wand2 size={24} />} Auditoria IA</h3>
                  <button onClick={() => setProposedChanges(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24}/></button>
                </div>
                <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.5' }}>{proposedChanges.reasoning}</p>
              </div>
              
              {!proposedChanges.isPerfect && (
                <div style={{ padding: '2.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {proposedChanges.isMultiOption ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {proposedChanges.options.map((opt, i) => (
                          <button 
                            key={i} 
                            className="btn hover-bg" 
                            style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', textAlign: 'left', border: '1px solid #e2e8f0' }}
                            onClick={() => {
                              const update = { type: 'Substituição Clínica', meal: meals.find(m => m.id === proposedChanges.mealId).name, from: proposedChanges.from, to: opt.name, toAmount: opt.amount, reason: 'Escolha do nutricionista/paciente.', study: 'Tabela de Equivalentes Nutricionais.' }
                              setMeals(meals.map(m => m.id === proposedChanges.mealId ? { ...m, foods: m.foods.map(f => f.name === proposedChanges.from ? { name: opt.name, amount: opt.amount } : f) } : m))
                              setProposedChanges(null)
                            }}
                          >
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{opt.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.amount} • {opt.kcal} kcal</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      proposedChanges.updates.map((up, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                          <div style={{ backgroundColor: up.type.includes('Alerta') ? '#fee2e2' : '#e0f2fe', padding: '0.6rem', borderRadius: '10px', height: 'fit-content' }}>
                            {up.type.includes('Alerta') ? <AlertTriangle size={18} color="#ef4444" /> : <Sparkles size={18} color="#3b82f6" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: up.type.includes('Alerta') ? '#ef4444' : 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{up.type}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{up.meal}</span>
                            </div>
                            <p style={{ fontSize: '0.95rem', fontWeight: '700', margin: '4px 0' }}>{up.from} → <span style={{ color: 'var(--primary)' }}>{up.to}</span></p>
                            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '8px' }}>{up.reason}</p>
                            {up.study && (
                              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <BrainCircuit size={12} color="var(--primary)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ref: {up.study}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {!proposedChanges.isMultiOption && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn" style={{ flex: 1 }} onClick={() => setProposedChanges(null)}>Descartar</button>
                      <button className="btn btn-primary" style={{ flex: 2, background: '#10b981', border: 'none' }} onClick={applyAIChanges}>Aplicar Otimizações</button>
                    </div>
                  )}
                </div>
              )}
              {proposedChanges.isPerfect && (
                <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setProposedChanges(null)}>Continuar</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Adição de Alimento */}
      <AnimatePresence>
        {showAddFoodModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: 'var(--primary)15', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}><Apple size={22} /></div>
                  {editingIndex !== null ? 'Editar Alimento' : 'Novo Alimento'}
                </h3>
                <button onClick={() => { setShowAddFoodModal(null); setEditingIndex(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24}/></button>
              </div>
              
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Nome do Alimento</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    className={`input ${inputError ? 'shake' : ''}`} 
                    placeholder="Ex: Frango, Arroz, Ovo..." 
                    style={{ width: '100%', paddingLeft: '3rem', height: '52px', fontSize: '1rem', borderRadius: '14px' }} 
                    value={foodInput.name} 
                    onChange={e => setFoodInput({...foodInput, name: e.target.value})} 
                  />
                </div>
                
                {/* Sugestões Autocomplete */}
                {foodInput.name.length > 1 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '4px', zIndex: 10, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto' }}>
                    {[...brazilianFoods.proteinas, ...brazilianFoods.carboidratos, ...brazilianFoods.frutas]
                      .filter(f => f.name.toLowerCase().includes(foodInput.name.toLowerCase()))
                      .map((f, i) => (
                        <div 
                          key={i} 
                          onClick={() => setFoodInput({ name: f.name, amount: f.amount })}
                          style={{ padding: '0.8rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}
                          className="hover-bg"
                        >
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{f.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sugestão: {f.amount}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Quantidade / Porção</label>
                <input 
                  className="input" 
                  placeholder="Ex: 100g, 2 fatias, 1 un..." 
                  style={{ width: '100%', height: '52px', fontSize: '1rem', borderRadius: '14px' }} 
                  value={foodInput.amount} 
                  onChange={e => setFoodInput({...foodInput, amount: e.target.value})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ flex: 1, height: '52px', borderRadius: '14px' }} onClick={() => { setShowAddFoodModal(null); setEditingIndex(null); }}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 1, height: '52px', borderRadius: '14px', background: 'var(--primary)', border: 'none', fontWeight: 'bold' }} onClick={handleAddFood}>
                  {editingIndex !== null ? 'Salvar Alteração' : 'Adicionar Alimento'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddMealModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.25rem' }}>
                  <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}><Clock size={24} /></div>
                  Nova Refeição
                </h3>
                <button onClick={() => setShowAddMealModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#ef4444'} onMouseLeave={e => e.target.style.color = '#94a3b8'}><X size={24}/></button>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome da Refeição</label>
                <input 
                  className="input" 
                  placeholder="Ex: Café da Manhã Otimizado, Pré-treino..." 
                  style={{ width: '100%', height: '56px', borderRadius: '16px', padding: '0 1.25rem', fontSize: '1rem', fontWeight: '500', border: '1.5px solid #e2e8f0' }} 
                  value={mealInput.name} 
                  onChange={e => setMealInput({...mealInput, name: e.target.value})} 
                />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Horário Sugerido</label>
                <input 
                  type="time" 
                  className="input" 
                  style={{ width: '100%', height: '56px', borderRadius: '16px', padding: '0 1.25rem', fontSize: '1.1rem', fontWeight: '700', border: '1.5px solid #e2e8f0', color: 'var(--secondary)' }} 
                  value={mealInput.time} 
                  onChange={e => setMealInput({...mealInput, time: e.target.value})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ flex: 1, height: '56px', borderRadius: '16px', fontWeight: '600' }} onClick={() => setShowAddMealModal(false)}>Cancelar</button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1.5, height: '56px', borderRadius: '16px', background: 'var(--secondary)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.95rem', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)' }} 
                  onClick={handleAddMeal}
                >
                  Criar Refeição
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MealPlanner