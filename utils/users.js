const users = [];

// Join a user to a room
function joinRoom(id, username, room) {
    const user = { id, username, room };
    users.push(user);

    return user;
}

// Leave the room
function leaveRoom(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// Export the functions
module.exports = {
    joinRoom,
    leaveRoom,
    getCurrentUser,
    getRoomUsers
}