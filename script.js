// Passo 3.1: Referências aos elementos do DOM
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');

let conversationHistory = []; // Array para armazenar mensagens da conversa atual

// Passo 3.2: Função para criar e adicionar uma mensagem ao chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = text; // Usa innerHTML para permitir formatação HTML (se necessário)
    chatBox.appendChild(messageDiv);
    
    // Rola automaticamente para a última mensagem
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Passo 3.3: Função Principal de Envio de Mensagem
function sendMessage() {
    const userText = userInput.value.trim();

    if (userText === '') {
        return; // Não envia mensagem vazia
    }

    // 1. Adiciona a mensagem do usuário
    addMessage(userText, 'user');
    
    // 2. Adiciona a mensagem do usuário ao histórico da conversa atual
    conversationHistory.push({ role: 'user', content: userText });

    // 3. Limpa a caixa de input
    userInput.value = '';

    // 4. Simula a resposta da IA (substitua isso pela chamada real à API da IA)
    simulateAiResponse(userText);
    
    // 5. Salva o histórico de conversas
    saveConversationHistory(userText);
}

// Passo 3.4: Função de Simulação de Resposta da IA
function simulateAiResponse(userText) {
    // Esta é apenas uma SIMULAÇÃO. Em um projeto real, você faria uma chamada fetch() aqui.
    
    let aiResponse = "Desculpe, meu sistema de resinas está em manutenção. Não consigo responder no momento.";

    // Simulação de respostas baseadas em palavras-chave
    if (userText.toLowerCase().includes('resina epóxi')) {
        aiResponse = "A Resina Epóxi é a melhor para peças de alto brilho e mesas River Table, pois oferece alta transparência e resistência. Lembre-se de misturar na proporção exata!";
    } else if (userText.toLowerCase().includes('mesa river')) {
        aiResponse = "Para uma Mesa River, use madeira bem selada e uma resina de baixa viscosidade com cura lenta. Isso evita bolhas e garante um acabamento cristalino.";
    } else if (userText.toLowerCase().includes('catalisador')) {
        aiResponse = "O catalisador é crucial! A proporção (geralmente por peso) deve ser seguida rigorosamente. Errar a proporção pode resultar em cura incompleta (pegajosa) ou cura muito rápida (rachaduras).";
    } else {
        aiResponse = "Sou Negão das Resinas Chat IA. Posso te ajudar com epóxi, poliuretano, técnicas de lixamento ou moldes. Qual sua dúvida sobre resinas?";
    }

    // Adiciona um pequeno atraso para simular o processamento da IA
    setTimeout(() => {
        addMessage(aiResponse, 'system');
        // Adiciona a resposta da IA ao histórico da conversa atual
        conversationHistory.push({ role: 'system', content: aiResponse });
    }, 700);
}


// ----------------------------------------------------------------------
// Passo 3.5: Funções de Gerenciamento do Histórico (LocalStorage)
// ----------------------------------------------------------------------

// Carrega todas as conversas salvas ao iniciar
function loadAllConversations() {
    const allConversations = JSON.parse(localStorage.getItem('chatHistory')) || [];
    historyList.innerHTML = '';
    
    allConversations.forEach((conv, index) => {
        // Usa a primeira mensagem do usuário como título do histórico
        const title = conv.messages[0].content.substring(0, 30) + (conv.messages[0].content.length > 30 ? '...' : '');
        createHistoryItem(title, index);
    });
}

// Cria um item na barra lateral de histórico
function createHistoryItem(title, index) {
    const listItem = document.createElement('li');
    listItem.textContent = title;
    listItem.dataset.index = index; // Armazena o índice do histórico
    listItem.onclick = () => loadConversation(index); // Carrega a conversa ao clicar
    historyList.appendChild(listItem);
}

// Salva a conversa atual no LocalStorage
function saveConversationHistory(initialMessage) {
    // Só salva se for uma nova conversa (o chatbox está vazio exceto pela mensagem de boas-vindas)
    if (conversationHistory.length === 1 && chatBox.children.length === 2) {
        let allConversations = JSON.parse(localStorage.getItem('chatHistory')) || [];
        
        // Cria um novo objeto de conversa com a primeira mensagem
        const newConversation = {
            id: Date.now(),
            date: new Date().toLocaleString('pt-BR'),
            messages: conversationHistory 
        };

        allConversations.unshift(newConversation); // Adiciona no início
        localStorage.setItem('chatHistory', JSON.stringify(allConversations));
        
        // Recarrega a barra lateral do histórico
        loadAllConversations();
    }
}

// Carrega uma conversa específica do histórico para o chatBox
function loadConversation(index) {
    const allConversations = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const conversationToLoad = allConversations[index];

    if (!conversationToLoad) return;

    // Limpa o chatBox, mas mantém a mensagem inicial do sistema (opcional)
    chatBox.innerHTML = `
        <div class="message system">
            Bem-vindo(a) ao Sr. Luiz Dominus™ IA.! Como posso ajudar você hoje?
        </div>
    `;

    // Carrega as mensagens da conversa salva
    conversationToLoad.messages.forEach(msg => {
        addMessage(msg.content, msg.role);
    });

    // Atualiza a conversa atual para a que foi carregada
    conversationHistory = conversationToLoad.messages;
}

// Limpa todo o histórico de conversas
clearHistoryButton.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja EXCLUIR TODO o histórico de conversas?')) {
        localStorage.removeItem('chatHistory');
        historyList.innerHTML = '';
        // Opcional: Recarrega a página ou limpa o chatBox
        chatBox.innerHTML = `
            <div class="message system">
                Histórico limpo. Bem-vindo(a) novamente!
            </div>
        `;
    }
});


// Inicializa o chat: Carrega as conversas salvas no início
document.addEventListener('DOMContentLoaded', loadAllConversations);