import React, { useState, useEffect } from 'react'
import { Search, Send, User, CheckCheck, Clock, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { chatService } from '../services/api'

const Messages = ({ patients = [] }) => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [msgInput, setMsgInput] = useState('')
  
  const chats = patients.map(p => ({
    id: p.id,
    name: p.name,
    lastMsg: "Clique para ver a conversa",
    time: "Hoje",
    unread: 0,
    status: p.status === 'Ativo' ? 'online' : 'offline'
  }))

  const [conversation, setConversation] = useState([
    { text: "Olá Doutor, tive uma dúvida sobre o lanche da tarde.", isMe: false, time: "10:25" },
    { text: "Pode falar, Ana. O que houve?", isMe: true, time: "10:28" },
    { text: "Posso trocar o iogurte por whey com água?", isMe: false, time: "10:30" }
  ])

  useEffect(() => {
    if (!selectedChat) return
    
    const loadMessages = async () => {
      const data = await chatService.getMessages(selectedChat.id)
      if (data && !data.error) {
        setConversation(data)
      }
    }

    loadMessages()

    // Sincronização instantânea entre abas
    const bc = new BroadcastChannel('chat_sync');
    bc.onmessage = (event) => {
      if (event.data.type === 'NEW_MESSAGE' && event.data.patientId === selectedChat.id) {
        loadMessages();
      }
    };

    // Polling para novas mensagens deste paciente
    const interval = setInterval(loadMessages, 3000)
    
    return () => {
      clearInterval(interval);
      bc.close();
    }
  }, [selectedChat])

  const handleSend = async () => {
    if (!msgInput || !selectedChat) return
    const text = msgInput
    setMsgInput('')
    
    // Envia via serviço (salva local e tenta API)
    await chatService.sendMessage(selectedChat.id, 'doctor', text)
    
    // Atualiza visual instantaneamente
    const data = await chatService.getMessages(selectedChat.id)
    setConversation(data)
  }

  return (
    <div className="card" style={{ height: 'calc(100vh - 180px)', padding: '0', display: 'flex', overflow: 'hidden' }}>
      {/* Lista de Conversas */}
      <div style={{ width: '350px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Mensagens</h3>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              style={{ 
                padding: '1.25rem 1.5rem', 
                borderBottom: '1px solid #f1f5f9', 
                cursor: 'pointer',
                backgroundColor: selectedChat?.id === chat.id ? '#f8fafc' : 'transparent',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
              className="hover-bg"
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {chat.name.charAt(0)}
                </div>
                {chat.status === 'online' && (
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', border: '2px solid white' }}></div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{chat.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{chat.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Janela de Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
        {selectedChat ? (
          <>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: 'white', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{selectedChat.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>{selectedChat.status === 'online' ? 'Online agora' : 'Offline'}</p>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {conversation.map((m, i) => (
                <div key={i} style={{ alignSelf: m.sender === 'doctor' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div style={{ 
                    padding: '1rem', 
                    borderRadius: m.sender === 'doctor' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                    backgroundColor: m.sender === 'doctor' ? 'var(--secondary)' : 'white',
                    color: m.sender === 'doctor' ? 'white' : 'var(--text)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.9rem',
                    position: 'relative'
                  }}>
                    {m.text}
                    <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      {m.time} {m.sender === 'doctor' && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Escreva sua resposta..." 
                  style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '16px' }}
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="btn btn-primary" style={{ width: '50px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)' }}>
            <MessageCircle size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
            <p>Selecione um paciente para iniciar a conversa</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
