const getApiUrl = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    // ALTERE AQUI: Coloque o link do seu site na Locaweb
    // Exemplo: 'https://nutrisystem.com.br/api'
    return 'http://nutrisystem.saude.ws/api';
  }

  return '/api';
};

export const API_URL = getApiUrl();
