import React, { useState, useMemo, useEffect } from 'react'
import { Utensils, Search, Plus, Clock, Users, ChevronRight, Sparkles, AlertTriangle, CheckCircle, RefreshCw, Flame, Heart, X, BookOpen, Filter, MapPin, List, Eye, Trash2, Grid, Camera, Printer, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Importando imagens locais (fallback)
// Nota: Se as imagens não existirem no ambiente atual, usaremos URLs da Unsplash
const foodImages = {
  cuscuz: "1594879002453-df2672a2745a",
  cheese_bread: "1598143158332-4e946f56209c",
  avocado: "1544145945-f904253d0c71",
  pancakes: "1528207776546-365bb710ee93",
  crepioca: "1519676867240-f03562e64548",
  feijoada: "1547592166-23ac45744acd",
  potatoes: "1518977676601-b53f02ac6d31",
  fish: "1519708227418-c8fd9a32b7a2",
  rice_beans: "1546069901-ba9599a7e63c",
  chicken: "1604908176997-125f25cc6f3d",
  steak: "1600891964092-4316c28b032e",
  soup: "1547592166-23ac45744acd",
  salad: "1512621776951-a57141f2eefd",
  muffin: "1586788690411-93b719716005",
  chocolate: "1590301157890-4810ed352733",
  yogurt: "1488477181946-6428a0291777",
  cake: "1533134242443-d4fd215305ad",
  healthy: "1546069901-eacef0df6022"
}

const getImgUrl = (key) => {
  if (key && (key.startsWith('data:') || key.startsWith('http'))) return key
  return `https://images.unsplash.com/photo-${foodImages[key] || foodImages.healthy}?auto=format&fit=crop&q=80&w=400`
}

const initialGlobalRecipes = [
  { id: 1, title: "Cuscuz Nordestino com Ovos", time: "10 min", category: "Café da Manhã", calories: 240, difficulty: "Fácil", tags: ["Regional", "Proteico"], image: "cuscuz", ingredients: ["50g Flocão de milho", "2 Ovos", "Sal a gosto"], steps: "Hidrate o flocão, cozinhe no vapor e sirva com os ovos mexidos." },
  { id: 2, title: "Pão de Queijo de Tapioca", time: "8 min", category: "Café da Manhã", calories: 195, difficulty: "Fácil", tags: ["Sem Glúten", "Prático"], image: "cheese_bread", ingredients: ["1 Ovo", "2 colheres de goma de tapioca", "1 colher de requeijão light"], steps: "Misture tudo e asse na frigideira até dourar." },
  { id: 3, title: "Vitamina de Abacate e Coco", time: "5 min", category: "Café da Manhã", calories: 210, difficulty: "Fácil", tags: ["Gorduras Boas", "Vegano"], image: "avocado", ingredients: ["1/4 Abacate", "200ml Leite de coco", "Adoçante"], steps: "Bata tudo no liquidificador com gelo." },
  { id: 4, title: "Panqueca de Aveia e Mel", time: "12 min", category: "Café da Manhã", calories: 230, difficulty: "Fácil", tags: ["Fibras", "Energia"], image: "pancakes", ingredients: ["1 Ovo", "2 colheres de aveia", "1 banana madura"], steps: "Amasse a banana, misture com o ovo e aveia, e asse em fogo baixo." },
  { id: 5, title: "Crepioca de Queijo Minas", time: "10 min", category: "Café da Manhã", calories: 220, difficulty: "Fácil", tags: ["Proteico", "Rápido"], image: "crepioca", ingredients: ["1 Ovo", "2 colheres de tapioca", "30g Queijo minas"], steps: "Bata o ovo com a tapioca e recheie com o queijo na frigideira." },
  { id: 6, title: "Feijoada Light NutriSystem", time: "50 min", category: "Almoço", calories: 410, difficulty: "Médio", tags: ["Proteico", "Brasil"], image: "feijoada", ingredients: ["100g Feijão preto", "80g Lombo suíno", "Couve", "Laranja"], steps: "Cozinhe o feijão com as carnes magras e sirva com couve refogada." },
  { id: 8, title: "Escondidinho de Batata Doce", time: "40 min", category: "Almoço", calories: 350, difficulty: "Médio", tags: ["Energia", "Marmita"], image: "potatoes", ingredients: ["150g Batata doce", "100g Frango desfiado", "Temperos"], steps: "Faça um purê com a batata e intercale com o frango no forno." },
  { id: 9, title: "Moqueca de Peixe Fit", time: "30 min", category: "Almoço", calories: 290, difficulty: "Médio", tags: ["Regional", "Leve"], image: "fish", ingredients: ["150g Tilápia", "Leite de coco light", "Pimentões"], steps: "Cozinhe o peixe com os temperos e o leite de coco por 15 min." },
  { id: 10, title: "Baião de Dois Integral", time: "35 min", category: "Almoço", calories: 340, difficulty: "Médio", tags: ["Fibras", "Nordeste"], image: "rice_beans", ingredients: ["Arroz integral", "Feijão de corda", "Queijo coalho light"], steps: "Cozinhe os grãos juntos e finalize com o queijo em cubos." },
  { id: 11, title: "Frango Teriyaki Fit", time: "25 min", category: "Almoço", calories: 310, difficulty: "Fácil", tags: ["Proteico", "Prático"], image: "chicken", ingredients: ["120g Frango", "Brócolis", "Shoyu coco"], steps: "Grelhe o frango com brócolis e adicione o molho." },
  { id: 12, title: "Bife Acebolado com Arroz e Feijão", time: "20 min", category: "Almoço", calories: 430, difficulty: "Fácil", tags: ["Clássico", "Brasil"], image: "steak", ingredients: ["100g Alcatra", "Arroz integral", "Feijão"], steps: "Grelhe o bife, refogue as cebolas e sirva com os grãos." },
  { id: 13, title: "Caldo Verde Light", time: "30 min", category: "Jantar", calories: 190, difficulty: "Fácil", tags: ["Sopa", "Leve"], image: "soup", ingredients: ["Batata doce", "Couve", "Paio magro"], steps: "Cozinhe a batata, bata e adicione a couve picada." },
  { id: 14, title: "Salada Caesar Premium", time: "15 min", category: "Jantar", calories: 280, difficulty: "Fácil", tags: ["Leve", "Low Carb"], image: "salad", ingredients: ["Alface", "Frango", "Parmesão"], steps: "Misture tudo com molho de iogurte." },
  { id: 15, title: "Muffin de Maçã e Canela", time: "20 min", category: "Lanches", calories: 150, difficulty: "Fácil", tags: ["Doce Fit", "Fibra"], image: "muffin", ingredients: ["Aveia", "Maçã", "Ovo"], steps: "Asse em forminhas por 15 min." },
  { id: 16, title: "Brigadeiro de Biomassa", time: "10 min", category: "Sobremesas", calories: 70, difficulty: "Fácil", tags: ["Chocolate", "Zero Açúcar"], image: "chocolate", ingredients: ["Biomassa", "Cacau", "Mel"], steps: "Misture no fogo até dar ponto." },
  { id: 17, title: "Iogurte com Granola", time: "2 min", category: "Lanches", calories: 180, difficulty: "Fácil", tags: ["Rápido"], image: "yogurt", ingredients: ["Iogurte", "Granola"], steps: "Sirva gelado." },
  { id: 18, title: "Pudim Fit de Leite", time: "40 min", category: "Sobremesas", calories: 130, difficulty: "Médio", tags: ["Doce Fit"], image: "cake", ingredients: ["Leite desnatado", "Ovo", "Xilitol"], steps: "Asse em banho-maria." }
]

const RecipesLibrary = ({ onSendToPatient }) => {
  const [recipes, setRecipes] = useState(initialGlobalRecipes)
  const [activeTab, setActiveTab] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [analyzingRecipe, setAnalyzingRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('recipes_view_mode') || 'grid')
  
  useEffect(() => {
    localStorage.setItem('recipes_view_mode', viewMode)
  }, [viewMode])

  const [newRecipe, setNewRecipe] = useState({ title: '', category: 'Almoço', calories: '', time: '', ingredients: '', steps: '', image: null })

  const categories = ['Todas', 'Café da Manhã', 'Almoço', 'Lanches', 'Jantar', 'Sobremesas']

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesTab = activeTab === 'Todas' || r.category === activeTab
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [recipes, activeTab, searchTerm])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewRecipe({ ...newRecipe, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateRecipe = () => {
    const recipe = { 
      id: Date.now(), 
      ...newRecipe, 
      difficulty: 'Fácil', 
      tags: ['Personalizada'], 
      image: newRecipe.image || 'healthy' 
    }
    setRecipes([recipe, ...recipes])
    setShowCreateModal(false)
    setNewRecipe({ title: '', category: 'Almoço', calories: '', time: '', ingredients: '', steps: '', image: null })
  }

  const renderRecipeCard = (recipe) => (
    <motion.div layout key={recipe.id} className="card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
      <div style={{ height: '180px', position: 'relative' }}>
        <img src={getImgUrl(recipe.image)} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          {recipe.category}
        </div>
      </div>
      <div style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', height: '2.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{recipe.title}</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {recipe.time}</span>
          <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{recipe.calories} kcal</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={() => setSelectedRecipe(recipe)} style={{ flex: 1, padding: '0.5rem' }}><Eye size={14}/> Detalhes</button>
          <button className="btn btn-primary" onClick={() => onSendToPatient(recipe)} style={{ flex: 1, padding: '0.5rem' }}><Send size={14}/> Enviar</button>
        </div>
      </div>
    </motion.div>
  )

  const renderRecipeList = () => {
    const grouped = filteredRecipes.reduce((acc, recipe) => {
      if (!acc[recipe.category]) acc[recipe.category] = []
      acc[recipe.category].push(recipe)
      return acc
    }, {})

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', borderLeft: '4px solid var(--primary)', paddingLeft: '0.75rem' }}>{category}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {items.map(recipe => (
                <div key={recipe.id} className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => setSelectedRecipe(recipe)}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={getImgUrl(recipe.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontWeight: '700' }}>{recipe.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recipe.time} • {recipe.calories} kcal</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" onClick={() => setSelectedRecipe(recipe)} style={{ padding: '0.5rem' }}><Eye size={16}/></button>
                    <button className="btn btn-primary" onClick={() => onSendToPatient(recipe)} style={{ padding: '0.5rem' }}><Send size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', color: 'white', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div><h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Biblioteca Global</h2><p>5.000+ receitas aprovadas para você prescrever.</p></div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ backgroundColor: 'white', color: '#064e3b', fontWeight: '800', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}><Plus size={20} /> Criar Receita</button>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={22} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Buscar receita..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '1rem 1rem 1rem 4rem', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '1rem', color: '#1f2937' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.25rem 0' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={activeTab === cat ? 'btn btn-primary' : 'btn'} style={{ borderRadius: '12px', padding: '0.6rem 1.5rem', whiteSpace: 'nowrap' }}>{cat}</button>
          ))}
        </div>
        <div style={{ display: 'flex', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '10px', gap: '0.25rem' }}>
          <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: viewMode === 'grid' ? 'white' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }} title="Grade"><Grid size={18} color={viewMode === 'grid' ? 'var(--primary)' : '#9ca3af'} /></button>
          <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: viewMode === 'list' ? 'white' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }} title="Lista"><List size={18} color={viewMode === 'list' ? 'var(--primary)' : '#9ca3af'} /></button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {filteredRecipes.map(recipe => renderRecipeCard(recipe))}
        </div>
      ) : renderRecipeList()}

      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9000, display: 'flex', justifyContent: 'center', padding: '2rem 1rem', backdropFilter: 'blur(10px)', overflowY: 'auto' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: '100%', maxWidth: '900px', padding: '2.5rem', margin: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Plus size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Cadastrar Nova Receita</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Título da Receita</label>
                    <input className="input" placeholder="Ex: Panqueca de Whey e Aveia" style={{ width: '100%' }} value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Categoria</label>
                      <select className="input" style={{ width: '100%' }} value={newRecipe.category} onChange={e => setNewRecipe({...newRecipe, category: e.target.value})}>
                        {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Calorias (kcal)</label>
                      <input className="input" type="number" placeholder="0" style={{ width: '100%' }} value={newRecipe.calories} onChange={e => setNewRecipe({...newRecipe, calories: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Foto da Receita</label>
                    <div style={{ padding: '1.5rem', border: '2px dashed #e2e8f0', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '120px', height: '120px', borderRadius: '20px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        {newRecipe.image ? (
                          <img src={getImgUrl(newRecipe.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Camera size={40} color="#cbd5e1" />
                        )}
                      </div>
                      <label className="btn btn-secondary" style={{ cursor: 'pointer', backgroundColor: 'white', fontSize: '0.75rem', padding: '8px 16px' }}>
                        <Plus size={14} /> Selecionar Foto
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Ingredientes</label>
                    <textarea className="input" placeholder="Dica: Um ingrediente por linha..." style={{ width: '100%', height: '120px', padding: '1rem', lineHeight: '1.6' }} value={newRecipe.ingredients} onChange={e => setNewRecipe({...newRecipe, ingredients: e.target.value})} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Modo de Preparo</label>
                    <textarea className="input" placeholder="Explique o passo a passo..." style={{ width: '100%', height: '120px', padding: '1rem', lineHeight: '1.6' }} value={newRecipe.steps} onChange={e => setNewRecipe({...newRecipe, steps: e.target.value})} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
                    <button className="btn" onClick={() => setShowCreateModal(false)} style={{ flex: 1, height: '50px', borderRadius: '12px' }}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleCreateRecipe} style={{ flex: 2, height: '50px', borderRadius: '12px', fontSize: '1rem' }}>Salvar Receita</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecipe && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="card" style={{ width: '100%', maxWidth: '600px', padding: '0', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ height: '250px', position: 'relative' }}>
                <img src={getImgUrl(selectedRecipe.image)} alt={selectedRecipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setSelectedRecipe(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{selectedRecipe.category}</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{selectedRecipe.title}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444', margin: 0 }}>{selectedRecipe.calories} <span style={{ fontSize: '0.85rem' }}>kcal</span></p>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}><Clock size={14} /> {selectedRecipe.time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                  {selectedRecipe.tags && selectedRecipe.tags.map(tag => (
                    <span key={tag} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Utensils size={18} color="var(--primary)" /> Ingredientes</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    {Array.isArray(selectedRecipe.ingredients) ? selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem', color: '#374151' }}>{ing}</li>
                    )) : <li style={{ color: '#374151' }}>{selectedRecipe.ingredients}</li>}
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={18} color="var(--primary)" /> Modo de Preparo</h4>
                  <p style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{selectedRecipe.steps}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setSelectedRecipe(null)} style={{ flex: 1, padding: '1rem' }}>Fechar</button>
                  <button className="btn btn-primary" onClick={() => window.print()} style={{ flex: 1, padding: '1rem' }}>
                    <Printer size={18} /> Imprimir Receita
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

export default RecipesLibrary
