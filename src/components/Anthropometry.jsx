import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Scale, Ruler, ChevronRight, Smartphone, Info, Save, 
  TrendingUp, Bluetooth, CheckCircle2, AlertCircle, Plus, Camera, FileText, BarChart2, Printer, Upload, X, ArrowLeft
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const MOCK_EVOLUTION_DATA = [
  { date: 'Jan', weight: 92, fat: 28 },
  { date: 'Fev', weight: 91.5, fat: 27.5 },
  { date: 'Mar', weight: 90.8, fat: 26.8 },
  { date: 'Abr', weight: 90.0, fat: 26.2 },
]

const InputGroup = ({ label, value, onChange, unit, placeholder = "0,00", side = false }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
      {label} {unit && <span style={{ fontWeight: '500', color: '#94a3b8' }}>({unit})</span>}
    </label>
    <div style={{ display: 'flex', gap: '8px' }}>
      {side ? (
        <>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8' }}>E</span>
            <input 
              type="text" 
              className="input" 
              style={{ paddingLeft: '25px', width: '100%', height: '42px' }} 
              placeholder={placeholder}
              value={value?.e || ''}
              onChange={(e) => onChange({ ...value, e: e.target.value })}
            />
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8' }}>D</span>
            <input 
              type="text" 
              className="input" 
              style={{ paddingLeft: '25px', width: '100%', height: '42px' }} 
              placeholder={placeholder}
              value={value?.d || ''}
              onChange={(e) => onChange({ ...value, d: e.target.value })}
            />
          </div>
        </>
      ) : (
        <input 
          type="text" 
          className="input" 
          style={{ width: '100%', height: '42px' }} 
          placeholder={placeholder} 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  </div>
)

const Anthropometry = ({ patient }) => {
  const [activeSubTab, setActiveSubTab] = useState('Peso / Estatura / Pregas')
  const [protocol, setProtocol] = useState('Pollock 7')
  const [isSyncing, setIsSyncing] = useState(false)
  const [showCharts, setShowCharts] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = React.useRef(null)

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(`anthro_${patient?.id || 'default'}`)
    return saved ? JSON.parse(saved) : {
      peso: '90,00', estatura: '1,77', imc: '28,73', kneeHeight: '', lastWeight: '',
      // Pregas
      tricipital: '', subescapular: '', suprailiaca: '', abdominal: '', peitoral: '', axilarMedia: '', coxa: '', panturrilha: '',
      // Circunferências
      pescoco: '', torax: '', ombros: '', abdomen: '10,00', cintura: '', quadril: '',
      punho: { e: '', d: '' }, braco: { e: '', d: '' }, bracoCont: { e: '', d: '' }, 
      antebraco: { e: '', d: '' }, coxaGlut: { e: '', d: '' }, coxaMed: { e: '', d: '' }, 
      perna: { e: '', d: '' }, tornozelo: { e: '', d: '' },
      diaPunho: '', diaUmero: '', diaFemur: '',
      aguaTotal: '', aguaIntra: '', aguaExtra: '', proteinas: '', minerais: '', 
      massaMuscular: '', massaLivreGordura: '', idadeMetabolica: '', tmb: '', tronco: '',
      gorduraPct: '', massaMagra: '78,11', gorduraAbs: '11,89', pesoIdeal: '91,90', excessoPeso: '-1,90'
    }
  })

  const startCamera = async () => {
    try {
      setIsCameraActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      alert('Erro ao acessar a câmera: ' + err.message)
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    const photo = canvas.toDataURL('image/png')
    setCapturedPhotos(prev => [...prev, photo])
    
    // Stop stream
    const stream = videoRef.current.srcObject
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
    setIsCameraActive(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedPhotos(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    localStorage.setItem(`anthro_${patient?.id || 'default'}`, JSON.stringify(data))
  }, [data, patient])

  const subTabs = ['Peso / Estatura / Pregas', 'Circunferências / Diâmetros', 'Bioimpedância', 'Foto da Consulta']

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    }, 800)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSyncBio = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      alert('Dados importados da balança com sucesso!')
      setData(prev => ({ ...prev, aguaTotal: '62.4', proteinas: '15.8', massaMuscular: '34.5' }))
    }, 2000)
  }

  if (showCharts) {
    return (
      <div style={{ padding: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => setShowCharts(false)} style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={18} /> Voltar para Avaliação
        </button>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--secondary)', letterSpacing: '-0.04em', marginBottom: '2rem' }}>Evolução do Paciente</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Peso Corporal (kg)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_EVOLUTION_DATA}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: 'var(--primary)' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>% de Gordura Corporal</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_EVOLUTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="fat" stroke="#f97316" strokeWidth={3} dot={{ r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Top Header Avanutri Style */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--secondary)', letterSpacing: '-0.04em' }}>Antropometria</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
          <button className="btn btn-secondary" style={{ backgroundColor: '#f97316', color: 'white', border: 'none', cursor: 'pointer' }} onClick={handlePrint}>
             <Printer size={18} /> Relatório
          </button>
          <button className="btn btn-secondary" style={{ backgroundColor: '#f97316', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setShowCharts(true)}>
             <BarChart2 size={18} /> Gráficos
          </button>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: saveStatus === 'success' ? '#10b981' : '#22c55e', border: 'none', cursor: 'pointer', minWidth: '120px' }} 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'success' ? <><CheckCircle2 size={18} /> Salvo!</> : <><Save size={18} /> Salvar</>}
          </button>
        </div>
      </div>

      {/* Tabs Estilo Avanutri */}
      <div style={{ display: 'flex', gap: '1px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }} className="no-print">
        {subTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              flex: 1, padding: '0.75rem 1rem', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer',
              backgroundColor: activeSubTab === tab ? 'white' : 'transparent',
              color: activeSubTab === tab ? 'var(--primary)' : '#64748b',
              transition: 'all 0.2s ease',
              boxShadow: activeSubTab === tab ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <AnimatePresence mode="wait">
            {activeSubTab === 'Peso / Estatura / Pregas' && (
              <motion.div key="geral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <section>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Peso / Altura</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <InputGroup label="Peso" unit="kg" value={data.peso} onChange={v => setData({...data, peso: v})} />
                    <InputGroup label="Estatura" unit="m" value={data.estatura} onChange={v => setData({...data, estatura: v})} />
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '12px', border: '1px solid #fef08a', textAlign: 'center' }}>
                     <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#a16207', marginBottom: '4px' }}>IMC</p>
                     <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#a16207' }}>{data.imc}</p>
                  </div>
                </section>
                <section>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }} className="no-print">
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>Dobras Cutâneas (mm)</h3>
                    <select 
                      className="input" 
                      style={{ width: '140px', height: '32px', fontSize: '0.75rem', padding: '0 8px', border: '1.5px solid var(--border)', borderRadius: '8px' }}
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                    >
                      <option value="Pollock 7">Pollock 7</option>
                      <option value="Pollock 3">Pollock 3</option>
                      <option value="Guedes">Guedes</option>
                      <option value="Petroski">Petroski</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {(protocol === 'Pollock 7' || protocol === 'Petroski') && (
                      <>
                        <InputGroup label="Tricipital" value={data.tricipital} onChange={v => setData({...data, tricipital: v})} />
                        <InputGroup label="Subescapular" value={data.subescapular} onChange={v => setData({...data, subescapular: v})} />
                        <InputGroup label="Suprailíaca" value={data.suprailiaca} onChange={v => setData({...data, suprailiaca: v})} />
                        <InputGroup label="Abdominal" value={data.abdominal} onChange={v => setData({...data, abdominal: v})} />
                        <InputGroup label="Peitoral" value={data.peitoral} onChange={v => setData({...data, peitoral: v})} />
                        <InputGroup label="Axilar Média" value={data.axilarMedia} onChange={v => setData({...data, axilarMedia: v})} />
                        <InputGroup label="Coxa" value={data.coxa} onChange={v => setData({...data, coxa: v})} />
                      </>
                    )}
                    {protocol === 'Pollock 3' && (
                      <>
                        <InputGroup label="Peitoral" value={data.peitoral} onChange={v => setData({...data, peitoral: v})} />
                        <InputGroup label="Abdominal" value={data.abdominal} onChange={v => setData({...data, abdominal: v})} />
                        <InputGroup label="Coxa" value={data.coxa} onChange={v => setData({...data, coxa: v})} />
                      </>
                    )}
                    {protocol === 'Guedes' && (
                      <>
                        <InputGroup label="Tricipital" value={data.tricipital} onChange={v => setData({...data, tricipital: v})} />
                        <InputGroup label="Suprailíaca" value={data.suprailiaca} onChange={v => setData({...data, suprailiaca: v})} />
                        <InputGroup label="Abdominal" value={data.abdominal} onChange={v => setData({...data, abdominal: v})} />
                      </>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeSubTab === 'Circunferências / Diâmetros' && (
              <motion.div key="circ" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <section>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Circunferências (cm)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <InputGroup label="Pescoço" value={data.pescoco} onChange={v => setData({...data, pescoco: v})} />
                        <InputGroup label="Tórax" value={data.torax} onChange={v => setData({...data, torax: v})} />
                        <InputGroup label="Ombros" value={data.ombros} onChange={v => setData({...data, ombros: v})} />
                        <InputGroup label="Abdomen" value={data.abdomen} onChange={v => setData({...data, abdomen: v})} />
                        <InputGroup label="Cintura" value={data.cintura} onChange={v => setData({...data, cintura: v})} />
                        <InputGroup label="Quadril" value={data.quadril} onChange={v => setData({...data, quadril: v})} />
                      </div>
                      <div>
                        <InputGroup label="Punho" side value={data.punho} onChange={v => setData({...data, punho: v})} />
                        <InputGroup label="Braço" side value={data.braco} onChange={v => setData({...data, braco: v})} />
                        <InputGroup label="Braço Cont." side value={data.bracoCont} onChange={v => setData({...data, bracoCont: v})} />
                        <InputGroup label="Coxa Glúteo" side value={data.coxaGlut} onChange={v => setData({...data, coxaGlut: v})} />
                        <InputGroup label="Perna" side value={data.perna} onChange={v => setData({...data, perna: v})} />
                        <InputGroup label="Tornozelo" side value={data.tornozelo} onChange={v => setData({...data, tornozelo: v})} />
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Diâmetros (cm)</h4>
                    <InputGroup label="Biestilóide Punho" value={data.diaPunho} onChange={v => setData({...data, diaPunho: v})} />
                    <InputGroup label="Biepicondiliano Úmero" value={data.diaUmero} onChange={v => setData({...data, diaUmero: v})} />
                    <InputGroup label="Biepicondiliano Fêmur" value={data.diaFemur} onChange={v => setData({...data, diaFemur: v})} />
                  </section>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'Bioimpedância' && (
              <motion.div key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Bioimpedância</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <InputGroup label="Água Corporal Total" unit="L" value={data.aguaTotal} onChange={v => setData({...data, aguaTotal: v})} />
                  <InputGroup label="Água Intracelular" unit="L" value={data.aguaIntra} onChange={v => setData({...data, aguaIntra: v})} />
                  <InputGroup label="Água Extracelular" unit="L" value={data.aguaExtra} onChange={v => setData({...data, aguaExtra: v})} />
                  <InputGroup label="Proteínas" unit="kg" value={data.proteinas} onChange={v => setData({...data, proteinas: v})} />
                  <InputGroup label="Minerais" unit="kg" value={data.minerais} onChange={v => setData({...data, minerais: v})} />
                  <InputGroup label="Massa Muscular" unit="kg" value={data.massaMuscular} onChange={v => setData({...data, massaMuscular: v})} />
                  <InputGroup label="Massa Livre Gordura" unit="kg" value={data.massaLivreGordura} onChange={v => setData({...data, massaLivreGordura: v})} />
                  <InputGroup label="Idade Metabólica" value={data.idadeMetabolica} onChange={v => setData({...data, idadeMetabolica: v})} />
                  <InputGroup label="TMB" unit="kcal" value={data.tmb} onChange={v => setData({...data, tmb: v})} />
                  <InputGroup label="Tronco" unit="%" value={data.tronco} onChange={v => setData({...data, tronco: v})} />
                </div>
              </motion.div>
            )}

            {activeSubTab === 'Foto da Consulta' && (
              <motion.div key="foto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '1rem' }}>
                 <AnimatePresence>
                   {isCameraActive ? (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                       <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', borderRadius: '24px', backgroundColor: '#000', marginBottom: '1rem' }} />
                       <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                         <button className="btn btn-primary" onClick={capturePhoto}>Tirar Foto</button>
                         <button className="btn btn-secondary" onClick={() => setIsCameraActive(false)}>Cancelar</button>
                       </div>
                     </motion.div>
                   ) : (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                           <Camera size={32} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.5rem' }}>Registro Fotográfico</h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Capture ou envie fotos do paciente para acompanhar a evolução visual.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }} className="no-print">
                           <button className="btn btn-primary" onClick={startCamera}>
                              <Camera size={18} /> Abrir Câmera
                           </button>
                           <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                              <Upload size={18} /> Upload de Fotos
                              <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                           </label>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                    {capturedPhotos.map((photo, i) => (
                      <div key={i} style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                         <img src={photo} alt={`Foto ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         <button 
                           onClick={() => setCapturedPhotos(prev => prev.filter((_, idx) => idx !== i))}
                           style={{ position: 'absolute', top: '5px', right: '5px', padding: '4px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer' }}
                         >
                           <X size={12} />
                         </button>
                      </div>
                    ))}
                    {!isCameraActive && capturedPhotos.length < 6 && (
                      <div style={{ aspectRatio: '3/4', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Plus size={24} color="#e2e8f0" />
                      </div>
                    )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Diagnóstico Estilo Avanutri (Image 3) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.25rem', color: '#1e293b', textTransform: 'uppercase' }}>Classificação Peso (kg)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {[
                 { label: 'Gordura Absoluta', value: data.gorduraAbs },
                 { label: 'Massa Magra', value: data.massaMagra },
                 { label: 'Peso Ideal (Guedes)', value: data.pesoIdeal },
                 { label: 'Peso Excesso', value: data.excessoPeso }
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#1e293b' }}>{item.value}</span>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>Classificação IMC</span>
               </div>
               <div style={{ padding: '0.75rem', backgroundColor: '#fef08a', borderRadius: '8px', border: '2px solid #eab308', color: '#854d0e', fontWeight: '900', fontSize: '1rem', textAlign: 'center' }}>
                  PRÉ-OBESO
               </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.25rem', color: '#1e293b', textTransform: 'uppercase' }}>Circunferências</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                   <span>Braço (cm)</span>
                   <span>35</span>
                 </div>
                 <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '6px', color: '#166534', fontWeight: '900', fontSize: '0.75rem' }}>EUTRÓFICO</div>
               </div>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                   <span>Muscular do Braço (cm)</span>
                   <span>31,23</span>
                 </div>
                 <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '6px', color: '#166534', fontWeight: '900', fontSize: '0.75rem' }}>EUTRÓFICO</div>
               </div>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                   <span>Abdômen (cm)</span>
                   <span>94</span>
                 </div>
                 <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '6px', color: '#166534', fontWeight: '900', fontSize: '0.75rem' }}>SEM RISCO DE DCV</div>
               </div>
            </div>
          </div>

          <button 
            className="btn btn-primary no-print" 
            style={{ width: '100%', height: '54px', fontSize: '1rem', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}
            onClick={handleSyncBio}
            disabled={isSyncing}
          >
             {isSyncing ? (
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: '100%' }} 
                 style={{ position: 'absolute', left: 0, top: 0, height: '100%', backgroundColor: 'rgba(255,255,255,0.2)' }} 
               />
             ) : null}
             <Bluetooth size={20} /> {isSyncing ? 'Sincronizando...' : 'Importar Bioimpedância'}
          </button>

          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }} className="no-print">
            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} /> Hardware Recomendado
            </h4>
            <p style={{ fontSize: '0.7rem', color: '#166534', lineHeight: '1.4' }}>
              Para melhor performance, utilize balanças com protocolo **Bluetooth 5.0+**:
              <br />• <strong>Xiaomi Mi Body Composition 2</strong> (Driver Nativo)
              <br />• <strong>Omron HBF-222T</strong>
              <br />• <strong>Tanita RD-953</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Anthropometry
