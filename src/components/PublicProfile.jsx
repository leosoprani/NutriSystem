import React from 'react'
import { motion } from 'framer-motion'
import { Instagram, Linkedin, Globe, MapPin, Calendar, CheckCircle2, MessageCircle, Activity, Star, Apple, ArrowLeft } from 'lucide-react'

const PublicProfile = ({ nutriData, onBack }) => {
  const { 
    name = "Dr. Leonardo Silva", 
    specialty = "Nutrição Esportiva & Performance", 
    bio = "Especialista em transformar vidas através da alimentação consciente. Com mais de 10 anos de experiência, ajudo atletas e entusiastas a alcançarem seu potencial máximo.",
    avatar = "",
    social = { instagram: "@dr.leonardo", linkedin: "dr-leonardo-silva", site: "www.drleonardo.com.br" },
    location = "São Paulo, SP - Av. Paulista, 1000",
    specialties = ["Hipertrofia", "Emagrecimento", "Nutrição Vegetariana", "Suplementação"],
    reviews = [
      { id: 1, user: "Ana Beatriz", comment: "Excelente profissional! Resultados em 3 meses.", stars: 5 },
      { id: 2, user: "Carlos Santos", comment: "Muito atencioso e o app facilita tudo.", stars: 5 }
    ]
  } = nutriData || {}

  const handleBooking = () => {
    // Simulação de link de WhatsApp
    window.open('https://wa.me/5511999999999?text=Olá, gostaria de agendar uma consulta!', '_blank')
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Botão Voltar (Apenas no Preview) */}
      {onBack && (
        <button 
          onClick={onBack}
          style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 100, backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={18} /> Voltar ao Dashboard
        </button>
      )}

      {/* Navbar Minimalista */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="var(--primary)" size={24} />
          <span style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>NutriSystem<span style={{ color: 'var(--primary)' }}>.</span>Network</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '10rem 2rem 6rem', background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05), transparent 40%)', overflow: 'hidden' }}>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '320px', height: '400px', borderRadius: '40px', backgroundColor: '#f1f5f9', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}
          >
            {avatar ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Apple size={80} color="var(--primary)" opacity={0.2} />
                <p style={{ fontWeight: 'bold', color: '#94a3b8' }}>Foto do Profissional</p>
              </div>
            )}
          </motion.div>
          
          <div style={{ flex: 1, minWidth: '320px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase' }}>{specialty}</span>
              <h1 style={{ fontSize: '4.5rem', fontWeight: '900', letterSpacing: '-0.05em', margin: '1rem 0', lineHeight: 0.9, color: '#0f172a' }}>{name}</h1>
              <p style={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: '500' }}>{bio}</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  onClick={handleBooking}
                  style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0 3rem', height: '64px', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                >
                  <MessageCircle size={22} /> Agendar via WhatsApp
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Instagram size={24}/></button>
                  <button style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Linkedin size={24}/></button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialty Grid */}
      <section style={{ padding: '8rem 2rem', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Especialidades & Foco</h2>
            <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--primary)', margin: '1.5rem auto', borderRadius: '10px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {specialties.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)' }}
                style={{ padding: '2.5rem 2rem', backgroundColor: '#f8fafc', borderRadius: '32px', textAlign: 'center', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}
              >
                <div style={{ width: '56px', height: '56px', backgroundColor: '#fff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 15px 25px rgba(0,0,0,0.05)' }}>
                  <CheckCircle2 color="var(--primary)" size={28} />
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{s}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section style={{ padding: '8rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Sua Jornada de Saúde</h2>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>Um método focado em resultados reais e sustentáveis.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {[
              { title: 'Consulta Inicial', desc: 'Análise profunda dos seus hábitos, exames e objetivos.', step: '01' },
              { title: 'Plano Personalizado', desc: 'Protocolo exclusivo entregue diretamente no seu app.', step: '02' },
              { title: 'Suporte Contínuo', desc: 'Acompanhamento diário via chat e monitoramento de metas.', step: '03' }
            ].map((item, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <span style={{ fontSize: '6rem', fontWeight: '900', color: 'rgba(16, 185, 129, 0.05)', position: 'absolute', top: '-2.5rem', left: '-1rem', zIndex: 0 }}>{item.step}</span>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>{item.title}</h4>
                  <p style={{ color: '#475569', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '8rem 2rem', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Depoimentos Reais</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                  {[...Array(r.stars)].map((_, i) => <Star key={i} size={16} fill="var(--primary)" color="var(--primary)" />)}
                </div>
                <p style={{ fontStyle: 'italic', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>"{r.comment}"</p>
                <p style={{ fontWeight: '800', color: '#0f172a' }}>— {r.user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#0f172a', borderRadius: '48px', padding: '5rem 2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, background: 'repeating-linear-gradient(45deg, #fff 0, #fff 10px, transparent 10px, transparent 20px)' }} />
          <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem', position: 'relative', letterSpacing: '-0.04em' }}>Transforme sua saúde hoje.</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.6, position: 'relative', maxWidth: '600px', margin: '0 auto 3rem' }}>Comece sua jornada com um acompanhamento personalizado e tecnologia de ponta.</p>
          <button 
            onClick={handleBooking}
            style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '1.25rem 4rem', borderRadius: '24px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Falar com a Secretária
          </button>
        </div>
        
        <div style={{ marginTop: '5rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><MapPin size={18} color="var(--primary)" /> {location}</div>
          <p>© 2026 NutriSystem Professional. Todos os direitos reservados.</p>
        </div>
      </section>

    </div>
  )
}

export default PublicProfile
