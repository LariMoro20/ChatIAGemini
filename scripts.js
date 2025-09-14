let apiKey = "";
let isTyping = false;
let activeAgent = "default";
// Default agents
const agentsList = {
    default: [
        {
            role: "user",
            parts: [
                {
                    text: "Você é um assistente amigável e prestativo, capaz de responder perguntas gerais de forma clara e organizada."
                }
            ],
        }
    ],
    quizmaster: [
        {
            role: "user",
            parts: [
                {
                    text: "Você é o QuizMaster, um mestre dos desafios e curiosidades. Seu estilo é animado, envolvente e divertido. Crie perguntas de múltipla escolha, verdadeiro ou falso ou desafios rápidos sobre temas variados (cultura pop, ciência, animais, história, memes). Sempre explique a resposta de forma leve e engraçada."
                }
            ],
        }
    ],
    catexpert: [
        {
            role: "user",
            parts: [
                {
                    text: "Você é um especialista em gatos, com amplo conhecimento sobre felinos, amigável e prestativo, capaz de fornecer informações claras e confiáveis sobre comportamento, saúde, cuidados, alimentação e bem-estar."
                }
            ],
        }
    ],
    rpggame: [
        {
            role: "user",
            parts: [
                {
                    text: "Você é o RPG Master, um narrador criativo e divertido que conduz aventuras de RPG curtas e dinâmicas.Crie cenários envolventes, descreva as situações de forma épica e engraçada, e ofereça sempre 3 ou 4 opções claras para o jogador escolher.Cada aventura deve durar no máximo 5 interações (introdução, desenvolvimento e desfecho) e terminar com um final satisfatório. Antes de começar, avise o usuário que poderá sair digitando  'encerrar'.Ao encerrar a história, sempre finalize com a frase: '🏁 Fim da aventura! Deseja começar outra?'O jogador pode digitar 'encerrar' a qualquer momento para terminar a história antecipadamente."
                }
            ],
        }
    ],
};

let histories = {
    default: [...agentsList.default],
    quizmaster: [...agentsList.quizmaster],
    catexpert: [...agentsList.catexpert],
    rpggame: [...agentsList.rpggame],
};

// Auto-resize textarea
document.getElementById("messageInput").addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
});

// Send message on Enter (Shift+Enter for new line)
document.getElementById("messageInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!isTyping && this.value.trim()) {
            sendMessage();
        }
    }
});

// Change agent function
function changeAgent(valor) {
    if (agentsList[valor]) {
        activeAgent = valor;
        addMessage("system", `🤖 Agente alterado para: ${valor}`);
    } else {
        activeAgent = "default";
        addMessage("system", `⚠️ Agente "${valor}" não encontrado. Usando default.`);
    }
}

// Set ap key for requests
function saveApiKey() {
    const input = document.getElementById("apiKeyInput");
    const key = input.value.trim();

    if (!key) {
        alert("Por favor, insira uma chave da API válida.");
        return;
    }

    if (!key.startsWith("AIza")) {
        alert('A chave da API Gemini deve começar com "AIza"');
        return;
    }

    apiKey = key;
    document.getElementById("statusIndicator").classList.add("connected");
    document.getElementById("messageInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;
    document.getElementById("agentSelect").disabled = false;

    input.value = "";

    addMessage(
        "system",
        "✅ Chave da API configurada com sucesso! Você já pode conversar comigo."
    );
    document.getElementById("messageInput").focus();
    document.getElementById("apiKeySection").style.display = "none";
}

// Parse Gemini response
function parseMarkdown(text) {
    return (
        text
            .replace(/^### (.*$)/gim, "<h3>$1</h3>")
            .replace(/^## (.*$)/gim, "<h2>$1</h2>")
            .replace(/^# (.*$)/gim, "<h1>$1</h1>")
            .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
            .replace(/`(.*?)`/g, "<code>$1</code>")
            .replace(/^\- (.*$)/gim, "<li>$1</li>")
            .replace(/^\* (.*$)/gim, "<li>$1</li>")
            .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
            .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
            .replace(/^---$/gim, "<hr>")
            .replace(/^\*\*\*$/gim, "<hr>")
            .replace(
                /\[([^\]]+)\]\(([^\)]+)\)/g,
                '<a href="$2" target="_blank">$1</a>'
            )
            .replace(/\n/g, "<br>")
    );
}

function wrapListItems(html) {
    return html
        .replace(/(<li>.*?<\/li>)(?=\s*<li>)/gs, "$1")
        .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")
        .replace(/<\/ul>\s*<ul>/g, "");
}

// Add messages to chat
function addMessage(type, content) {
    const messagesContainer = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;

    if (type === "assistant") {
        let processedContent = parseMarkdown(content);
        processedContent = wrapListItems(processedContent);
        messageDiv.innerHTML = processedContent;
    } else {
        messageDiv.textContent = content;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Typing Indicator show/hide
function showTypingIndicator() {
    const messagesContainer = document.getElementById("chatMessages");
    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.id = "typingIndicator";
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to Gemini
async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (!message || isTyping) return;

    if (!apiKey) {
        alert("Por favor, configure sua chave da API primeiro.");
        return;
    }

    // Detects if the user requested a different agent through chat
    if (message.toLowerCase().startsWith("/agente ")) {
        const nomeAgente = message.replace("/agente ", "").trim();
        if (agentsList[nomeAgente]) {
            activeAgent = nomeAgente;
            addMessage("system", `🤖 Agente alterado para: ${nomeAgente}`);
        } else {
            addMessage("system", `⚠️ Agente "${nomeAgente}" não encontrado. Usando default.`);
            activeAgent = "default";
        }
        messageInput.value = "";
        return;
    }

    addMessage("user", message);
    histories[activeAgent].push({
        role: "user",
        parts: [{ text: message }],
    });

    messageInput.value = "";
    messageInput.style.height = "auto";

    isTyping = true;
    document.getElementById("sendBtn").disabled = true;
    document.getElementById("agentSelect").disabled = true;
    messageInput.disabled = true;

    showTypingIndicator();

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: histories[activeAgent],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000,
                    },
                }),
            }
        );

        removeTypingIndicator();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `API Error: ${errorData.error?.message || response.statusText}`
            );
        }

        const data = await response.json();

        if (
            !data.candidates ||
            !data.candidates[0] ||
            !data.candidates[0].content
        ) {
            throw new Error("Resposta inválida da API");
        }

        const assistantMessage = data.candidates[0].content.parts[0].text;

        addMessage("assistant", assistantMessage);
        histories[activeAgent].push({
            role: "model",
            parts: [{ text: assistantMessage }],
        });
        const el = document.getElementById("initialMessage");
        if (el) {
            el.remove();
        }
    } catch (error) {
        removeTypingIndicator();
        console.error("Error:", error);

        let errorMessage = `❌ Erro: ${error.message}`;

        if (error.message.includes("API_KEY_INVALID")) {
            errorMessage =
                "❌ Chave da API inválida. Verifique se você copiou corretamente.";
        } else if (error.message.includes("QUOTA_EXCEEDED")) {
            errorMessage =
                "❌ Cota da API excedida. Tente novamente mais tarde.";
        } else if (error.message.includes("blocked")) {
            errorMessage =
                "❌ Mensagem bloqueada por políticas de segurança. Tente reformular.";
        } else if (error.message.includes("not valid")) {
            errorMessage =
                "❌ Chave da API inválida. Informe novamente a chave.";
        }
        document.getElementById("apiKeySection").style.display = "flex";
        document.getElementById("statusIndicator").classList.remove("connected");
        document.getElementById("sendBtn").disabled = true;
        document.getElementById("agentSelect").disabled = true;

        addMessage("system", errorMessage);
    } finally {
        isTyping = false;
        document.getElementById("sendBtn").disabled = false;
        document.getElementById("agentSelect").disabled = false;
        messageInput.disabled = false;
        // messageInput.focus();
    }
}

