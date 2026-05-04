import React, { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Edit2, X, Check, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AppointmentCard = ({ appointment, onEdit }) => (
  <div style={{ 
    display: 'flex', 
    gap: '1rem', 
    padding: '1.25rem', 
    backgroundColor: 'white', 
    borderRadius: '16px', 
    borderLeft: `5px solid ${appointment.color || 'var(--primary)'}`,
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '1rem',
    alignItems: 'center',
    transition: 'transform 0.2s'
  }} className="hover-bg">
    <div style={{ fontWeight: '800', width: '65px', fontSize: '1rem', color: 'var(--secondary)' }}>{appointment.time}</div>
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>{appointment.patient}</p>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> {appointment.type}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} /> Presencial
        </span>
      </div>
    </div>
    <button 
      onClick={() => onEdit(appointment)}
      style={{ 
        padding: '0.5rem', 
        borderRadius: '8px', 
        border: '1px solid var(--border)', 
        background: '#f8fafc', 
        cursor: 'pointer',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}
    >
      <Edit2 size={14} /> Editar
    </button>
  </div>
)

const Schedule = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, date: '2026-04-25', time: '09:00', patient: 'Ana Beatriz Silva', type: 'Retorno', color: '#10b981' },
    { id: 2, date: '2026-04-25', time: '10:30', patient: 'Carlos Eduardo', type: 'Primeira Vez', color: '#3b82f6' },
    { id: 3, date: '2026-04-25', time: '14:00', patient: 'Mariana Oliveira', type: 'Acompanhamento', color: '#8b5cf6' },
  ])
  const [viewDate, setViewDate] = useState(new Date(2026, 3, 1)) // Começa em Abril 2026 para manter o contexto
  const [selectedDate, setSelectedDate] = useState('2026-04-25')
  
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))

  // Gerar dias do mês atual
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    return { daysInMonth, firstDay, year, month }
  }

  const { daysInMonth, firstDay, year, month } = getDaysInMonth(viewDate)
  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const [editingApp, setEditingApp] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ date: '', time: '', patient: '', type: '', color: '#3b82f6' })

  const openEdit = (app) => {
    setEditingApp(app)
    setFormData({ date: app.date, time: app.time, patient: app.patient, type: app.type, color: app.color })
    setIsAdding(false)
  }

  const openAdd = () => {
    setFormData({ date: selectedDate, time: '', patient: '', type: 'Primeira Consulta', color: '#3b82f6' })
    setIsAdding(true)
    setEditingApp({ id: 'new' })
  }

  const closeModal = () => {
    setEditingApp(null)
    setIsAdding(false)
  }

  const handleSave = () => {
    if (!formData.date || !formData.patient || !formData.time) {
      alert('Por favor, preencha todos os campos obrigatórios (Paciente, Data e Horário).')
      return
    }

    if (isAdding) {
      setAppointments([...appointments, { id: Date.now(), ...formData }].sort((a,b) => a.time.localeCompare(b.time)))
    } else {
      setAppointments(appointments.map(a => a.id === editingApp.id ? { ...a, ...formData } : a).sort((a,b) => a.time.localeCompare(b.time)))
    }
    
    setSelectedDate(formData.date)
    closeModal()
  }

  const handleDelete = (id) => {
    setAppointments(appointments.filter(a => a.id !== id))
    closeModal()
  }

  const formatDateDisplay = (dateStr) => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      if (isNaN(date.getTime())) return 'Data Inválida'
      return date.toLocaleDateString('pt-BR')
    } catch (e) {
      return 'Data Inválida'
    }
  }

  const dailyAppointments = appointments.filter(app => {
    if (!app.date || !selectedDate) return false
    return app.date.trim() === selectedDate.trim()
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
      {/* Mini Calendar Side */}
      <div>
        <div className="card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: '800', color: 'var(--secondary)', textTransform: 'capitalize' }}>{monthName}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ChevronLeft size={18} cursor="pointer" className="hover-bg" onClick={prevMonth} />
              <ChevronRight size={18} cursor="pointer" className="hover-bg" onClick={nextMonth} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={`${d}-${i}`} style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const hasApps = appointments.filter(a => a.date === dayStr)
              
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedDate(dayStr)}
                  style={{ 
                    padding: '0.6rem 0', 
                    borderRadius: '10px', 
                    backgroundColor: dayStr === selectedDate ? 'var(--primary)' : 'transparent',
                    color: dayStr === selectedDate ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontWeight: dayStr === selectedDate ? 'bold' : 'normal',
                    transition: 'all 0.2s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }} className="hover-bg"
                >
                  {day}
                  {hasApps.length > 0 && dayStr !== selectedDate && (
                    <div style={{ display: 'flex', gap: '2px', marginTop: '2px', justifyContent: 'center' }}>
                      {hasApps.slice(0, 3).map((a, idx) => (
                        <div key={idx} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: a.color || 'var(--primary)' }}></div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', borderRadius: '20px' }}>
          <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--secondary)' }}>Resumo do Dia</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Consultas</span>
                <span style={{ fontWeight: 'bold' }}>{dailyAppointments.length}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Disponível</span>
             </div>
          </div>
        </div>
      </div>

      {/* Daily Schedule View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--secondary)' }}>Agenda para {formatDateDisplay(selectedDate)}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Visualização Diária</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} style={{ height: '50px', padding: '0 1.5rem', borderRadius: '14px' }}>
            <Plus size={20} /> Novo Agendamento
          </button>
        </div>

        <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '3px solid #f1f5f9' }}>
          {dailyAppointments.map((app) => (
            <AppointmentCard key={app.id} appointment={app} onEdit={openEdit} />
          ))}
          {dailyAppointments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '20px', border: '2px dashed var(--border)' }}>
               <CalendarIcon size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
               <p style={{ color: 'var(--text-muted)' }}>Nenhuma consulta para este dia.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição/Adição */}
      <AnimatePresence>
        {editingApp && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{isAdding ? 'Novo Agendamento' : 'Editar Consulta'}</h3>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Nome do Paciente</label>
                  <input 
                    className="input" 
                    value={formData.patient} 
                    onChange={e => setFormData({...formData, patient: e.target.value})} 
                    placeholder="Ex: João Silva" 
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Data da Consulta</label>
                    <input 
                      type="date" 
                      className="input" 
                      value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Horário</label>
                    <input 
                      type="time" 
                      className="input" 
                      value={formData.time} 
                      onChange={e => setFormData({...formData, time: e.target.value})} 
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tipo de Consulta</label>
                  <select 
                    className="input" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    style={{ width: '100%' }}
                  >
                    <option>Primeira Consulta</option>
                    <option>Retorno</option>
                    <option>Acompanhamento</option>
                    <option>Bioimpedância</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {!isAdding && (
                  <button 
                    onClick={() => handleDelete(editingApp.id)}
                    style={{ padding: '0 1rem', borderRadius: '12px', border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', cursor: 'pointer' }}
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button className="btn" style={{ flex: 1, backgroundColor: '#f1f5f9' }} onClick={closeModal}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSave}>Confirmar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Schedule
