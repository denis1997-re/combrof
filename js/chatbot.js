document.addEventListener('DOMContentLoaded', () => {
    // === ELEMEN HTML ===
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');
    const chatArea = document.querySelector('.chat-area');
    const historyList = document.getElementById('historyList');
    const newChatButton = document.querySelector('.new-chat-button');
    const initialMessage = document.querySelector('.initial-message');

    // === VARIABEL GLOBAL ===
    let currentConversation = [];
    let conversationId = null;

    // BASE URL backend kamu
    const baseUrl = 'https://combrof.yzz.me';

    // --- FUNGSI CHATBOT UTAMA ---

    const displayMessage = (message, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add('message-content');
        messageContentDiv.innerHTML = message.replace(/\n/g, '<br>');

        messageDiv.appendChild(messageContentDiv);
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    };

    const loadConversationHistory = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_chat_history.php`, {
                credentials: 'include'
            });
            if (!response.ok) {
                console.warn('Chat history not found or failed to load. Starting a new session.');
                return;
            }
            
            const allConversations = await response.json();
            historyList.innerHTML = '';

            const conversationKeys = Object.keys(allConversations).sort().reverse();

            conversationKeys.forEach(id => {
                const conversation = allConversations[id];
                if (conversation.length > 0) {
                    const firstMessage = conversation[0].message;
                    const historyItem = document.createElement('li');
                    historyItem.classList.add('history-item');
                    historyItem.textContent = firstMessage.length > 30 ? firstMessage.substring(0, 27) + '...' : firstMessage;
                    historyItem.dataset.id = id;
                    historyItem.addEventListener('click', () => loadConversation(id));
                    historyList.appendChild(historyItem);
                }
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const loadConversation = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/get_chat_history.php`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to load specific chat.');

            const allConversations = await response.json();
            const conversationToLoad = allConversations[id];

            if (conversationToLoad) {
                currentConversation = conversationToLoad;
                conversationId = id;
                chatArea.innerHTML = '';
                if (initialMessage) initialMessage.style.display = 'none';

                currentConversation.forEach(msg => {
                    displayMessage(msg.message, msg.sender);
                });
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const saveConversation = async () => {
        if (!conversationId) {
            console.error('Cannot save. Conversation ID is missing.');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/save_chat_history.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    conversationId: conversationId,
                    conversationData: currentConversation
                })
            });
            if (!response.ok) {
                console.error('Failed to save chat history.');
            }
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    };

    const startNewChat = () => {
        currentConversation = [];
        conversationId = new Date().getTime().toString();
        chatArea.innerHTML = '';
        if (initialMessage) initialMessage.style.display = 'block';
        chatInput.focus();
        loadConversationHistory();
    };

    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        displayMessage(userMessage, 'user');
        chatInput.value = '';
        if (initialMessage) initialMessage.style.display = 'none';

        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message', 'bot-message', 'typing');
        const loadingContent = document.createElement('div');
        loadingContent.classList.add('message-content');
        loadingContent.textContent = 'Mengetik...';
        loadingMessage.appendChild(loadingContent);
        chatArea.appendChild(loadingMessage);
        chatArea.scrollTop = chatArea.scrollHeight;

        currentConversation.push({ sender: 'user', message: userMessage });

        try {
            const response = await fetch(`${baseUrl}/chatbot_api.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ message: userMessage, conversation_history: currentConversation }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal terhubung ke server.');
            }

            const data = await response.json();

            if (chatArea.contains(loadingMessage)) {
                chatArea.removeChild(loadingMessage);
            }

            const botResponse = data.response;
            displayMessage(botResponse, 'bot');
            currentConversation.push({ sender: 'bot', message: botResponse });

            saveConversation();
            loadConversationHistory();
        } catch (error) {
            console.error('Error:', error);
            if (chatArea.contains(loadingMessage)) {
                chatArea.removeChild(loadingMessage);
            }
            const errorMessage = 'Maaf, terjadi kesalahan. Coba lagi nanti.';
            displayMessage(errorMessage, 'bot');
            currentConversation.push({ sender: 'bot', message: errorMessage });
            saveConversation();
        }
    };

    // --- EVENT LISTENERS ---
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    if (newChatButton) {
        newChatButton.addEventListener('click', startNewChat);
    }

    // --- INISIALISASI ---
    startNewChat();
    loadConversationHistory();
});

