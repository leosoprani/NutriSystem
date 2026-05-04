import React, { useState, useEffect } from 'react'
import {
  Users, Calendar, Apple, Activity, Settings as SettingsIcon, LogOut, Plus, Search, Bell,
  ChevronRight, TrendingUp, Clock, Ruler, ClipboardList, PenTool, Watch, Camera,
  FileText, Pill, Utensils, DollarSign, Smartphone, User, Info, X, Mail, MessageCircle, Printer, Shield, Trash2, Home, Sparkles,
  Wifi, WifiOff, Menu, Brain, Target, CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Anthropometry from './components/Anthropometry'
import PatientPortal from './components/PatientPortal'
import Anamnesis from './components/Anamnesis'
import PatientForm from './components/PatientForm'
import Settings from './components/Settings'
import RecipesLibrary from './components/RecipesLibrary'
import DietPlan from './components/DietPlan'
import PatientGoals from './components/PatientGoals'
import NutritionalOrientation from './components/NutritionalOrientation'
import LabExamsAI from './components/LabExamsAI'
import Exams from './components/Exams'
import Financial from './components/Financial'
import Notifications from './components/Notifications'
import Schedule from './components/Schedule'
import PhotoEvolution from './components/PhotoEvolution'
import Supplementation from './components/Supplementation'
import PreConsultation from './components/PreConsultation'
import Login from './components/Login'
import Messages from './components/Messages'
import DigitalSignature from './components/DigitalSignature'
import Wearables from './components/Wearables'
import PatientHistory from './components/PatientHistory'
import { History as HistoryIcon } from 'lucide-react'
import { generateMealPlanPDF, generateEvolutionPDF, generateExamsPDF, generateAnamnesisPDF, generateRecipesPDF } from './utils/pdfGenerator'
import SetupWizard from './components/SetupWizard'
import AdminMaster from './components/AdminMaster'
import FoodRecall from './components/FoodRecall'
import Support from './components/Support'
import { securityService } from './services/securityService'
import { API_URL } from './services/apiConfig'

// Componente de Status de Conexão (Elegante e discreto)
const ConnectionStatus = () => {
  const [online, setOnline] = useState(navigator.onLine)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleStatus = () => {
      setOnline(navigator.onLine)
      setShow(true)
      if (navigator.onLine) {
        setTimeout(() => setShow(false), 3000)
      }
    }
    window.addEventListener('online', handleStatus)
    window.addEventListener('offline', handleStatus)

    // Mostra inicialmente se estiver offline
    if (!navigator.onLine) setShow(true)

    return () => {
      window.removeEventListener('online', handleStatus)
      window.removeEventListener('offline', handleStatus)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            backgroundColor: online ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            color: 'white',
            padding: '0.6rem 1.5rem',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '800',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {online ? <Wifi size={16} /> : <WifiOff size={16} />}
          {online ? 'Conexão Restaurada' : 'Você está offline'}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const NavGroup = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <p style={{
      fontSize: '0.65rem',
      fontWeight: '800',
      color: 'rgba(255,255,255,0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: '1rem',
      paddingLeft: '1.25rem'
    }}>
      {title}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {children}
    </div>
  </div>
)

const NavItem = ({ icon: Icon, label, active, onClick, badge, customStyle }) => (
  <motion.a
    href="#"
    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
    whileTap={{ scale: 0.98 }}
    className={`nav-item ${active ? 'active' : ''}`}
    onClick={(e) => {
      e.preventDefault();
      onClick();
      window.dispatchEvent(new CustomEvent('closeSidebar'));
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0.75rem 1.25rem',
      borderRadius: '12px',
      color: active ? 'white' : 'rgba(255,255,255,0.6)',
      backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: active ? '700' : '500',
      transition: 'all 0.2s ease',
      position: 'relative',
      borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
      ...customStyle
    }}
  >
    <Icon size={20} style={{ color: active ? 'var(--primary)' : 'inherit' }} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge > 0 && (
      <span style={{
        backgroundColor: '#ef4444',
        color: 'white',
        fontSize: '0.65rem',
        padding: '2px 8px',
        borderRadius: '10px',
        fontWeight: '900'
      }}>
        {badge}
      </span>
    )}
  </motion.a>
)

const StatCard = ({ label, value, trend, icon: Icon, color, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
    animate={{ opacity: 1, y: 0 }}
    className="card"
    style={{
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
    onClick={onClick}
  >
    <div style={{
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      width: '100px',
      height: '100px',
      background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
      zIndex: 0
    }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative', zIndex: 1 }}>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--secondary)' }}>{value}</h3>
        {trend && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '0.5rem',
            padding: '2px 8px',
            backgroundColor: 'var(--primary)15',
            borderRadius: '6px'
          }}>
            <TrendingUp size={12} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '700' }}>{trend}</span>
          </div>
        )}
      </div>
      <div style={{ backgroundColor: `${color}15`, color: color, padding: '0.8rem', borderRadius: '14px' }}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
)

const Dashboard = ({ patients, onPatientClick, onTabChange, nutriName }) => {
  const isSecretary = securityService.getSecureItem('is_secretary') === true

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{
        padding: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        color: 'var(--secondary)',
        border: '1px solid #dcfce7',
        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.05)'
      }}>
        <div>
          <p style={{ color: '#475569', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.02em' }}>
            {isSecretary ? 'Gerencie a agenda e pacientes do consultório com facilidade.' : 'Você tem 4 consultas agendadas para hoje.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isSecretary ? (
            <button className="btn btn-primary" onClick={() => onTabChange('Agenda')} style={{ padding: '0 2.5rem', height: '60px', fontSize: '1.1rem', borderRadius: '18px', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)' }}>
              <Calendar size={22} /> Agendar Nova Consulta
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onTabChange('Evolucao')}
              style={{ padding: '0 2.5rem', height: '60px', fontSize: '1.1rem', borderRadius: '18px', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)' }}
            >
              <Plus size={22} /> Nova Evolução
            </button>
          )}
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <StatCard label="Total de Pacientes" value={patients.length} trend="+12%" icon={Users} color="#10b981" onClick={() => onTabChange('Pacientes')} />
        <StatCard label="Consultas este Mês" value="48" trend="+5%" icon={Calendar} color="#3b82f6" onClick={() => onTabChange('Agenda')} />
        <StatCard label="Faturamento (Abril)" value="R$ 12.450" trend="+15%" icon={DollarSign} color="#f59e0b" onClick={() => onTabChange('Financeiro')} />
        <StatCard label="Nível de Adesão" value="88%" trend="+2%" icon={Activity} color="#8b5cf6" onClick={() => onTabChange('Pacientes')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
        {/* Coluna da Esquerda: Pacientes Recentes */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Pacientes Recentes</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Últimas movimentações nos prontuários</p>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={() => onTabChange('Pacientes')}>Ver Todos</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {patients.slice(0, 5).map(p => (
              <motion.div
                key={p.id}
                whileHover={{ x: 10, backgroundColor: '#f1f5f9' }}
                onClick={() => onPatientClick(p)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'border 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--secondary)' }}>{p.name}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.plan_type === 'Premium' ? 'var(--primary)' : '#94a3b8' }}></div>
                      {p.plan_type}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--border)" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Agenda e Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card hover-bg" style={{ cursor: 'pointer' }} onClick={() => onTabChange('Agenda')}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Próximas Consultas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { date: '25/04', time: '09:00', name: 'Ana Beatriz Silva', type: 'Retorno' },
                { date: '25/04', time: '10:30', name: 'Carlos Eduardo', type: 'Primeira Vez' },
                { date: '25/04', time: '14:00', name: 'Mariana Oliveira', type: 'Acompanhamento' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#f1f5f9', minWidth: '70px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>{c.date}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{c.time}</p>
                  </div>
                  <div><p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{c.name}</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.type}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass hover-bg" style={{ borderLeft: '4px solid var(--primary)', cursor: 'pointer' }} onClick={() => onTabChange('Mensagens')}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--primary)" /> Feed de Engajamento
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Ana Beatriz', action: 'Bateu a meta de água!', time: 'há 2 min', color: '#3b82f6' },
                { name: 'Carlos Eduardo', action: 'Registrou o almoço (100% Plano)', time: 'há 15 min', color: '#10b981' },
                { name: 'Mariana Silva', action: 'Nova mensagem enviada', time: 'há 1 hora', color: '#8b5cf6' }
              ].map((feed, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: '4px', height: '100%', backgroundColor: feed.color, borderRadius: '2px' }}></div>
                  <div style={{ flex: 1 }}>
                    <p><strong>{feed.name}</strong> {feed.action}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{feed.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass hover-bg" style={{ borderLeft: '4px solid #3b82f6', cursor: 'pointer' }} onClick={() => onTabChange('Wearables')}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Watch size={20} color="#3b82f6" /> Radar Bio-Integrado
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Monitoramento de dispositivos móveis e wearables em tempo real.</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Apple Health', 'Garmin', 'Strava'].map(device => (
                <div key={device} style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', backgroundColor: '#f1f5f9', fontSize: '0.7rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                  {device}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PatientList = ({ patients, onPatientClick }) => (
  <div className="card" style={{ padding: '0' }}>
    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '1.1rem' }}>Pacientes Cadastrados ({patients.length})</h3>
      <button onClick={() => window.dispatchEvent(new CustomEvent('openPatientForm'))} className="btn btn-primary"><Plus size={18} /> Novo Paciente</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr', padding: '1rem 1.5rem', backgroundColor: '#f8fafc', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
      <div>Nome</div><div>E-mail</div><div>Objetivo</div><div>Status</div><div style={{ textAlign: 'right' }}>Ações de Acesso</div>
    </div>
    {patients.map(p => (
      <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', alignItems: 'center' }} className="hover-bg">
        <div onClick={() => onPatientClick(p)} style={{ fontWeight: '600', cursor: 'pointer' }}>{p.name}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{p.email}</div>
        <div style={{ fontSize: '0.875rem' }}>{p.plan_type}</div>
        <div><span className={`badge ${p.status === 'Ativo' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span></div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('toggleStatus', { detail: p.id })) }}
            style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: p.status === 'Ativo' ? '#fee2e2' : '#dcfce7', color: p.status === 'Ativo' ? '#ef4444' : '#166534', cursor: 'pointer' }}
          >
            {p.status === 'Ativo' ? 'Bloquear' : 'Ativar'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); alert('Acesso renovado por mais 30 dias!') }}
            style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: '#f1f5f9', cursor: 'pointer' }}
          >
            Renovar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('deletePatient', { detail: p.id })) }}
            style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #fee2e2', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer' }}
            title="Excluir Prontuário (Direito ao Esquecimento)"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    ))}
  </div>
)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(securityService.getSecureItem('is_auth') === true)
  const [isConfigured, setIsConfigured] = useState(securityService.getSecureItem('is_configured') === true)
  const [isSecretary, setIsSecretary] = useState(securityService.getSecureItem('is_secretary') === true)
  const [isMasterAdmin, setIsMasterAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [isPatientMode, setIsPatientMode] = useState(securityService.getSecureItem('is_patient_mode') === true)
  const [patients, setPatients] = useState([
    { id: 1, name: "Ana Beatriz Silva", email: "ana.beatriz@email.com", plan_type: "Hipertrofia", last_visit: "2026-04-25 10:30:00", status: "Ativo", password: "NUTRI-2026" },
    { id: 2, name: "Carlos Eduardo Santos", email: "carlos.edu@email.com", plan_type: "Emagrecimento", last_visit: "2026-04-24 15:00:00", status: "Ativo", password: "FIT-9876" },
    { id: 3, name: "Mariana Oliveira", email: "mari.oliveira@email.com", plan_type: "Performance", last_visit: "2026-04-23 09:00:00", status: "Aguardando", password: "GOAL-5544" }
  ])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [loggedPatient, setLoggedPatient] = useState(securityService.getSecureItem('logged_patient') || null)
  const [showPatientForm, setShowPatientForm] = useState(false)
  const [showPrintMenu, setShowPrintMenu] = useState(false)
  const [showPatientMenu, setShowPatientMenu] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [nutriName, setNutriName] = useState(securityService.getSecureItem('nutri_name') || 'Dr. Leonardo Silva')
  const [nutriEmail, setNutriEmail] = useState(securityService.getSecureItem('nutri_email') || 'contato@drleonardo.com.br')
  const [nutriAvatar, setNutriAvatar] = useState(securityService.getSecureItem('nutri_avatar') || '')

  const [messageCount, setMessageCount] = useState(2)

  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem('nutri_support_tickets')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        tenant: 'Dr. João Pereira',
        subject: 'Dúvida sobre PDF',
        priority: 'Alta',
        status: 'Aberto',
        messages: [
          { sender: 'user', text: 'Olá, como faço para gerar o PDF personalizado?', time: '01/05/2026 10:00:00' }
        ]
      },
      {
        id: 2,
        tenant: 'Dra. Ana Silva',
        subject: 'Erro no Login',
        priority: 'Média',
        status: 'Respondido',
        messages: [
          { sender: 'user', text: 'Não consigo acessar minha conta.', time: '02/05/2026 09:15:00' },
          { sender: 'admin', text: 'Olá Ana, verificamos que seu cadastro estava pendente. Já liberamos o acesso.', time: '02/05/2026 10:30:00' }
        ]
      },
    ]
  })

  useEffect(() => {
    localStorage.setItem('nutri_support_tickets', JSON.stringify(supportTickets))
  }, [supportTickets])

  const tenantId = securityService.getSecureItem('tenant_id');

  useEffect(() => {
    if (isAuthenticated && tenantId) {
      fetch(`${API_URL}/patients.php?tenant_id=${tenantId}`)
        .then(res => {
          if (!res.ok) throw new Error('Erro na resposta do servidor');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) setPatients(data);
        })
        .catch(err => {
          console.error("Erro ao carregar pacientes:", err);
        });
    }
  }, [isAuthenticated, tenantId]);

  useEffect(() => {
    const handleOpenForm = () => setShowPatientForm(true)
    const handleToggleStatus = (e) => {
      setPatients(prev => prev.map(p => p.id === e.detail ? { ...p, status: p.status === 'Ativo' ? 'Bloqueado' : 'Ativo' } : p))
    }
    const handleNewMessage = () => {
      setMessageCount(prev => prev + 1)
    }

    const handleDeletePatient = (e) => {
      const patientId = e.detail;
      if (confirm('ATENÇÃO: Esta ação é definitiva e apagará todos os dados clínicos deste paciente conforme a LGPD (Direito ao Esquecimento). Deseja continuar?')) {
        setPatients(prev => prev.filter(p => p.id !== patientId));
        if (selectedPatient && selectedPatient.id === patientId) {
          setSelectedPatient(null);
          setActiveTab('Pacientes');
        }
        alert('Prontuário removido com sucesso.');
      }
    }

    const handleOpenTab = (e) => setActiveTab(e.detail)

    const handleCloseSidebar = () => setIsSidebarOpen(false)

    window.addEventListener('openPatientForm', handleOpenForm)
    window.addEventListener('toggleStatus', handleToggleStatus)
    window.addEventListener('newPatientMessage', handleNewMessage)
    window.addEventListener('deletePatient', handleDeletePatient)
    window.addEventListener('openTab', handleOpenTab)
    window.addEventListener('closeSidebar', handleCloseSidebar)

    // Proteção contra Inspeção de Código (Bloqueio de cliques e atalhos)
    const blockInspect = (e) => {
      if (isMasterAdmin) return; // Se for Master, permite tudo

      // Bloquear Botão Direito
      if (e.type === 'contextmenu') e.preventDefault();

      // Bloquear Atalhos (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
      if (e.type === 'keydown') {
        if (
          e.keyCode === 123 || // F12
          (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
          (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
          (e.metaKey && e.altKey && e.keyCode === 73) // Cmd+Alt+I (Mac)
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    window.addEventListener('contextmenu', blockInspect);
    window.addEventListener('keydown', blockInspect);

    return () => {
      window.removeEventListener('openPatientForm', handleOpenForm)
      window.removeEventListener('toggleStatus', handleToggleStatus)
      window.removeEventListener('newPatientMessage', handleNewMessage)
      window.removeEventListener('deletePatient', handleDeletePatient)
      window.removeEventListener('openTab', handleOpenTab)
      window.removeEventListener('closeSidebar', handleCloseSidebar)
      window.removeEventListener('contextmenu', blockInspect);
      window.removeEventListener('keydown', blockInspect);
    }
  }, [isMasterAdmin])

  const [showPassModal, setShowPassModal] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMasterAccess = () => {
    if (passInput === 'nutrisystem10081944') {
      setIsMasterAdmin(true)
      setShowPassModal(false)
      setPassInput('')
    } else {
      alert('Senha incorreta!')
      setPassInput('')
    }
  }

  if (showPassModal) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
        <ConnectionStatus />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '320px', padding: '2rem', textAlign: 'center' }}>
          <Shield size={40} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ marginBottom: '1.5rem' }}>Acesso Restrito</h3>
          <input
            type="password"
            className="input"
            placeholder="Digite a senha"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              alert('Colar senha não é permitido por segurança.');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleMasterAccess()}
            style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '1.5rem' }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ flex: 1 }} onClick={() => setShowPassModal(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleMasterAccess}>Entrar</button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isMasterAdmin) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <ConnectionStatus />
        <AdminMaster
          supportTickets={supportTickets}
          setSupportTickets={setSupportTickets}
          onLogout={() => setIsMasterAdmin(false)}
        />
        <button
          onClick={() => setIsMasterAdmin(false)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Voltar ao App
        </button>
      </div>
    )
  }

  if (isAuthenticated && !isConfigured && !isSecretary) {
    return (
      <>
        <ConnectionStatus />
        <SetupWizard onComplete={() => setIsConfigured(true)} />
      </>
    )
  }

  if (isPatientMode) {
    if (!loggedPatient) {
      return (
        <>
          <ConnectionStatus />
          <Login
            patients={patients}
            onLogin={() => {
              setIsAuthenticated(true)
              setIsConfigured(securityService.getSecureItem('is_configured') === true)
              setIsSecretary(securityService.getSecureItem('is_secretary') === true)
            }}
            onPatientLogin={(p) => {
              setLoggedPatient(p);
              setIsPatientMode(true);
            }}
            onBack={() => setIsPatientMode(false)}
          />
        </>
      )
    }
    return (
      <>
        <ConnectionStatus />
        <PatientPortal patient={loggedPatient} onBack={() => { setIsPatientMode(false); setLoggedPatient(null); }} />
      </>
    )
  }

  if (!isAuthenticated) return (
    <>
      <ConnectionStatus />
      <Login
        patients={patients}
        onLogin={() => {
          setIsAuthenticated(true)
          setIsConfigured(securityService.getSecureItem('is_configured') === true)
          setIsSecretary(securityService.getSecureItem('is_secretary') === true)
        }}
        onPatientLogin={(p) => {
          setLoggedPatient(p);
          setIsPatientMode(true);
        }}
      />
      <button
        onClick={() => setShowPassModal(true)}
        className="master-access-trigger"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          opacity: 0.3,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.75rem',
          color: '#94a3b8',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}
      >
        <Shield size={14} /> Master Console
      </button>
    </>
  )

  const handleLogout = () => {
    securityService.clear()
    setIsAuthenticated(false)
    setIsConfigured(false)
    setIsSecretary(false)
    setIsPatientMode(false)
    window.location.reload()
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <ConnectionStatus />

      {/* Overlay para fechar sidebar no mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 45,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      <aside className="sidebar" style={{
        width: '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        boxShadow: '10px 0 30px rgba(0,0,0,0.05)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        transform: window.innerWidth <= 1024 ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '14px', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}
              >
                <Activity size={24} />
              </motion.div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em', margin: 0 }}>NutriSystem<span style={{ color: 'var(--primary)' }}>.</span></h1>
            </div>
            <button
              className="mobile-only"
              onClick={() => setIsSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: window.innerWidth <= 1024 ? 'block' : 'none' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ flex: 1, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <NavGroup title="Principal">
              {[
                { id: 'Dashboard', icon: Home, label: 'Dashboard' },
                { id: 'Agenda', icon: Calendar, label: 'Agenda' },
                { id: 'Pacientes', icon: User, label: 'Pacientes' },
                { id: 'Mensagens', icon: MessageCircle, label: 'Mensagens', badge: messageCount }
              ].map(item => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  badge={item.badge}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </NavGroup>

            {!isSecretary && (
              <NavGroup title="Clínico">
                {[
                  { id: 'Anamnese', icon: ClipboardList, label: 'Anamnese' },
                  { id: 'Antropometria', icon: Activity, label: 'Antropometria' },
                  { id: 'Orientacao', icon: FileText, label: 'Orientação Clínica' },
                  { id: 'Exames', icon: FileText, label: 'Exames Bioquímicos' },
                  { id: 'EstudoAlimentar', icon: Utensils, label: 'Estudo Alimentar' },
                  { id: 'ExamesAI', icon: Brain, label: 'Interpretador IA' },
                  { id: 'Metas', icon: Target, label: 'Metas & Hábitos' },
                  { id: 'Planos', icon: Apple, label: 'Plano Alimentar' },
                  { id: 'Receitas', icon: Sparkles, label: 'Receitas' },
                  { id: 'Suplementos', icon: Pill, label: 'Suplementação' }
                ].map(item => (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  />
                ))}
                <div style={{ marginTop: '0.5rem' }}>
                  <NavItem
                    icon={CheckCircle2}
                    label="Finalizar Consulta"
                    active={activeTab === 'Finalizar'}
                    onClick={() => setActiveTab('Finalizar')}
                    customStyle={{ backgroundColor: '#22c55e', color: 'white' }}
                  />
                </div>
              </NavGroup>
            )}

            <NavGroup title="Gestão & SaaS">
              {[
                { id: 'Financeiro', icon: DollarSign, label: 'Financeiro' },
                { id: 'Suporte', icon: Shield, label: 'Suporte', badge: supportTickets.filter(t => t.status === 'Respondido').length },
                ...(!isSecretary ? [{ id: 'Settings', icon: SettingsIcon, label: 'Configurações' }] : [])
              ].map(item => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
              <NavItem icon={LogOut} label="Sair do App" onClick={handleLogout} />
            </NavGroup>
          </nav>

          {/* Rodapé de Perfil Compacto e Elegante */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {nutriAvatar ? <img src={nutriAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User color="white" size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontWeight: '700', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{nutriName}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: 0 }}>{isSecretary ? 'Secretária(o)' : 'Nutricionista'}</p>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.7rem', height: '32px', borderRadius: '8px' }}
              onClick={() => setActiveTab('Settings')}
            >
              Configurações
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="header" style={{
          position: 'relative',
          zIndex: 500,
          backgroundColor: 'var(--background)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              className="mobile-only"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--secondary)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: window.innerWidth <= 1024 ? 'block' : 'none'
              }}
            >
              <Menu size={24} />
            </button>

            {selectedPatient && activeTab !== 'Dashboard' && activeTab !== 'Pacientes' && (
              <button
                onClick={() => { setSelectedPatient(null); setActiveTab('Pacientes'); }}
                className="btn"
                style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#ef4444' }}
                title="Fechar prontuário e voltar"
              >
                <X size={20} />
              </button>
            )}
            {selectedPatient && activeTab !== 'Dashboard' && activeTab !== 'Pacientes' && (
              <div style={{ position: 'relative', zIndex: 600 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => { e.stopPropagation(); setShowPatientMenu(!showPatientMenu); }}
                  style={{
                    padding: '0.6rem 1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '50px',
                    border: '2px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {selectedPatient?.name?.charAt(0)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '1rem', margin: 0 }}>{selectedPatient?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Visualizando {activeTab}</p>
                  </div>
                  <ChevronRight size={18} style={{ transform: showPatientMenu ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', marginLeft: '8px' }} />
                </motion.button>

                <AnimatePresence>
                  {showPatientMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        top: '120%',
                        left: 0,
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '1.25rem',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        width: '240px',
                        zIndex: 700
                      }}
                    >
                      <button className="btn btn-secondary" style={{ borderRadius: '50px', justifyContent: 'flex-start' }} onClick={() => { setActiveTab('Agenda'); setShowPatientMenu(false); }}><Calendar size={16} /> Agendar Retorno</button>
                      <button className="btn btn-secondary" style={{ borderRadius: '50px', justifyContent: 'flex-start' }} onClick={() => { alert('Iniciando acompanhamento...'); setShowPatientMenu(false); }}><Activity size={16} /> Acompanhamento</button>
                      <button className="btn btn-secondary" style={{ borderRadius: '50px', justifyContent: 'flex-start' }} onClick={() => { setActiveTab('Agenda'); setShowPatientMenu(false); }}><Clock size={16} /> Remarcar</button>
                      <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.5rem 0' }} />
                      <button
                        className="btn btn-secondary"
                        style={{ borderRadius: '50px', justifyContent: 'flex-start', color: 'var(--primary)', fontWeight: 'bold' }}
                        onClick={() => { setActiveTab('Historico'); setShowPatientMenu(false); }}
                      >
                        <HistoryIcon size={16} /> Histórico Completo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!selectedPatient || activeTab === 'Dashboard' || activeTab === 'Pacientes' ? (
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: 'var(--secondary)' }}>{activeTab}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bem-vindo ao seu painel de controle.</p>
              </div>
            ) : null}
          </div>


          {showPatientMenu && (
            <div
              onClick={() => setShowPatientMenu(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.01)',
                zIndex: 500,
                cursor: 'pointer'
              }}
            />
          )}

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {selectedPatient && activeTab !== 'Dashboard' && activeTab !== 'Pacientes' && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowPrintMenu(!showPrintMenu)}
                  style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Central de Impressão"
                >
                  <Printer size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Imprimir / Exportar</span>
                </button>

                <AnimatePresence>
                  {showPrintMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="card"
                      style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '280px', zIndex: 6000, padding: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}
                    >
                      <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Relatórios do Paciente</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            generateEvolutionPDF(selectedPatient, [
                              { date: 'Jan', peso: 85, gordura: 28, massa: 58, adesao: 65 },
                              { date: 'Fev', peso: 83.5, gordura: 26.5, massa: 58.5, adesao: 78 },
                              { date: 'Mar', peso: 82, gordura: 25, massa: 59, adesao: 82 },
                              { date: 'Abr', peso: 80.5, gordura: 23.5, massa: 60, adesao: 90 },
                            ]);
                            setShowPrintMenu(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
                          className="hover-bg"
                        >
                          <TrendingUp size={16} color="var(--primary)" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Relatório de Evolução</span>
                        </button>

                        <button
                          onClick={() => {
                            generateMealPlanPDF(selectedPatient, [
                              { time: '08:00', name: 'Café da Manhã', foods: [{ name: 'Ovos Mexidos', amount: '2 un' }, { name: 'Pão Integral', amount: '1 fatia' }] },
                              { time: '12:00', name: 'Almoço', foods: [{ name: 'Frango Grelhado', amount: '120g' }, { name: 'Arroz Integral', amount: '100g' }] }
                            ]);
                            setShowPrintMenu(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
                          className="hover-bg"
                        >
                          <Apple size={16} color="var(--primary)" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Plano Alimentar (PDF)</span>
                        </button>

                        <button
                          onClick={() => {
                            generateExamsPDF(selectedPatient, [
                              { date: '10/04/2026', title: 'Hemograma', result: 'Normal', note: 'Glicemia ok.' },
                              { date: '15/01/2026', title: 'Vitamina D', result: 'Alerta', note: 'Suplementar.' }
                            ]);
                            setShowPrintMenu(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
                          className="hover-bg"
                        >
                          <FileText size={16} color="var(--primary)" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Histórico de Exames</span>
                        </button>

                        <button
                          onClick={() => {
                            generateAnamnesisPDF(selectedPatient, {
                              'Objetivo': 'Hipertrofia',
                              'Alergias': 'Nenhuma',
                              'Atividade Física': 'Musculação 5x/semana',
                              'Sono': '7 horas/dia'
                            });
                            setShowPrintMenu(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
                          className="hover-bg"
                        >
                          <ClipboardList size={16} color="var(--primary)" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Anamnese Completa</span>
                        </button>

                        <button
                          onClick={() => {
                            generateRecipesPDF(selectedPatient, [
                              { title: 'Cuscuz com Ovos', category: 'Café da Manhã', calories: 240, ingredients: 'Flocão, Ovos' },
                              { title: 'Frango Teriyaki', category: 'Almoço', calories: 310, ingredients: 'Frango, Shoyu' }
                            ]);
                            setShowPrintMenu(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
                          className="hover-bg"
                        >
                          <Utensils size={16} color="var(--primary)" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Receitas Prescritas</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setActiveTab('Mensagens'); setMessageCount(0); }} title="Mensagens">
              <MessageCircle size={22} color="var(--text-muted)" />
              {messageCount > 0 && (
                <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '18px', height: '18px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white' }}>
                  {messageCount}
                </div>
              )}
            </div>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveTab('Notificações')} title="Notificações">
              <Bell size={22} color="var(--text-muted)" />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text)' }}>{nutriName}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{nutriEmail}</p>
                <button
                  onClick={() => setIsPatientMode(true)}
                  style={{ background: 'none', border: 'none', padding: '0', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}
                >
                  <Smartphone size={10} /> Portal do Paciente
                </button>
              </div>
              <div
                onClick={() => setActiveTab('Settings')}
                style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '16px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundImage: nutriAvatar ? `url(${nutriAvatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: nutriAvatar ? '2px solid white' : 'none',
                  boxShadow: nutriAvatar ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
                }}
                className="hover-bg"
              >
                {!nutriAvatar && (nutriName ? nutriName.charAt(0) : 'N')}
              </div>
            </div>
          </div>
        </header>

        <div style={{
          flex: 1,
          position: 'relative',
          zIndex: 1000,
          filter: showPatientMenu ? 'blur(10px)' : 'none',
          transition: 'all 0.4s ease',
          pointerEvents: showPatientMenu ? 'none' : 'auto',
          opacity: showPatientMenu ? 0.4 : 1
        }}>
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && <motion.div key="db" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Dashboard patients={patients} nutriName={nutriName} onTabChange={setActiveTab} onPatientClick={(p) => { setSelectedPatient(p); setActiveTab('Anamnese'); }} /></motion.div>}
            {activeTab === 'Pacientes' && <motion.div key="pt" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><PatientList patients={patients} onPatientClick={(p) => { setSelectedPatient(p); setActiveTab('Anamnese'); }} /></motion.div>}
            {activeTab === 'Anamnese' && <motion.div key="an" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Anamnesis patient={selectedPatient} onSave={() => setActiveTab('Pacientes')} /></motion.div>}
            {activeTab === 'Antropometria' && <motion.div key="at" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Anthropometry patient={selectedPatient} /></motion.div>}
            {activeTab === 'Planos' && <motion.div key="pl" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><DietPlan patient={selectedPatient} onSave={() => { alert('Plano Alimentar salvo com sucesso!'); setActiveTab('Pacientes'); }} /></motion.div>}
            {activeTab === 'Exames' && <motion.div key="ex" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Exams patient={selectedPatient} /></motion.div>}
            {activeTab === 'ExamesAI' && <motion.div key="exai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><LabExamsAI patient={selectedPatient} /></motion.div>}
            {activeTab === 'Metas' && <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><PatientGoals patient={selectedPatient} /></motion.div>}
            {activeTab === 'Conexões' && <motion.div key="wear" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Wearables patient={selectedPatient} /></motion.div>}
            {activeTab === 'Financeiro' && <motion.div key="fi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Financial patients={patients} /></motion.div>}
            {activeTab === 'Agenda' && <motion.div key="sc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Schedule /></motion.div>}
             {activeTab === 'Settings' && <motion.div key="st" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Settings onSaveSuccess={() => {
              setNutriName(securityService.getSecureItem('nutri_name') || 'Especialista');
              setNutriEmail(securityService.getSecureItem('nutri_email'));
              setNutriAvatar(securityService.getSecureItem('nutri_avatar'));
              setActiveTab('Dashboard');
            }} /></motion.div>}
            {activeTab === 'Evolucao' && <motion.div key="ev" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><PhotoEvolution patient={selectedPatient} /></motion.div>}
            {activeTab === 'PreAtendimento' && <motion.div key="pr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><PreConsultation patient={selectedPatient} /></motion.div>}
            {activeTab === 'Assinaturas' && <motion.div key="si" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><DigitalSignature patient={selectedPatient} /></motion.div>}
            {activeTab === 'Wearables' && <motion.div key="we" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Wearables patient={selectedPatient} /></motion.div>}
            {activeTab === 'Suplementos' && <motion.div key="su" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Supplementation patient={selectedPatient} patients={patients} onSelectPatient={setSelectedPatient} onSave={() => setActiveTab('Pacientes')} /></motion.div>}
            {activeTab === 'Portal' && <motion.div key="po" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><PatientPortal patient={selectedPatient} /></motion.div>}
            {activeTab === 'Orientacao' && <motion.div key="or" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><NutritionalOrientation patient={selectedPatient} /></motion.div>}
            {activeTab === 'Receitas' && <motion.div key="re" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><RecipesLibrary onSendToPatient={(recipe) => alert(`Receita "${recipe.title}" enviada para ${selectedPatient?.name || 'o paciente'}`)} /></motion.div>}
            {activeTab === 'Historico' && <motion.div key="hi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><PatientHistory patient={selectedPatient} /></motion.div>}
            {activeTab === 'EstudoAlimentar' && <motion.div key="ea" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><FoodRecall patient={selectedPatient} /></motion.div>}
            {activeTab === 'Mensagens' && <motion.div key="msg" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Messages patients={patients} /></motion.div>}
            {activeTab === 'Suporte' && <motion.div key="sup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Support tickets={supportTickets} setTickets={setSupportTickets} nutriName={nutriName} /></motion.div>}
            {activeTab === 'Finalizar' && (
              <motion.div key="fin" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ width: '100px', height: '100px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 size={48} color="#166534" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Consulta Finalizada com Sucesso!</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Todos os dados foram sincronizados com o portal do paciente.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('Dashboard')}>Voltar ao Dashboard</button>
                  <button className="btn btn-secondary" onClick={() => window.print()}>Imprimir Comprovante</button>
                </div>
              </motion.div>
            )}
            {activeTab === 'Marketing' && <motion.div key="mkt" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PublicProfile
                nutriData={{
                  name: securityService.getSecureItem('nutri_name'),
                  specialty: securityService.getSecureItem('nutri_specialty'),
                  bio: securityService.getSecureItem('nutri_bio'),
                  specialties: securityService.getSecureItem('nutri_specialties')?.split(',').map(s => s.trim()),
                  avatar: securityService.getSecureItem('nutri_avatar')
                }}
                onBack={() => setActiveTab('Dashboard')}
              />
            </motion.div>}
            {activeTab === 'Notificações' && (
              <motion.div key="not" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Notifications onAction={(type, patientId) => {
                  if (patientId) {
                    const p = patients.find(pat => pat.id === patientId)
                    if (p) setSelectedPatient(p)
                  }
                  if (type === 'exame') setActiveTab('Exames')
                  else if (type === 'mensagem') setActiveTab('Mensagens')
                  else if (type === 'questionario') setActiveTab('Anamnese')
                  else if (type === 'consulta') setActiveTab('Agenda')
                  else setActiveTab('Pacientes')
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {showPatientForm && (
        <PatientForm 
          tenant_id={tenantId}
          onClose={() => setShowPatientForm(false)} 
          onSave={(newPatient) => setPatients([...patients, newPatient])} 
        />
      )}

      <AnimatePresence>
        {showAbout && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: '400px', padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--secondary) 0%, #000 100%)', color: 'white', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button onClick={() => setShowAbout(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button></div>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}><Apple size={32} color="white" /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>NutriSystem</h3>
                <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Titanium Ultra v2.4.0</p>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Mail size={20} /></div>
                    <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suporte por E-mail</p><p style={{ fontWeight: '600', fontSize: '0.875rem' }}>suporte@nutrisystem.com.br</p></div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}><MessageCircle size={20} /></div>
                    <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WhatsApp Suporte</p><p style={{ fontWeight: '600', fontSize: '0.875rem' }}>(11) 98765-4321</p></div>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAbout(false)} style={{ width: '100%', marginTop: '1.5rem' }}>Fechar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
