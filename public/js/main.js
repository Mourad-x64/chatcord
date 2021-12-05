// DOM elements to update
const chatForm = document.getElementById('chat-form');
const chatRoom = document.getElementById('chat-room');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Create the Socket.IO connection
// With location url and /chat namespace (in the path)
const socket = io(location.href);


// Listen to roomInfos from server
socket.on('roomInfos', ({ room, users }) => {    
    // Set room name in the chat page
    outputRoom(room);
    // Set the user list
    outputUsers(users);
});

// Listen to roomMessage from server
socket.on('roomMessage', msg => {
    //console.log(msg);
    // Inject message to DOM
    outputMessage(msg);
    // Scroll to the last message
    chatRoom.scrollTop = chatRoom.scrollHeight;
});

// Send the message after a submit
chatForm.addEventListener('submit', e => {
    // Prevent submiting to a file and page reloading
    e.preventDefault();
    // Get the submited message
    const msg = e.target.elements.msg.value;
    // Emitting the message to the server
    socket.emit('userMessage', msg);
    // Clearing input field and focusing
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Outputing the message to DOM
function outputMessage(msg) {
    const div = document.createElement('div');

    div.classList.add('message');

    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.date}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;

    chatRoom.appendChild(div);
}

// Outputing the room name to DOM
function outputRoom(room) {
    // Set room name
    roomName.innerText = room;
}

// Outputing the room users to DOM
function outputUsers(users) {
    // Set user list    
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('\n')}
    `;
}