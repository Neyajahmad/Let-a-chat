const socket = io();

let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
    name = prompt('Please enter your name: ');
} while (!name);

document.querySelector('#sendButton').addEventListener('click', () => {
    sendMessage(textarea.value);
});

document.querySelector('#emojiButton').addEventListener('click', () => {
    toggleEmojiPicker();
});

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim(),
        time: getCurrentTime() // Add current time to the message
    };

    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <div class="message__status">
            ${msg.time}
        </div>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Receive message
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Function to append emoji to message
function addEmoji(emoji) {
    textarea.value += emoji;
}

// Function to toggle emoji picker visibility
function toggleEmojiPicker() {
    const emojiPicker = document.querySelector('#emojiPicker');
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
}
