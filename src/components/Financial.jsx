import React, { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, MoreHorizontal, Download, Plus, Search, Filter, Calendar, CreditCard, PieChart, User, Edit3, Trash2, Eye, X, FileText, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { generateReceiptPDF } from '../utils/pdfGenerator'

const data = [
  { month: 'Jan', revenue: 8500, expenses: 3200 },
  { month: 'Fev', revenue: 9200, expenses: 3400 },
  { month: 'Mar', revenue: 10800, expenses: 3100 },
  { month: 'Abr', revenue: 12450, expenses: 3800 },
]

const TransactionRow = ({ type, description, date, amount, method, status, onAction }) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr', padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', alignItems: 'center', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '8px', 
          backgroundColor: type === 'income' ? '#dcfce7' : '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: type === 'income' ? '#166534' : '#991b1b'
        }}>
          {type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{description}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{type === 'income' ? 'Receita' : 'Despesa'}</div>
        </div>
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{date}</div>
      <div style={{ fontWeight: 'bold', color: type === 'income' ? 'var(--text)' : '#ef4444' }}>
        {type === 'income' ? '+' : '-'} R$ {amount}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{method}</div>
      <div>
        <span className="badge" style={{ 
          backgroundColor: status === 'Pago' || status === 'Concluído' ? '#dcfce7' : '#fef9c3', 
          color: status === 'Pago' || status === 'Concluído' ? '#166534' : '#854d0e',
          fontSize: '0.7rem'
        }}>
          {status}
        </span>
      </div>
      
      <div style={{ textAlign: 'right', position: 'relative' }}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
          className="hover-bg"
        >
          <MoreHorizontal size={18} color="var(--text-muted)" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <>
              <div 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} 
                onClick={() => setShowMenu(false)}
              ></div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                style={{ 
                  position: 'absolute', 
                  right: '0', 
                  top: '100%', 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: '160px',
                  border: '1px solid var(--border)'
                }}
              >
                <button className="menu-item" onClick={() => { onAction('view', { type, description, date, amount, method, status }); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.75rem', border: 'none', background: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left' }}>
                  <Eye size={16} color="var(--text-muted)" /> Ver Detalhes
                </button>
                <button className="menu-item" onClick={() => { onAction('edit', { type, description, date, amount, method, status }); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.75rem', border: 'none', background: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left' }}>
                  <Edit3 size={16} color="var(--primary)" /> Editar Registro
                </button>
                <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.4rem 0' }}></div>
                <button className="menu-item" onClick={() => { onAction('delete', { type, description, date, amount, method, status }); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.75rem', border: 'none', background: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left', color: '#ef4444' }}>
                  <Trash2 size={16} color="#ef4444" /> Excluir Lançamento
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const Financial = ({ patients = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTrans, setSelectedTrans] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [transType, setTransType] = useState('income')

  const handleAction = (action, transaction) => {
    if (action === 'delete') {
      if (confirm(`Tem certeza que deseja excluir o lançamento "${transaction.description}"?`)) {
        alert('Lançamento excluído com sucesso!')
      }
    } else if (action === 'edit') {
      setSelectedTrans(transaction)
      setTransType(transaction.type)
      setShowAddModal(true)
    } else if (action === 'view') {
      setSelectedTrans({
        ...transaction,
        obs: transaction.obs || 'Pagamento referente à consulta de acompanhamento mensal. Paciente apresenta boa adesão ao plano alimentar e solicitou nota fiscal.'
      })
      setShowDetailsModal(true)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
          <div className="card glass" style={{ borderLeft: '4px solid var(--primary)', margin: 0, flex: 1 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Saldo em Caixa</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>R$ 8.650,00</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>+ R$ 1.200,00 hoje</span>
          </div>
          <div className="card glass" style={{ margin: 0, flex: 1 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Receitas (Abril)</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>R$ 12.450,00</h4>
          </div>
          <div className="card glass" style={{ margin: 0, flex: 1 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Despesas (Abril)</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ef4444' }}>R$ 3.800,00</h4>
          </div>
        </div>
        <button 
          onClick={() => { setSelectedTrans(null); setShowAddModal(true); }}
          className="btn btn-primary" 
          style={{ height: '48px', padding: '0-1.5rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)', flexShrink: 0 }}
        >
          <Plus size={20} /> Nova Transação
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Chart Section Omitted but preserved in full file for deployment */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Evolução de Faturamento</h3>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Formas de Pagamento</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Pix', value: 'R$ 7.200', percent: 58, color: 'var(--primary)' },
              { label: 'Cartão de Crédito', value: 'R$ 4.100', percent: 33, color: 'var(--accent)' },
              { label: 'Dinheiro / Outros', value: 'R$ 1.150', percent: 9, color: '#94a3b8' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '600' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.value} ({item.percent}%)</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percent}%`, height: '100%', background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Lançamentos Recentes</h3>
          <button className="btn" style={{ backgroundColor: '#f1f5f9', fontSize: '0.875rem' }}>
            <Download size={18} /> Exportar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <div>Descrição</div>
          <div>Data</div>
          <div>Valor</div>
          <div>Método</div>
          <div>Status</div>
          <div></div>
        </div>

        <TransactionRow onAction={handleAction} type="income" description="Consulta - Ana Beatriz Silva" date="25/04/2026" amount="250,00" method="Pix" status="Pago" />
        <TransactionRow onAction={handleAction} type="expense" description="Aluguel Consultório" date="25/04/2026" amount="1.800,00" method="Boleto" status="Pago" />
        <TransactionRow onAction={handleAction} type="income" description="Plano Trimestral - Carlos Eduardo" date="24/04/2026" amount="650,00" method="Cartão" status="Pago" />
        <TransactionRow onAction={handleAction} type="expense" description="Assinatura Software Nutri" date="23/04/2026" amount="190,00" method="Cartão" status="Pago" />
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="card" style={{ width: '500px', padding: '2.5rem' }}>
              <h3>{selectedTrans ? 'Editar Transação' : 'Nova Transação'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                <select value={transType} onChange={(e) => setTransType(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
                <input type="text" defaultValue={selectedTrans?.description} placeholder="Descrição" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" defaultValue={selectedTrans?.amount} placeholder="Valor (R$)" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
                  <input type="date" defaultValue={selectedTrans?.date ? '2026-04-25' : ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, backgroundColor: '#f1f5f9' }}>Cancelar</button>
                <button onClick={() => setShowAddModal(false)} className="btn btn-primary" style={{ flex: 1 }}>Salvar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTrans && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ width: '450px', padding: '0', overflow: 'hidden' }}>
              <div style={{ 
                padding: '2rem', 
                background: selectedTrans.type === 'income' ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20}/></button>
                </div>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  {selectedTrans.type === 'income' ? <TrendingUp size={30} /> : <TrendingDown size={30} />}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{selectedTrans.type === 'income' ? 'Receita Recebida' : 'Despesa Paga'}</h3>
                <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>ID da Transação: #TX-{Math.floor(Math.random()*10000)}</p>
              </div>

              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--text-muted)' }}><FileText size={20}/></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Descrição</p>
                      <p style={{ fontWeight: '600' }}>{selectedTrans.description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valor</p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: selectedTrans.type === 'income' ? 'var(--primary)' : '#ef4444' }}>R$ {selectedTrans.amount}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{selectedTrans.date}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Método</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={14} color="var(--primary)" />
                        <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{selectedTrans.method}</p>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} color="#10b981" />
                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>{selectedTrans.status}</p>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Categoria</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{selectedTrans.type === 'income' ? 'Atendimento' : 'Infraestrutura'}</p>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Observações do Especialista</p>
                    <div style={{ padding: '1rem', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', fontSize: '0.875rem', fontStyle: 'italic', color: '#9a3412', lineHeight: '1.5' }}>
                      "{selectedTrans.obs}"
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button onClick={() => { setShowDetailsModal(false); setShowAddModal(true); }} className="btn" style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
                    <Edit3 size={18} /> Editar
                  </button>
                  <button 
                    onClick={() => generateReceiptPDF(selectedTrans)}
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                  >
                    <Download size={18} /> Comprovante
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

export default Financial
