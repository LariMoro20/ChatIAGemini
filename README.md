# 🐱🤖 Chat Multi-Agente Interativo

Um chat web interativo com múltiplos **agentes inteligentes**, incluindo um assistente padrão, QuizMaster, especialista em gatos e RPG Master. Permite trocar de agente, enviar mensagens e receber respostas geradas via **API Gemini** (Google Generative AI). O projeto é divertido, educativo e personalizável.

---

## 🎯 Funcionalidades Principais

- 💬 **Chat multi-agente**: escolha entre diferentes agentes especializados.
- 🧩 **Agentes incluídos**:

  - **Default**: assistente amigável e prestativo.
  - **QuizMaster**: mestre de desafios, quizzes e curiosidades.
  - **CatExpert**: especialista em comportamento, saúde e bem-estar felino.
  - **RPG Master**: narrador de aventuras curtas de RPG com escolhas interativas.

- 📝 **Histórico de conversa** separado para cada agente.
- 🖊️ **Markdown** suportado: títulos, listas, códigos, links e blocos de citação.
- ⌨️ **Envio de mensagens via Enter**, nova linha com Shift+Enter.
- ⏱️ Indicador de digitação animado enquanto o agente responde.
- 🔑 **Configuração de chave da API**: insira a chave do Google Gemini e interaja.
- 🎨 Layout responsivo e intuitivo.
- 🛠️ Código modular, fácil de personalizar e adicionar novos agentes.

---

## 📦 Estrutura do Projeto

```
/project-root
│
├─ index.html          # Interface principal do chat
├─ style.css           # Estilos e layout
├─ script.js           # Lógica de agentes, envio de mensagens e histórico
└─ README.md           # Documentação do projeto
```

---

## 🛠️ Como Usar

### 1. Abrir o projeto

- Abra `index.html` no navegador moderno (Chrome, Firefox ou Edge).

### 2. Inserir a chave da API

1. Copie sua chave da API Gemini (deve começar com `AIza`).
2. Cole no input da tela inicial e clique em **Salvar chave**.
3. O input desaparece automaticamente ao validar a chave.

> ⚠️ Se a chave for inválida, a seção volta para você tentar novamente.

### 3. Enviar mensagens

- Digite no campo de mensagem e pressione **Enter** para enviar.
- Use **Shift+Enter** para adicionar uma nova linha sem enviar.
- O histórico da conversa é separado por agente.

### 4. Trocar de agente

- Pelo **select** na interface: escolha outro agente e ele assume automaticamente.
- Pelo comando dentro do chat: `/agente nome_do_agente`
  Exemplo: `/agente rpggame`

---

## 🐾 Lista de Agentes

| Nome       | Emojis | Função                                                                                 |
| ---------- | ------ | -------------------------------------------------------------------------------------- |
| Default    | 🌟     | Assistente amigável, responde perguntas gerais de forma clara e organizada.            |
| QuizMaster | 🎲     | Cria quizzes, perguntas rápidas e explicações divertidas sobre vários temas.           |
| CatExpert  | 🐱     | Especialista em gatos: comportamento, saúde, alimentação e cuidados.                   |
| RPG Master | 🗡️     | Cria aventuras curtas de RPG, com opções interativas e final definido em até 5 turnos. |

---

## ✨ Funcionalidades Avançadas

- **Markdown enriquecido**: títulos, listas, links, blocos de código e citações.
- **Auto-resize** do campo de input, limitado a 100px.
- **Indicador de digitação** animado enquanto o agente está gerando a resposta.
- **Mensagens de sistema**: exibe status, erros e notificações para o usuário.
- **Fallback de erros**: quando há problema com a API, o input da chave reaparece.

---

## 🔧 Personalizando Agentes

Você pode criar novos agentes adicionando objetos dentro do `const agentes` em `script.js`:

```js
const agentes = {
  meuAgente: [
    {
      role: 'user',
      parts: [
        {
          text: 'Você é meuAgente, um assistente divertido que responde tudo com emojis.'
        }
      ]
    }
  ]
}
```

- Para adicionar no select:

```html
<option value="meuAgente">😎 Meu Agente</option>
```

- Use `/agente meuAgente` para trocar via chat.

---

## 🚀 Como Integrar com API Gemini

- A API utilizada é `gemini-2.0-flash` da Google Generative AI.
- `POST` para:

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=SUA_CHAVE
```

- Payload:

```json
{
  "contents": [...historicoDoAgente],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2000
  }
}
```

- Resposta do assistente adicionada ao histórico do agente.

---

## 📌 Observações

- Este projeto é **educativo e divertido**, ideal para testes de chat multi-agente.
- Não há persistência de dados além do runtime: se recarregar a página, o histórico reinicia.
- **Não salvar a chave da API**: o input desaparece apenas durante a sessão.

---

## 💡 Possíveis melhorias futuras

- Adicionar persistência local do histórico (LocalStorage ou IndexedDB).
- Criar suporte a imagens ou rich media nas respostas.
- Adicionar sistema de pontuação para o QuizMaster.
- Permitir múltiplas aventuras salvas para o RPG Master.

---

## 📝 Licença

Este projeto é **open-source** e pode ser usado e modificado livremente segundo a licença. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Made with :heart: by [Larissa Santos](https://larissa-santos.vercel.app/)

---
