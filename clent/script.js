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

  messages.forEach((msg, index) => {
    const className = msg.sender === 'You' ? 'message user' : 'message bot';
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = `
      ${msg.text}
      <span class="delete-btn" data-index="${index}">🗑️</span>
    `;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;

  // Handle delete clicks
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.index;
      chats[currentChatId].messages.splice(i, 1);
      saveChats();
      renderChat();
    };
  });
}



// Render sidebar
function renderChatHistory() {
  chatHistoryList.innerHTML = '';

  Object.keys(chats).forEach(id => {
    const name = chats[id].name || `Chat ${id.slice(-5)}`;

    const li = document.createElement('li');
    li.innerHTML = `
      <span class="chat-name">${name}</span>
      <span class="chat-delete" data-id="${id}">🗑️</span>
    `;

    li.querySelector('.chat-name').onclick = () => {
      currentChatId = id;
      renderChat();
    };

    li.querySelector('.chat-delete').onclick = (e) => {
      e.stopPropagation();
      delete chats[id];
      if (currentChatId === id) {
        currentChatId = Date.now().toString(); // create new chat ID
      }
      saveChats();
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
