import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Mail, 
  Activity, 
  Globe, 
  Database,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  X,
  LogOut,
  Shield,
  DollarSign,
  CreditCard,
  Zap,
  Clock
} from 'lucide-react'

import { API_URL } from '../services/apiConfig'

const AdminMaster = ({ onLogout, supportTickets, setSupportTickets }) => {
  const [activeView, setActiveView] = useState('tenants')
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Dr. João Pereira', email: 'joao@nutri.com', domain: 'joao.nutrisystem.com.br', status: 'Ativo', db: 'tenant_001', configured: true, plan: 'Premium', billing: 'Pago', value: 249.90, patients: 145, storage: '1.2GB' },
    { id: 2, name: 'Dra. Ana Silva', email: 'ana@clinica.com', domain: 'ana.nutrisystem.com.br', status: 'Ativo', db: 'tenant_002', configured: true, plan: 'Básico', billing: 'Pendente', value: 149.90, patients: 32, storage: '240MB' },
  ])

  const [showCreate, setShowCreate] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [newNutri, setNewNutri] = useState({ name: '', email: '', password: '', domain: '', plan: 'Básico', value: '149.90' })
  
  React.useEffect(() => {
    fetch(`${API_URL}/tenants.php`)
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar nutricionistas');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setTenants(data);
      })
      .catch(err => console.error("Erro na API de Tenants:", err));
  }, []);
  
  // Métricas dinâmicas para Infraestrutura
  const [metrics, setMetrics] = useState({ cpu: 14, ram: 1.2 })

  React.useEffect(() => {
    if (activeView === 'infrastructure') {
      const interval = setInterval(() => {
        setMetrics({
          cpu: Math.floor(Math.random() * (18 - 12) + 12),
          ram: parseFloat((Math.random() * (1.4 - 1.1) + 1.1).toFixed(1))
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [activeView])

  const handleCreate = async () => {
    if (!newNutri.name || !newNutri.email || !newNutri.password) {
      alert('Por favor, preencha nome, e-mail e senha.');
      return;
    }

    try {
      console.log('Tentando criar nutricionista em:', `${API_URL}/tenants.php`);
      const response = await fetch(`${API_URL}/tenants.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newNutri.name,
          email: newNutri.email,
          password: newNutri.password,
          slug: newNutri.domain,
          plan: newNutri.plan,
          monthly_value: parseFloat(newNutri.value)
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Recarregar lista
        const res = await fetch(`${API_URL}/tenants.php`);
        const data = await res.json();
        setTenants(data);
        
        setShowCreate(false);
        setNewNutri({ name: '', email: '', password: '', domain: '', plan: 'Básico', value: '149.90' });
        alert('Nutricionista criado com sucesso e salvo no banco de dados!');
      } else {
        alert('Erro ao criar: ' + (result.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro detalhado na conexão:', err);
      alert('Erro de conexão com a API. Verifique se o servidor PHP está rodando em ' + API_URL);
    }
  }

  const toggleStatus = (id) => {
    setTenants(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Ativo' ? 'Inativo' : 'Ativo' } : t
    ))
  }

  const handleSendReply = () => {
    if (!replyMessage.trim()) return
    setSupportTickets(prev => prev.map(t => 
      t.id === selectedTicket.id ? { 
        ...t, 
        status: 'Respondido',
        messages: [
          ...t.messages,
          { sender: 'admin', text: replyMessage, time: new Date().toLocaleString('pt-BR') }
        ]
      } : t
    ))
    setSelectedTicket(null)
    setReplyMessage('')
  }

  const deleteTenant = (id) => {
    if (confirm('Deseja realmente remover este nutricionista e todo o seu banco de dados?')) {
      setTenants(prev => prev.filter(t => t.id !== id))
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#0f172a', display: 'flex', gap: '2rem' }}>
      
      {/* Sidebar Master */}
      <div style={{ width: '280px', flexShrink: 0 }}>
        <div style={{ background: '#1e293b', borderRadius: '24px', padding: '1.5rem', height: 'fit-content', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
            <Shield size={32} color="#10b981" />
            <span style={{ fontWeight: '900', fontSize: '1.2rem' }}>Master Admin</span>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveView('tenants')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', background: activeView === 'tenants' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
            >
              <Users size={20} /> Nutricionistas
            </button>
            <button 
              onClick={() => setActiveView('billing')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', background: activeView === 'billing' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
            >
              <DollarSign size={20} /> Faturamento
            </button>
            <button 
              onClick={() => setActiveView('support')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', background: activeView === 'support' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
            >
              <Mail size={20} /> Suporte {supportTickets.filter(t => t.status === 'Aberto' || t.status === 'Em Análise').length > 0 && <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px' }}>{supportTickets.filter(t => t.status === 'Aberto' || t.status === 'Em Análise').length}</span>}
            </button>
            <button 
              onClick={() => setActiveView('infrastructure')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', background: activeView === 'infrastructure' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
            >
              <Zap size={20} /> Infraestrutura
            </button>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
            <button 
              onClick={onLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', background: 'transparent', color: '#fca5a5', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
            >
              <LogOut size={20} /> Sair do Master
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1 }}>
        
        {activeView === 'tenants' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Gestão de Nutricionistas</h2>
                <p style={{ color: '#64748b' }}>Acompanhe os profissionais e seus identificadores (slugs) ativos.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ padding: '0 2rem', height: '52px', borderRadius: '12px' }}>
                <Plus size={24} /> Novo Cadastro
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Users color="var(--primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>+12%</span>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{tenants.length}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Profissionais Ativos</p>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Globe color="#3b82f6" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{tenants.length}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Slugs Ativos</p>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Clock color="#f59e0b" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{tenants.filter(t => !t.configured).length}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Aguardando Onboarding</p>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Nutricionista</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Slug / Identificador</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Plano</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Valor da Assinatura</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status Finc.</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedTenant(t)} className="hover-bg">
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)' }}>{t.name.charAt(0)}</div>
                          <div><p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t.name}</p><p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.email}</p></div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>{t.domain}</div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: t.plan === 'Premium' ? '#7c3aed' : '#64748b' }}>{t.plan}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>R$ {t.value?.toFixed(2) || '0.00'}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800',
                          backgroundColor: t.billing === 'Pago' ? '#dcfce7' : '#fee2e2',
                          color: t.billing === 'Pago' ? '#166534' : '#ef4444'
                        }}>
                          {t.billing}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleStatus(t.id); }}
                          style={{ 
                            padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer',
                            backgroundColor: t.status === 'Ativo' ? '#fee2e2' : '#dcfce7',
                            color: t.status === 'Ativo' ? '#ef4444' : '#166534'
                          }}
                        >
                          {t.status === 'Ativo' ? 'Bloquear' : 'Ativar'}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteTenant(t.id); }}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #fee2e2', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeView === 'billing' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>Faturamento Global</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Receita Recorrente (MRR)</h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem' }}>
                  {[40, 65, 55, 85, 75, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: 'var(--primary)', height: `${h}%`, borderRadius: '8px 8px 0 0', opacity: 0.8 + (i * 0.05) }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem' }}>
                  <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Total Recebido</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>R$ {tenants.reduce((acc, t) => acc + (t.billing === 'Pago' ? t.value : 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="card" style={{ border: '1px solid #fee2e2' }}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Inadimplência</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444' }}>R$ {tenants.reduce((acc, t) => acc + (t.billing === 'Pendente' ? t.value : 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Últimas Transações</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tenants.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={18} color="var(--primary)" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{t.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura {t.plan} - Via PIX</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '900', color: '#10b981' }}>+ R$ {t.value.toFixed(2)}</p>
                      <p style={{ fontSize: '0.7rem', color: '#64748b' }}>há {t.id * 2} horas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'support' && (
          <motion.div key="support-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>
              Chamados de Suporte ({supportTickets.length})
            </h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Tenant</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Assunto</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Prioridade</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {[...supportTickets].sort((a, b) => b.id - a.id).map(ticket => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 'bold' }}>{ticket.tenant}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>{ticket.subject}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ color: ticket.priority === 'Alta' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>{ticket.priority}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span className="badge" style={{ backgroundColor: ticket.status === 'Aberto' ? '#fee2e2' : '#fef9c3', color: ticket.status === 'Aberto' ? '#ef4444' : '#a16207' }}>{ticket.status}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Responder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeView === 'infrastructure' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>Infraestrutura Locaweb (Rocky Linux 8)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
              <div className="card">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} 
                    />
                  </div>
                  <p style={{ fontWeight: 'bold' }}>Servidor de Aplicação: Operacional</p>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: '900', color: '#10b981', border: '1px solid #10b981', padding: '2px 8px', borderRadius: '4px', letterSpacing: '1px' }}>LIVE</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>CPU Usage</p>
                    <p style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--secondary)' }}>{metrics.cpu}%</p>
                  </div>
                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Memory Usage</p>
                    <p style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--secondary)' }}>{metrics.ram}GB / 4GB</p>
                  </div>
                </div>
                <h4 style={{ marginBottom: '1rem' }}>Sistemas Ativos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Apache / Nginx Proxy', 'PHP 8.3 FPM', 'MySQL Master', 'Redis Cache'].map(sys => (
                    <div key={sys} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{sys}</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>online</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ background: 'var(--secondary)', color: 'white' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Database size={20} color="#10b981" /> Backups (S3)
                </h3>
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Próximo Backup Agendado</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Hoje, 02:00 AM</p>
                </div>
                <button 
                  onClick={() => alert('Iniciando Snapshot de Segurança...')}
                  className="btn btn-primary" 
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  Fazer Backup Agora
                </button>
                <p style={{ fontSize: '0.7rem', opacity: 0.5, textAlign: 'center' }}>Último backup: há 4 horas (Sucesso)</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      <AnimatePresence>
        {selectedTenant && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '600px', padding: '3rem', backgroundColor: 'white', borderRadius: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary)' }}>{selectedTenant.name.charAt(0)}</div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>{selectedTenant.name}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedTenant.domain}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTenant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', marginBottom: '0.5rem' }}>PACIENTES</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '900' }}>{selectedTenant.patients}</p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', marginBottom: '0.5rem' }}>STORAGE</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '900' }}>{selectedTenant.storage}</p>
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Informações Técnicas</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b' }}>Banco de Dados</span>
                    <code style={{ fontWeight: 'bold' }}>{selectedTenant.db}</code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b' }}>Plano Ativo</span>
                    <span style={{ fontWeight: 'bold' }}>{selectedTenant.plan}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b' }}>Valor MRR</span>
                    <span style={{ fontWeight: 'bold' }}>R$ {selectedTenant.value.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => setSelectedTenant(null)}>Fechar</button>
                <button className="btn btn-secondary" style={{ flex: 1 }}>Resetar Senha</button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedTicket && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', backgroundColor: 'white', borderRadius: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: 'white' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>Responder: {selectedTicket.subject}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Ticket #{selectedTicket.id} - {selectedTicket.tenant}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {selectedTicket.messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.sender === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{ 
                      padding: '1rem', 
                      borderRadius: m.sender === 'admin' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                      backgroundColor: m.sender === 'admin' ? '#3b82f6' : 'white',
                      color: m.sender === 'admin' ? 'white' : '#1e293b',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', opacity: 0.7 }}>
                        {m.sender === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        <span style={{ fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>{m.sender === 'admin' ? 'Você (Suporte)' : selectedTicket.tenant}</span>
                      </div>
                      {m.text}
                      <div style={{ fontSize: '0.6rem', marginTop: '6px', opacity: 0.6, textAlign: 'right' }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '2rem', backgroundColor: 'white', borderTop: '1px solid var(--border)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Nova Mensagem de Suporte</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <textarea 
                    className="input" 
                    style={{ flex: 1, height: '80px', padding: '1rem', borderRadius: '16px', resize: 'none', fontSize: '0.9rem' }} 
                    placeholder="Digite a resposta técnica aqui..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ height: '80px', padding: '0 1.5rem' }}
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showCreate && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.5rem' }}>Novo Nutricionista</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Os dados de acesso serão enviados por e-mail.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Nome do Profissional</label>
                  <input className="input" style={{ width: '100%', height: '48px' }} value={newNutri.name} onChange={e => setNewNutri({...newNutri, name: e.target.value})} placeholder="Ex: Dra. Juliana" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>E-mail de Acesso</label>
                  <input className="input" style={{ width: '100%', height: '48px' }} value={newNutri.email} onChange={e => setNewNutri({...newNutri, email: e.target.value})} placeholder="juliana@email.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Senha de Acesso</label>
                  <input type="password" className="input" style={{ width: '100%', height: '48px' }} value={newNutri.password} onChange={e => setNewNutri({...newNutri, password: e.target.value})} placeholder="Defina a senha do profissional" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Identificador da Clínica (Slug)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input className="input" style={{ flex: 1, height: '48px' }} value={newNutri.domain} onChange={e => setNewNutri({...newNutri, domain: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="clinica-juliana" />
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' }}>/login</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Valor da Mensalidade (R$)</label>
                  <input 
                    type="number" 
                    className="input" 
                    style={{ width: '100%', height: '48px' }} 
                    value={newNutri.value} 
                    onChange={e => setNewNutri({...newNutri, value: e.target.value})} 
                    placeholder="149.90" 
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ flex: 1, height: '48px' }} onClick={() => setShowCreate(false)}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 1, height: '48px' }} onClick={handleCreate}>Criar Conta</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminMaster
