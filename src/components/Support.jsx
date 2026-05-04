import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Clock, CheckCircle2, ChevronRight, X, Send, User, Shield } from 'lucide-react'

const Support = ({ tickets, setTickets, nutriName }) => {
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'Média', message: '' })
  const [replyText, setReplyText] = useState('')

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) return
    
    const ticketId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1
    const ticket = {
      id: ticketId,
      tenant: nutriName,
      subject: newTicket.subject,
      priority: newTicket.priority,
      status: 'Aberto',
      messages: [
        { sender: 'user', text: newTicket.message, time: new Date().toLocaleString('pt-BR') }
      ]
    }
    
    setTickets(prev => [ticket, ...prev])
    setShowNewTicket(false)
    setNewTicket({ subject: '', priority: 'Média', message: '' })
  }

  const handleSendMessage = () => {
    if (!replyText.trim()) return
    
    setTickets(prev => {
      const updated = prev.map(t => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            status: 'Em Análise',
            messages: [
              ...t.messages,
              { sender: 'user', text: replyText, time: new Date().toLocaleString('pt-BR') }
            ]
          }
        }
        return t
      })
      setSelectedTicket(updated.find(t => t.id === selectedTicket.id))
      return updated
    })
    setReplyText('')
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--secondary)' }}>Suporte ao Profissional</h2>
          <p style={{ color: 'var(--text-muted)' }}>Estamos aqui para ajudar com qualquer dúvida ou problema técnico.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewTicket(true)} style={{ padding: '0 2rem', height: '52px', borderRadius: '12px' }}>
          <Plus size={24} /> Novo Chamado
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <MessageSquare color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{tickets.filter(t => t.status !== 'Fechado').length}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chamados Ativos</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <CheckCircle2 color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{tickets.filter(t => t.status === 'Fechado').length}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resolvidos</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Clock color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>~ 2h</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tempo Médio de Resposta</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Seus Chamados</h3>
        </div>
        {tickets.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Shield size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>Você ainda não possui chamados abertos.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '3fr 1fr 1fr 1fr auto', 
                  padding: '1.25rem 1.5rem', 
                  borderBottom: '1px solid var(--border)', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }} 
                className="hover-bg"
              >
                <div>
                  <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>{ticket.subject}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket #{ticket.id} • {ticket.messages[0].time}</p>
                </div>
                <div>
                  <span style={{ 
                    fontSize: '0.75rem', fontWeight: 'bold', 
                    color: ticket.priority === 'Alta' ? '#ef4444' : (ticket.priority === 'Média' ? '#f59e0b' : '#3b82f6')
                  }}>
                    {ticket.priority}
                  </span>
                </div>
                <div>
                  <span className="badge" style={{ 
                    backgroundColor: ticket.status === 'Aberto' ? '#fee2e2' : (ticket.status === 'Respondido' ? '#dcfce7' : '#f1f5f9'),
                    color: ticket.status === 'Aberto' ? '#ef4444' : (ticket.status === 'Respondido' ? '#166534' : '#64748b')
                  }}>
                    {ticket.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {ticket.messages.length} mensagen(s)
                </div>
                <ChevronRight size={20} color="var(--border)" />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showNewTicket && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', backgroundColor: 'white', borderRadius: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Abrir Novo Chamado</h3>
                <button onClick={() => setShowNewTicket(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Assunto</label>
                  <input className="input" style={{ width: '100%', height: '48px' }} value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} placeholder="Ex: Problema com emissão de PDF" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Prioridade</label>
                  <select className="input" style={{ width: '100%', height: '48px' }} value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem' }}>Mensagem Detalhada</label>
                  <textarea className="input" style={{ width: '100%', height: '120px', padding: '1rem', resize: 'none' }} value={newTicket.message} onChange={e => setNewTicket({...newTicket, message: e.target.value})} placeholder="Descreva o que está acontecendo..." />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => setShowNewTicket(false)}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreateTicket}>Abrir Chamado</button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedTicket && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} style={{ width: '100%', maxWidth: '600px', height: '90vh', backgroundColor: 'white', borderRadius: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--secondary)', color: 'white' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>{selectedTicket.subject}</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Ticket #{selectedTicket.id} • Status: {selectedTicket.status}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f8fafc' }}>
                {selectedTicket.messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ 
                      padding: '1.25rem', 
                      borderRadius: m.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                      backgroundColor: m.sender === 'user' ? 'var(--primary)' : 'white',
                      color: m.sender === 'user' ? 'white' : 'var(--secondary)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.8 }}>
                        {m.sender === 'user' ? <User size={14} /> : <Shield size={14} />}
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{m.sender === 'user' ? nutriName : 'Suporte Master'}</span>
                      </div>
                      <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{m.text}</p>
                      <p style={{ fontSize: '0.65rem', marginTop: '10px', opacity: 0.6, textAlign: 'right' }}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'Fechado' && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                      className="input" 
                      style={{ flex: 1, height: '52px', borderRadius: '16px' }} 
                      placeholder="Responda ou envie mais detalhes..." 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="btn btn-primary" style={{ width: '52px', padding: 0 }} onClick={handleSendMessage}>
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Support
