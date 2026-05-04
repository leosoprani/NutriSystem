O que foi implementado:
Master Console (Seu Painel de Controle):

Criei o componente AdminMaster.jsx. Este é o seu painel "super-admin".
Funcionalidades: Você pode cadastrar novos nutricionistas, definir subdomínios personalizados (ex: clinica-ana.nutrisystem.com.br) e monitorar o status de configuração de cada um.
Acesso: Adicionei um link "invisível" no canto inferior esquerdo da tela de Login (Master Console) para que apenas você acesse este painel administrativo.
Setup Wizard (Assistente de Onboarding):

Criei o SetupWizard.jsx. Sempre que você criar um novo nutricionista e ele fizer o primeiro login, o sistema detectará que ele é novo e abrirá um assistente de 4 etapas:
Etapa 1: Coleta de dados profissionais (Nome, CRN/CRP).
Etapa 2: Dados da Empresa (CNPJ, Razão Social, Telefone).
Etapa 3: Identidade Visual (Upload de Logotipo e Assinatura Digital).
Etapa 4: Verificação Técnica (Status da base de dados e impressora).
Lógica de Isolamento:

O NutriSystem agora bloqueia o acesso ao Dashboard principal até que o nutricionista finalize o SetupWizard. Isso garante que todos os relatórios e PDFs gerados já saiam com os dados corretos da clínica dele.
Pronto para Locaweb:

A estrutura está preparada para persistir esses dados em banco de dados MySQL via PHP. O sistema já diferencia o "Modo Admin" do "Modo Nutri".
Como testar:
Na tela de Login, procure um link quase transparente no canto inferior esquerdo chamado "Master Console".
Lá, você pode simular o cadastro de um novo nutricionista.
Ao logar como um novo nutri, o Setup Wizard será disparado automaticamente, guiando o profissional até que o sistema esteja 100% pronto para uso.


----------------------------------------------------------------------------------------------------





 elaborar um plano mestre para transformar o NutriSystem em uma plataforma SaaS (Software as a Service) escalável, pronta para ser hospedada na Locaweb.

Para atender à sua necessidade de gerenciar múltiplos nutricionistas com dados isolados e um processo de onboarding automatizado, a melhor arquitetura é o Multi-tenancy.

Estrutura do Plano SaaS
mermaid
graph TD
    A[Super Admin - Você] -->|Cria Conta| B[Novo Nutricionista]
    B -->|Primeiro Acesso| C[Setup Wizard / Onboarding]
    C -->|Configura| D[Dados: CNPJ, Logo, Assinatura]
    D -->|Pronto| E[Acesso Total ao NutriSystem]
    
    subgraph "Banco de Dados (MySQL - Locaweb)"
        F[(Tenant 1: Dr. João)] 
        G[(Tenant 2: Dra. Maria)]
        H[(Tenant 3: Nutri Clínica X)]
    end
    
    E --> F
1. Gestão de Banco de Dados (Isolamento)
Embora você tenha pedido bancos separados, na Locaweb (hospedagem compartilhada), criar 100 bancos de dados via código pode ser limitado. A recomendação profissional é:

Abordagem Recomendada: Um único banco de dados com uma coluna tenant_id em todas as tabelas. Isso garante que o Nutricionista A nunca veja os pacientes do Nutricionista B.
Abordagem "Fisicamente Separada": Se você realmente deseja bancos separados, precisaremos de um script PHP que crie o banco via CREATE DATABASE no momento em que você cadastra o nutri no seu painel Admin.
2. Painel Super Admin (Seu Acesso)
Criaremos uma rota oculta (ex: /admin-master) onde você poderá:

Digitar o e-mail do nutricionista.
Gerar uma senha temporária.
Definir o subdomínio ou ID único dele.
3. O Fluxo de Onboarding (Primeira Configuração)
Quando o nutricionista fizer o primeiro login, o sistema detectará is_configured: false e abrirá o "Assistente de Ativação Titanium":

Passo 1: Dados Jurídicos: CNPJ/CPF, Telefone, Endereço.
Passo 2: Branding: Upload de Logo e Assinatura Digital.
Passo 3: Dispositivos: Teste de impressão e detecção de balanças (via Bluetooth/WebHID).
Implementação Técnica (Passo a Passo)
Vou começar criando o componente de Onboarding Wizard e a lógica de Super Admin para você gerenciar os cadastros.

IMPORTANT

Para a Locaweb, utilizaremos PHP no backend para gerenciar as sessões e a conexão com o banco MySQL, garantindo que cada login aponte para os dados corretos.

Vou criar o arquivo com o plano detalhado de banco de dados e as telas de configuração.

[ARTIFACT: saas_implementation_plan] Path: file:///Users/leonardo/.gemini/antigravity/brain/6e226272-9186-4b0a-bbe3-45af79f64648/saas_implementation_plan.md Last Edited: 2026-05-01T03:34:43Z

Vou agora criar o componente de SetupWizard.jsx para automatizar essa configuração inicial do nutricionista.