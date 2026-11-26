# Uno

![GitHub repo size](https://img.shields.io/github/repo-size/allbertuu/uno-web?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/allbertuu/uno-web?style=for-the-badge)

<img src="uno-banner.jpg" width="800px" alt="Uno - Uma tarefa de cada vez">

O **Uno** coloca apenas uma tarefa no centro da tela para tornar o trabalho mais fácil sem distrações, mais claro com critérios de aceite objetivos e mais satisfatório ao transformar cada entrega em uma conquista imediata.

## ✨ Funcionalidades

O **Uno** foi projetado para eliminar a sobrecarga cognitiva e manter você em estado de fluxo:

- **Foco Único e Centralizado:** Permite criar e gerenciar apenas **1 tarefa ativa por vez**, exibida de forma limpa e centralizada com título e prazo definido.
- **Critérios de Aceite Interativos:** Quebre o objetivo em etapas verificáveis com checkboxes táteis e acompanhe a barra de progresso em tempo real.
- **Botão "Conquistar" Inteligente:** Permanece desativado até que 100% dos critérios de aceite sejam marcados, garantindo entregas completas e celebrando a conclusão com feedback visual.
- **Gamificação Minimalista:** Contadores de **total de conquistas** (troféu) e **sequência de foco** (chama) para estimular a consistência diária sem ruído visual.
- **Persistência Automática e Tema Adaptável:** Salva seu progresso, estatísticas e preferência entre modo claro e escuro diretamente no navegador (`localStorage`).

## 🛠️ Tecnologias

O projeto foi construído com foco em performance, tipagem segura, qualidade de código e confiabilidade:

- **Core & Interface:** Next.js, React, TypeScript
- **Estilização:** TailwindCSS e ícones minimalistas (Lucide React)
- **Qualidade & Testes Automatizados:** Vitest e Testing Library para garantir a estabilidade dos fluxos de criação, progresso e conclusão de tarefas

## 🚀 Instalando o Uno

### 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão mais recente do **Node.js** (v18+ recomendado) e um gerenciador de pacotes (**npm**, **yarn** ou **pnpm**).
- Você tem uma máquina **Windows, Linux ou macOS** (compatível com qualquer sistema operacional com suporte a navegadores modernos).
- Você leu a documentação básica do **React** e **Next.js** (ou da stack configurada no projeto).

Para instalar o **Uno**, siga estas etapas:

```bash
# Clone o repositório
git clone https://github.com/allbertuu/uno-web.git

# Acesse a pasta do projeto
cd uno-web

# Instale as dependências
npm install

# Rode os testes
npm test
