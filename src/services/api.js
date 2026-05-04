import { API_URL } from './apiConfig';

export const chatService = {
  getMessages: async (patientId) => {
    if (!patientId) return [];
    try {
      const response = await fetch(`${API_URL}/messages.php?patient_id=${patientId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.warn('Usando LocalStorage (API PHP não encontrada ou Offline)');
      return JSON.parse(localStorage.getItem(`chat_history_${patientId}`) || '[]');
    }
  },
  sendMessage: async (patientId, sender, text) => {
    if (!patientId) return { error: 'Patient ID missing' };
    const messageData = { patient_id: patientId, sender, text };
    
    // Salva localmente primeiro (UX rápida)
    const localHistory = JSON.parse(localStorage.getItem(`chat_history_${patientId}`) || '[]');
    localStorage.setItem(`chat_history_${patientId}`, JSON.stringify([...localHistory, { ...messageData, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]));

    try {
      const response = await fetch(`${API_URL}/messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      
      // Sincroniza abas no mesmo navegador instantaneamente
      const bc = new BroadcastChannel('chat_sync');
      bc.postMessage({ type: 'NEW_MESSAGE', patientId });
      
      return await response.json();
    } catch (error) {
      const bc = new BroadcastChannel('chat_sync');
      bc.postMessage({ type: 'NEW_MESSAGE', patientId });
      console.warn('Mensagem salva apenas localmente (Offline)');
      return { success: true, local: true };
    }
  },
  
  // Sincronização de Dados Clínicos (Dieta, Evolução, etc)
  notifyDataChange: (patientId, type) => {
    const bc = new BroadcastChannel('data_sync');
    bc.postMessage({ type: 'DATA_UPDATE', dataType: type, patientId });
    bc.close();
  }
};
