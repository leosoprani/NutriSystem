import React, { useState } from 'react'
import { Watch, Smartphone, Activity, Zap, CheckCircle, RefreshCw, ShieldCheck, Radar, Bluetooth } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DeviceCard = ({ name, icon: Icon, color, status, onConnect }) => (
  <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} />
      </div>
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{name}</h4>
        <p style={{ fontSize: '0.75rem', color: status === 'Connected' ? 'var(--primary)' : 'var(--text-muted)' }}>
          {status === 'Connected' ? 'Sincronizado' : 'Pronto para parear'}
        </p>
      </div>
    </div>
    <button 
      onClick={() => onConnect(name)}
      className={status === 'Connected' ? 'btn' : 'btn btn-primary'}
      style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
    >
      {status === 'Connected' ? 'Gerenciar' : 'Conectar'}
    </button>
  </div>
)

const Wearables = ({ patient }) => {
  const [connections, setConnections] = useState({
    'Apple Health': 'Connected',
    'Google Fit': 'Disconnected',
    'Garmin': 'Disconnected',
    'Strava': 'Connected'
  })

  const [isScanning, setIsScanning] = useState(false)
  const [discoveredDevice, setDiscoveredDevice] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(null)
  const [authStep, setAuthStep] = useState(1)

  const startScan = () => {
    setIsScanning(true)
    setDiscoveredDevice(null)
    
    // Simula a busca por dispositivos via Bluetooth/API
    setTimeout(() => {
      setDiscoveredDevice({
        name: 'Samsung Galaxy Watch 6',
        icon: Watch,
        color: '#000000',
        signal: 'Forte'
      })
      setIsScanning(false)
    }, 4000)
  }

  const handleConnectDiscovered = () => {
    const name = discoveredDevice.name
    setDiscoveredDevice(null)
    setShowAuthModal(name)
    setAuthStep(1)
  }

  const finalizeAuth = () => {
    setAuthStep(2)
    setTimeout(() => {
      setAuthStep(3)
      setConnections(prev => ({ ...prev, [showAuthModal]: 'Connected' }))
    }, 2000)
  }

  if (!patient) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <Watch size={64} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
        <h3>Monitoramento Biométrico</h3>
        <p style={{ color: 'var(--text-muted)' }}>Selecione um paciente para iniciar o escaneamento de dispositivos.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header com Busca Ativa */}
      <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Hub de Conectividade</h2>
              <p style={{ opacity: 0.7 }}>Escaneie e sincronize dispositivos de <strong>{patient.name}</strong></p>
            </div>
            <button 
              className="btn" 
              onClick={startScan}
              disabled={isScanning}
              style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', height: '50px', padding: '0 1.5rem', fontWeight: 'bold' }}
            >
              {isScanning ? <RefreshCw size={20} className="animate-spin" /> : <Radar size={20} />}
              <span style={{ marginLeft: '0.5rem' }}>{isScanning ? 'Buscando...' : 'Escanear Dispositivos'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
             <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bluetooth size={20} color="#3b82f6" />
                <span style={{ fontSize: '0.85rem' }}>Bluetooth LE: <strong>Ativo</strong></span>
             </div>
             <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Smartphone size={20} color="#10b981" />
                <span style={{ fontSize: '0.85rem' }}>Device Bridge: <strong>Conectado</strong></span>
             </div>
          </div>
        </div>

        {/* Animação de Radar de fundo quando scaneando */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', right: '5%', top: '20%', pointerEvents: 'none' }}
            >
              <div className="radar-animation" style={{ width: '200px', height: '200px', borderRadius: '50%', border: '2px solid var(--primary)', position: 'relative' }}>
                <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', inset: 0, border: '2px solid var(--primary)', borderRadius: '50%' }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', background: 'linear-gradient(45deg, var(--primary) 0%, transparent 50%)', transformOrigin: '0 0', marginTop: '-50px', marginLeft: '-50px' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Device Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Dispositivos Pareados</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Object.values(connections).filter(v => v === 'Connected').length} Ativos</span>
          </div>
          <DeviceCard name="Apple Health" icon={Smartphone} color="#ff3b30" status={connections['Apple Health']} onConnect={setShowAuthModal} />
          <DeviceCard name="Strava" icon={Zap} color="#fc4c02" status={connections['Strava']} onConnect={setShowAuthModal} />
          <DeviceCard name="Google Fit" icon={Activity} color="#4285f4" status={connections['Google Fit']} onConnect={setShowAuthModal} />
        </div>

        {/* Real-time Health Snapshot */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--primary)" /> Biometria em Tempo Real
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gasto Calórico Hoje</span>
               <span style={{ fontWeight: 'bold' }}>420 kcal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Frequência de Repouso</span>
               <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>68 bpm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Horas de Sono</span>
               <span style={{ fontWeight: 'bold' }}>07h 12m</span>
            </div>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: '2rem', backgroundColor: '#f8fafc' }}>Ver Histórico Completo</button>
        </div>
      </div>

      {/* Modal de Dispositivo Descoberto */}
      <AnimatePresence>
        {discoveredDevice && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center', borderRadius: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <discoveredDevice.icon size={40} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#166534', backgroundColor: '#dcfce7', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>Sinal {discoveredDevice.signal}</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>{discoveredDevice.name} Encontrado!</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Deseja solicitar ao paciente <strong>{patient.name}</strong> a autorização para sincronizar este dispositivo?</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => setDiscoveredDevice(null)}>Ignorar</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleConnectDiscovered}>Solicitar Acesso</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Autorização (Reutilizado do passo anterior) */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', borderRadius: '32px' }}>
              {authStep === 1 ? (
                <div>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck color="var(--primary)" /> Termos de Consentimento</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Habilitando sincronização para <strong>{showAuthModal}</strong>.</p>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text)', marginBottom: '2rem' }}>
                    <p>Ao prosseguir, o paciente autoriza o NutriSystem a ler dados biométricos para fins de ajuste de plano alimentar e acompanhamento clínico, conforme LGPD.</p>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Duração do Acesso</label>
                    <select className="input" style={{ width: '100%', marginTop: '0.5rem' }}>
                      <option>30 Dias</option>
                      <option>90 Dias</option>
                      <option>Permanente</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={finalizeAuth}>Confirmar e Sincronizar</button>
                </div>
              ) : authStep === 2 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <RefreshCw size={48} className="animate-spin" color="var(--primary)" />
                  <p style={{ marginTop: '1rem' }}>Vinculando dispositivo...</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                  <h3>Conexão Ativa!</h3>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setShowAuthModal(null)}>Concluir</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Wearables
