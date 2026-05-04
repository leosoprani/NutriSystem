import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatService } from '../services/api'
import { 
  Home, 
  Apple, 
  Activity, 
  MessageCircle, 
  User, 
  Bell, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Camera,
  Sparkles,
  ClipboardList,
  Send,
  LogOut,
  Droplets,
  Pill,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  Plus,
  FileText
} from 'lucide-react'

const MobileNavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '4px',
      background: 'none',
      border: 'none',
      color: active ? 'var(--primary)' : '#94a3b8',
      cursor: 'pointer',
      padding: '8px',
      transition: 'all 0.3s ease'
    }}
  >
    <motion.div
      animate={{ scale: active ? 1.2 : 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Icon size={22} />
    </motion.div>
    <span style={{ fontSize: '10px', fontWeight: active ? '700' : '500' }}>{label}</span>
  </button>
)

const ProgressCircle = ({ percentage, color, label, value }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle 
            cx="40" cy="40" r={radius} fill="none" 
            stroke={color} strokeWidth="6" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{percentage}%</span>
        </div>
      </div>
      <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontWeight: 'bold' }}>{label}</p>
      <p style={{ fontSize: '12px', fontWeight: '700' }}>{value}</p>
    </div>
  )
}

const PatientPortal = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState('home')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [meals, setMeals] = useState([])
  const [orientations, setOrientations] = useState([])
  const [evolution, setEvolution] = useState(null)

  // Fetch Data (Meals, Evolution, Messages)
  useEffect(() => {
    if (patient?.id) {
      const fetchData = async () => {
        try {
          // Busca Plano Alimentar
          const planResponse = await fetch(`${API_URL}/meal_plans.php?patient_id=${patient.id}`)
          const planData = await planResponse.json()
          if (planData.success && planData.plan) {
            try {
              const content = typeof planData.plan.content === 'string' ? JSON.parse(planData.plan.content) : planData.plan.content
              setMeals(Array.isArray(content) ? content : []);
            } catch(e) { 
              console.log("Plano não está em formato JSON");
            }
          }

          // Busca Mensagens
          const msgData = await chatService.getMessages(patient.id)
          setMessages(msgData)
        } catch (error) {
          console.error('Erro ao buscar dados:', error)
        }
      }
      
      fetchData()
      const interval = setInterval(fetchData, 4000)
      return () => clearInterval(interval)
    }
  }, [patient?.id])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !patient?.id) return
    const textToSend = newMessage;
    setNewMessage('');
    
    try {
      await chatService.sendMessage(patient.id, 'patient', textToSend)
      setMessages(prev => [...prev, { sender: 'patient', text: textToSend, created_at: new Date().toISOString() }])
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: window.innerWidth > 500 ? '430px' : '100%', 
      height: window.innerWidth > 500 ? '844px' : '100vh', 
      backgroundColor: '#f8fafc', 
      margin: '0 auto', 
      borderRadius: window.innerWidth > 500 ? '40px' : '0', 
      border: window.innerWidth > 500 ? '12px solid #0f172a' : 'none',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    }}>
      
      {/* Header Mobile - Premium */}
      <div style={{ padding: '30px 24px 15px', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '45px', height: '45px', borderRadius: '15px', 
              backgroundColor: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '900', fontSize: '18px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}>
              {patient?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '900', margin: 0 }}>{patient?.name}</h2>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{patient?.plan_type || 'Plano Nutricional'}</p>
            </div>
          </div>
          <button onClick={onBack} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', color: 'white', border: 'none', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ fontSize: '12px', opacity: 0.8 }}>Engajamento de Hoje</p>
                      <h3 style={{ fontSize: '28px', fontWeight: '900', margin: '4px 0', color: 'white' }}>85%</h3>
                    </div>
                    <Sparkles size={24} style={{ opacity: 0.5 }} />
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginTop: '15px' }}>
                    <div style={{ width: '85%', height: '100%', backgroundColor: 'white', borderRadius: '4px' }}></div>
                  </div>
               </div>

               <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '20px 0 12px' }}>VITAIS</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <Droplets size={24} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '10px', fontWeight: 'bold' }}>ÁGUA</p>
                    <p style={{ fontWeight: '900' }}>1.8L / 3L</p>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <Activity size={24} color="#ef4444" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '10px', fontWeight: 'bold' }}>PESO</p>
                    <p style={{ fontWeight: '900' }}>72.5 kg</p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>ÚLTIMA CONSULTA: {clinicalResults.date}</span>
                  <TrendingUp size={16} color="var(--primary)" />
                </div>
                
                <div style={{ padding: '0 16px' }}>
                  {[
                    { label: 'IMC', value: `${clinicalResults.imc} - ${clinicalResults.imcStatus}` },
                    { label: '% Gordura', value: `${clinicalResults.fatPct}% - Adequado` },
                    { label: 'Gordura Absoluta', value: `${clinicalResults.fatMass} kg` },
                    { label: 'Massa Magra', value: `${clinicalResults.leanMass} kg` },
                    { label: 'Peso Ideal', value: `${clinicalResults.idealWeight} kg` },
                    { label: 'Excesso de Peso', value: `${clinicalResults.excessWeight} kg`, color: '#ef4444' }
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{row.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: row.color || 'var(--secondary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orientations' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {orientations.map((section, i) => (
                  <div key={i} className="card" style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>{section.title.toUpperCase()}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {section.items.map((item, j) => (
                        <li key={j} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
             </motion.div>
          )}

          {activeTab === 'recipes' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="card" style={{ padding: 0 }}>
                {['Brownie Fit', 'Omelete de Forno', 'Shake Proteico'].map((r, i) => (
                  <div key={i} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}><Utensils size={18} color="var(--primary)" /></div>
                      <span style={{ fontWeight: '800', fontSize: '14px', textTransform: 'uppercase' }}>{r}</span>
                    </div>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'dieta' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               {meals.map(meal => (
                 <div key={meal.id} className="card" style={{ marginBottom: '12px', borderLeft: '4px solid var(--primary)' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--primary)' }}>{meal.time}</span>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '14px' }}>{meal.name}</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>{meal.item}</p>
                      </div>
                   </div>
                 </div>
               ))}
             </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ height: 'calc(100% - 100px)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '50px', color: '#94a3b8' }}>
                    <MessageCircle size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                    <p>Nenhuma mensagem ainda.</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start', 
                        backgroundColor: msg.sender === 'patient' ? 'var(--primary)' : 'white', 
                        color: msg.sender === 'patient' ? 'white' : 'var(--secondary)',
                        padding: '12px 16px', 
                        borderRadius: msg.sender === 'patient' ? '18px 18px 0 18px' : '18px 18px 18px 0', 
                        maxWidth: '85%', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                    >
                      <p>{msg.text}</p>
                      <span style={{ 
                        fontSize: '9px', 
                        color: msg.sender === 'patient' ? 'rgba(255,255,255,0.7)' : '#94a3b8', 
                        marginTop: '4px', 
                        display: 'block',
                        textAlign: 'right'
                      }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              
              <div style={{ position: 'absolute', bottom: '90px', left: '15px', right: '15px', display: 'flex', gap: '8px', backgroundColor: 'white', padding: '10px', borderRadius: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <input 
                  className="input" 
                  placeholder="Digite sua mensagem..." 
                  style={{ border: 'none', backgroundColor: 'transparent', padding: '5px 15px' }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav - Fixado no rodapé */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        padding: '12px 10px 30px', display: 'flex', justifyContent: 'space-around',
        boxShadow: '0 -4px 15px rgba(0,0,0,0.08)', borderTop: '1px solid #f1f5f9',
        zIndex: 2000,
        maxWidth: window.innerWidth > 500 ? '430px' : '100%',
        margin: '0 auto'
      }}>
        <MobileNavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <MobileNavItem icon={Apple} label="Plano" active={activeTab === 'dieta'} onClick={() => setActiveTab('dieta')} />
        <MobileNavItem icon={MessageCircle} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <MobileNavItem icon={Utensils} label="Receita" active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} />
        <MobileNavItem icon={Activity} label="Dados" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
      </div>
      {/* Floating Back Button for Nutri View - Desktop Only */}
      {window.innerWidth > 500 && (
        <button 
          onClick={onBack}
          style={{ 
            position: 'absolute', 
            top: '60px', 
            left: '-60px', 
            backgroundColor: '#0f172a', 
            color: 'white', 
            border: 'none', 
            padding: '14px', 
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
          }}
        >
          <ChevronLeft size={24} />
        </button>
      )}
    </div>
  )
}

export default PatientPortal
