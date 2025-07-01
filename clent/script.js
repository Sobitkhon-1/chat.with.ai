let currentChatId = Date.now().toString();
let chats = JSON.parse(localStorage.getItem('chats')) || {};

const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const botSelect = document.getElementById('botSelect');
const chatHistoryList = document.getElementById('chatHistoryList');
const newChatBtn = document.getElementById('newChatBtn');

// Save chat state
function saveChats() {
  localStorage.setItem('chats', JSON.stringify(chats));
  renderChatHistory();
}

// Render current chat
function renderChat() {
  chatBox.innerHTML = '';
  const messages = chats[currentChatId]?.messages || [];
  messages.forEach(({ sender, text }) => {
    chatBox.innerHTML += `<div><strong>${sender}:</strong> ${text}</div>`;
  });
}

// Render sidebar
function renderChatHistory() {
  chatHistoryList.innerHTML = '';
  Object.keys(chats).forEach(id => {
    const name = chats[id].name || `Chat ${id.slice(-5)}`;
    const li = document.createElement('li');
    li.textContent = name;
    li.onclick = () => {
      currentChatId = id;
      renderChat();
    };
    chatHistoryList.appendChild(li);
  });
}

// Add message to chat
function addMessage(sender, text) {
  if (!chats[currentChatId]) {
    chats[currentChatId] = {
      name: `Chat ${Object.keys(chats).length + 1}`,
      messages: []
    };
  }
  chats[currentChatId].messages.push({ sender, text });
  saveChats();
  renderChat();
}

// Handle form submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value;
  addMessage('You', message);
  messageInput.value = '';

  const bot = botSelect.value;
  const response = await fetch(`http://localhost:3000/api/${bot}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  addMessage(bot, data.reply);
});

// Start new chat
newChatBtn.addEventListener('click', () => {
  currentChatId = Date.now().toString();
  renderChat();
  saveChats();
});

// Initial load
renderChatHistory();
renderChat();
