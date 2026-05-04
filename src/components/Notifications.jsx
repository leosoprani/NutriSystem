import React from 'react'
import { Bell, Mail, FileText, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const Notifications = ({ onAction }) => {
  const notifications = [
    { id: 1, type: 'exame', text: 'Ana Beatriz Silva enviou novos exames de sangue.', time: 'há 10 min', icon: FileText, color: '#3b82f6', unread: true, patientId: 1 },
    { id: 2, type: 'mensagem', text: 'Carlos Eduardo enviou uma nova mensagem.', time: 'há 45 min', icon: Mail, color: 'var(--primary)', unread: true, patientId: 2 },
    { id: 3, type: 'questionario', text: 'Mariana Oliveira concluiu o questionário pré-atendimento.', time: 'há 2 horas', icon: CheckCircle2, color: '#22c55e', unread: false, patientId: 3 },
    { id: 4, type: 'consulta', text: 'Lembrete: Consulta com João Pedro em 30 minutos.', time: 'há 2 horas', icon: Calendar, color: '#f59e0b', unread: false },
    { id: 5, type: 'alerta', text: 'O acesso de Pedro Santos expira em 48 horas.', time: 'Ontem', icon: AlertCircle, color: '#ef4444', unread: false }
  ]

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={28} color="var(--primary)" /> Central de Notificações
        </h2>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer' }}>Marcar todas como lidas</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map((n, i) => (
          <motion.div 
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ 
              display: 'flex', 
              gap: '1.25rem', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              backgroundColor: n.unread ? '#f8fafc' : 'white',
              border: n.unread ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {n.unread && (
              <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '0 4px 4px 0' }}></div>
            )}
            
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: `${n.color}15`, 
              color: n.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <n.icon size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: n.unread ? 'bold' : '500', fontSize: '0.95rem', marginBottom: '4px', color: 'var(--secondary)' }}>{n.text}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</p>
            </div>

            <button 
              onClick={() => {
                if (onAction) onAction(n.type, n.patientId)
              }}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }} 
              className="hover-bg"
            >
              Ver Detalhes
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
