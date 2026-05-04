/**
 * Security Service - NutriSystem SaaS
 * Provê criptografia de dados para armazenamento local e comunicações sensíveis.
 */

const MASTER_KEY = 'nutrisystem10081944'; // Chave mestra para cifragem

export const securityService = {
  /**
   * Criptografia simples para ocultar dados no localStorage (Obfuscação robusta)
   * Para uma camada real de banco de dados, o PHP usará OpenSSL/AES-256.
   */
  encrypt: (text) => {
    if (!text) return text;
    try {
      const textToEncrypt = typeof text === 'object' ? JSON.stringify(text) : String(text);
      let result = '';
      for (let i = 0; i < textToEncrypt.length; i++) {
        result += String.fromCharCode(textToEncrypt.charCodeAt(i) ^ MASTER_KEY.charCodeAt(i % MASTER_KEY.length));
      }
      return btoa(unescape(encodeURIComponent(result)));
    } catch (e) {
      console.error('Erro na criptografia:', e);
      return text;
    }
  },

  /**
   * Descriptografia dos dados locais
   */
  decrypt: (encodedText) => {
    if (!encodedText) return encodedText;
    try {
      const decoded = decodeURIComponent(escape(atob(encodedText)));
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ MASTER_KEY.charCodeAt(i % MASTER_KEY.length));
      }
      try {
        return JSON.parse(result);
      } catch {
        return result;
      }
    } catch (e) {
      console.error('Erro na descriptografia:', e);
      return encodedText;
    }
  },

  /**
   * Gera um hash para senhas ou tokens (Simulação SHA-256)
   */
  hash: async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Helper para salvar no localStorage de forma segura
   */
  setSecureItem: (key, value) => {
    const encrypted = securityService.encrypt(value);
    localStorage.setItem(`ns_sec_${key}`, encrypted);
  },

  /**
   * Helper para ler do localStorage de forma segura
   */
  getSecureItem: (key) => {
    const encrypted = localStorage.getItem(`ns_sec_${key}`);
    return securityService.decrypt(encrypted);
  },

  /**
   * Limpa todos os dados de sessão
   */
  clear: () => {
    const keys = ['is_auth', 'is_configured', 'is_secretary', 'is_patient_mode', 'logged_patient', 'nutri_name', 'nutri_email', 'nutri_avatar'];
    keys.forEach(key => localStorage.removeItem(`ns_sec_${key}`));
  },

  /**
   * Anonimização de dados para relatórios estatísticos (LGPD)
   * Remove PII (Personally Identifiable Information) mantendo dados clínicos.
   */
  anonymize: (data) => {
    if (!data) return data;
    const anonymized = Array.isArray(data) ? [...data] : {...data};
    
    const strip = (obj) => {
      const sensitive = ['name', 'email', 'phone', 'cnpj', 'address', 'password', 'crn', 'cpf'];
      const newObj = {...obj};
      sensitive.forEach(key => delete newObj[key]);
      newObj.id = `anon_${Math.random().toString(36).substr(2, 9)}`;
      return newObj;
    };

    if (Array.isArray(anonymized)) {
      return anonymized.map(item => strip(item));
    }
    return strip(anonymized);
  }
};
