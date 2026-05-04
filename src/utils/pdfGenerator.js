import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const addHeader = (doc, title, subtitle) => {
  const customLogo = localStorage.getItem('nutri_logo')
  const nutriName = localStorage.getItem('nutri_name') || 'Dr(a). Leonardo Silva'
  const nutriCRP = localStorage.getItem('nutri_crp') || 'CRN-3 12345/P'

  // Faixa Superior
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, 210, 45, 'F')

  if (customLogo) {
    try {
      doc.addImage(customLogo, 'PNG', 160, 5, 35, 30)
    } catch (e) { console.error(e) }
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(title.toUpperCase(), 15, 22)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(subtitle || 'NutriSystem Premium Clinical Report', 15, 30)
  
  doc.text(`Profissional: ${nutriName}`, 15, 36)
  doc.text(`Registro: ${nutriCRP}`, 15, 41)
}

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages()
  const nutriEmail = localStorage.getItem('nutri_email') || 'contato@nutrisystem.com.br'
  const signature = localStorage.getItem('nutri_signature')

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    
    // Assinatura
    const footerY = 275
    doc.setDrawColor(200, 200, 200)
    doc.line(60, footerY - 5, 150, footerY - 5)
    
    if (signature) {
      try {
        doc.addImage(signature, 'PNG', 85, footerY - 20, 40, 15)
      } catch (e) {}
    }
    
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'bold')
    doc.text(localStorage.getItem('nutri_name') || 'Dr. Leonardo Silva', 105, footerY, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.text(localStorage.getItem('nutri_crp') || 'CRN-3 12345/P', 105, footerY + 5, { align: 'center' })

    // Data e Página
    doc.setFontSize(8)
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 15, 290)
    doc.text(`${nutriEmail}`, 105, 290, { align: 'center' })
    doc.text(`Página ${i} de ${pageCount}`, 195, 290, { align: 'right' })
  }
}

export const generateMealPlanPDF = (patient, meals) => {
  const doc = new jsPDF()
  addHeader(doc, 'Plano Alimentar', `Paciente: ${patient.name}`)

  const tableRows = meals.map(meal => [
    meal.time,
    meal.name,
    meal.foods.map(f => `${f.name} (${f.amount})`).join('\n')
  ])

  autoTable(doc, {
    startY: 55,
    head: [['Horário', 'Refeição', 'Alimentos Sugeridos']],
    body: tableRows,
    headStyles: { fillColor: [16, 185, 129], fontStyle: 'bold' },
    styles: { cellPadding: 5, fontSize: 10 }
  })

  addFooter(doc)
  doc.save(`Plano_${patient.name.replace(/\s+/g, '_')}.pdf`)
}

export const generateEvolutionPDF = (patient, data) => {
  const doc = new jsPDF()
  addHeader(doc, 'Relatório de Evolução', `Acompanhamento: ${patient.name}`)
  
  autoTable(doc, {
    startY: 55,
    head: [['Data', 'Peso (kg)', 'Gordura (%)', 'Massa Magra (kg)', 'Adesão (%)']],
    body: data.map(d => [d.date, d.peso, d.gordura, d.massa, d.adesao]),
    headStyles: { fillColor: [16, 185, 129] }
  })
  
  addFooter(doc)
  doc.save(`Evolucao_${patient.name.replace(/\s+/g, '_')}.pdf`)
}

export const generateExamsPDF = (patient, exams) => {
  const doc = new jsPDF()
  addHeader(doc, 'Histórico de Exames', `Paciente: ${patient.name}`)
  
  autoTable(doc, {
    startY: 55,
    head: [['Data', 'Exame', 'Resultado', 'Observações Clínicas']],
    body: exams.map(e => [e.date, e.title, e.result, e.note]),
    headStyles: { fillColor: [59, 130, 246] }
  })
  
  addFooter(doc)
  doc.save(`Exames_${patient.name.replace(/\s+/g, '_')}.pdf`)
}

export const generateAnamnesisPDF = (patient, data) => {
  const doc = new jsPDF()
  addHeader(doc, 'Ficha de Anamnese', `Paciente: ${patient.name}`)
  
  let y = 60
  Object.entries(data).forEach(([key, value]) => {
    if (y > 250) { doc.addPage(); y = 55; }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.text(`${key.toUpperCase()}`, 15, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30, 41, 59)
    const splitText = doc.splitTextToSize(String(value), 180)
    doc.text(splitText, 15, y + 7)
    y += (splitText.length * 7) + 15
  })
  
  addFooter(doc)
  doc.save(`Anamnese_${patient.name.replace(/\s+/g, '_')}.pdf`)
}

export const generateRecipesPDF = (patient, recipes) => {
  const doc = new jsPDF()
  addHeader(doc, 'Receituário Nutricional', `Paciente: ${patient.name}`)
  
  let y = 60
  recipes.forEach((r, i) => {
    if (y > 230) { doc.addPage(); y = 55; }
    
    // Título da Receita
    doc.setFillColor(248, 250, 252)
    doc.rect(15, y - 5, 180, 12, 'F')
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(`${i + 1}. ${r.title.toUpperCase()}`, 20, y + 3)
    
    y += 15
    
    // Info
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(16, 185, 129)
    doc.text(`CATEGORIA: ${r.category} | CALORIAS: ${r.calories} KCAL`, 15, y)
    
    y += 8
    
    // Ingredientes
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.setFont('helvetica', 'bold')
    doc.text('INGREDIENTES:', 15, y)
    doc.setFont('helvetica', 'normal')
    const ingText = Array.isArray(r.ingredients) ? r.ingredients.join(', ') : r.ingredients
    const splitIng = doc.splitTextToSize(ingText, 180)
    doc.text(splitIng, 15, y + 6)
    
    y += (splitIng.length * 5) + 12
    
    // Preparo
    doc.setFont('helvetica', 'bold')
    doc.text('MODO DE PREPARO:', 15, y)
    doc.setFont('helvetica', 'normal')
    const splitSteps = doc.splitTextToSize(r.steps || 'Consulte o app para o modo de preparo detalhado.', 180)
    doc.text(splitSteps, 15, y + 6)
    
    y += (splitSteps.length * 5) + 20
  })
  
  addFooter(doc)
  doc.save(`Receituario_${patient.name.replace(/\s+/g, '_')}.pdf`)
}

export const generateReceiptPDF = (transaction) => {
  if (!transaction) return
  const doc = new jsPDF()
  addHeader(doc, 'Comprovante', 'Recibo de Pagamento Profissional')

  autoTable(doc, {
    startY: 60,
    head: [['Descrição', 'Valor', 'Data', 'Método']],
    body: [[transaction.description, `R$ ${transaction.amount}`, transaction.date, transaction.method]],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 8 }
  })

  const finalY = doc.lastAutoTable.finalY + 15
  doc.setFillColor(240, 253, 244)
  doc.setDrawColor(16, 185, 129)
  doc.roundedRect(15, finalY, 180, 20, 3, 3, 'FD')
  doc.setTextColor(21, 128, 61)
  doc.setFont('helvetica', 'bold')
  doc.text('PAGAMENTO CONFIRMADO', 105, finalY + 13, { align: 'center' })

  if (transaction.obs) {
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(10)
    doc.text('OBSERVAÇÕES:', 15, finalY + 45)
    doc.setFont('helvetica', 'normal')
    const splitObs = doc.splitTextToSize(transaction.obs, 180)
    doc.text(splitObs, 15, finalY + 52)
  }

  addFooter(doc)
  doc.save(`Recibo_${transaction.description.replace(/\s+/g, '_')}.pdf`)
}
