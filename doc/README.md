# NutriSystem - Guia de Início e Deploy (Locaweb)

Este projeto é uma plataforma premium para nutricionistas, inspirada no DietSystem, construída com **React (Vite)** e backend em **PHP/MySQL** para total compatibilidade com a Hospedagem Locaweb Go Linux.

## 🚀 Como Rodar Localmente

1. **Frontend**:
   ```bash
   cd NutriSystem
   npm install
   npm run dev
   ```

2. **Backend**:
   - Você precisará de um servidor PHP local (como XAMPP ou Laragon) ou apenas apontar para o banco de dados.
   - Importe o arquivo `api/database.sql` no seu MySQL.

## 📦 Como fazer o Deploy na Locaweb

Para hospedar sua aplicação na Locaweb, siga estes passos:

### 1. Build do Frontend
No seu terminal, dentro da pasta `NutriSystem`, execute:
```bash
npm run build
```
Isso criará uma pasta `dist`.

### 2. Preparar os Arquivos
Mova o conteúdo da pasta `api` para dentro da pasta `dist` (ou mantenha-os separados se preferir, mas ajuste os caminhos).
A estrutura ideal no servidor seria:
```
/public_html
  /api (conteúdo da pasta api)
  (arquivos da pasta dist: index.html, assets/, etc)
```

### 3. Configurar o Banco de Dados na Locaweb
1. Acesse o **Painel de Controle da Locaweb**.
2. Vá em **Bancos de Dados > MySQL** e crie um novo banco.
3. Anote o **Host, Nome do Banco, Usuário e Senha**.
4. Use o **phpMyAdmin** da Locaweb para importar o arquivo `api/database.sql`.

### 4. Ajustar a Conexão
Edite o arquivo `api/config.php` no servidor com as credenciais que você criou no painel da Locaweb.

### 5. Upload via FTP
Use um cliente FTP (como FileZilla) para enviar todo o conteúdo da sua pasta `dist` local para a pasta `public_html` do seu servidor na Locaweb.

---

## ✨ Diferenciais deste Projeto
- **Design Titanium Ultra**: Interface moderna com Glassmorphism e animações fluidas.
- **Leveza**: Otimizado para rodar rápido mesmo em hospedagens compartilhadas.
- **Escalabilidade**: Estrutura pronta para crescer com novas funcionalidades como Antropometria e App do Paciente.
