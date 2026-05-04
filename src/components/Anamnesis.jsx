import React, { useState } from 'react'
import { ClipboardList, Heart, Coffee, Moon, Dumbbell, Save, Key, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

const SectionHeader = ({ icon: Icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
    <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-dark)' }}>
      <Icon size={20} />
    </div>
    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{title}</h3>
  </div>
)

const CheckboxGroup = ({ label, options }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem' }}>{label}</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
      {options.map(opt => (
        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
          {opt}
        </label>
      ))}
    </div>
  </div>
)

const TextArea = ({ label, placeholder }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>{label}</label>
    <textarea 
      placeholder={placeholder}
      style={{ 
        width: '100%', 
        padding: '0.75rem', 
        borderRadius: '8px', 
        border: '1px solid var(--border)', 
        minHeight: '80px',
        fontFamily: 'inherit',
        outline: 'none'
      }}
    />
  </div>
)

const Anamnesis = ({ patient, onSave }) => {
  const [activeStep, setActiveStep] = useState(0)
  const steps = ['Histórico', 'Hábitos', 'Estilo de Vida']

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={24} color="var(--primary)" /> Anamnese Nutricional
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              fontSize: '0.875rem', 
              fontWeight: i === activeStep ? '600' : '400',
              color: i === activeStep ? 'var(--primary)' : 'var(--text-muted)',
              padding: '0.25rem 0.5rem',
              borderBottom: i === activeStep ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer'
            }} onClick={() => setActiveStep(i)}>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Card de Dados de Acesso - Novo */}
      {patient && (
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '1.25rem', 
          borderRadius: '12px', 
          border: '1px solid var(--border)', 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '10px' }}>
              <Key size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Acesso do Paciente</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                  <Mail size={14} color="var(--text-muted)" /> {patient.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  <Lock size={14} /> {patient.password || 'Senha não gerada'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => alert('Link de acesso copiado para o WhatsApp!')}
            className="btn" 
            style={{ fontSize: '0.75rem', backgroundColor: '#fff', border: '1px solid var(--border)' }}
          >
            Copiar Link de Acesso
          </button>
        </div>
      )}

      {patient && localStorage.getItem(`pre_atendimento_${patient.id}`) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', marginBottom: '2rem', padding: '1.5rem' }}>
          <h4 style={{ color: '#9a3412', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} /> Respostas do Pré-Atendimento
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9a3412', textTransform: 'uppercase' }}>Objetivo Principal</p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{JSON.parse(localStorage.getItem(`pre_atendimento_${patient.id}`) || '{}').objetivo || 'Não informado'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9a3412', textTransform: 'uppercase' }}>Alergias / Restrições</p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{JSON.parse(localStorage.getItem(`pre_atendimento_${patient.id}`) || '{}').alergias || 'Nenhuma informada'}</p>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#9a3412', marginTop: '1rem', opacity: 0.7 }}>Recebido em: {JSON.parse(localStorage.getItem(`pre_atendimento_${patient.id}`) || '{}').data}</p>
        </motion.div>
      )}

      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeStep === 0 && (
          <div>
            <SectionHeader icon={Heart} title="Histórico de Saúde" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <TextArea label="Motivo da Consulta" placeholder="O que trouxe o paciente hoje?" />
                <TextArea label="Histórico de Doenças" placeholder="Diabetes, Hipertensão, etc." />
              </div>
              <div>
                <CheckboxGroup 
                  label="Antecedentes Familiares" 
                  options={['Obesidade', 'Diabetes', 'Câncer', 'Cardiopatias', 'Dislipidemias', 'Outros']} 
                />
                <TextArea label="Uso de Medicamentos / Suplementos" placeholder="Nome e dosagem..." />
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <SectionHeader icon={Coffee} title="Hábitos Alimentares" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <CheckboxGroup 
                  label="Aversões / Intolerâncias" 
                  options={['Leite', 'Glúten', 'Amendoim', 'Peixes', 'Ovos', 'Soja']} 
                />
                <TextArea label="Recordatório de 24h" placeholder="O que comeu ontem no café, almoço, jantar..." />
              </div>
              <div>
                <TextArea label="Consumo de Água (L/dia)" placeholder="Ex: 2L" />
                <TextArea label="Frequência de Alimentação Fora" placeholder="Ex: 2x por semana" />
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <SectionHeader icon={Dumbbell} title="Estilo de Vida" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <TextArea label="Atividade Física" placeholder="Tipo, frequência e duração..." />
                <SectionHeader icon={Moon} title="Sono e Stress" />
                <TextArea label="Qualidade do Sono" placeholder="Horas por noite, acorda descansado?" />
              </div>
              <div>
                <TextArea label="Hábito Intestinal" placeholder="Frequência e consistência..." />
                <TextArea label="Nível de Estresse (0-10)" placeholder="0" />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button className="btn" style={{ background: '#f1f5f9' }}>Limpar Campos</button>
        <button 
          onClick={() => {
            alert('Anamnese salva com sucesso!')
            if (onSave) onSave()
          }}
          className="btn btn-primary"
        >
          <Save size={18} /> Salvar Anamnese
        </button>
      </div>
    </div>
  )
}

export default Anamnesis
