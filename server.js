const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messages = require('./utils/messages');
const users = require('./utils/users');
const { db } = require('./utils/database');
const { roomModel } = require('./models/room');


const app = express();
const server = http.createServer(app);

// Create a Socket and set the /chat namespace
const chat = socketio(server).of('/chat');

// Set static folder for the html pages
app.use(express.static(path.join(__dirname, 'public')));
// Urlencode for post forms
app.use(express.urlencoded({ extended : false }));

// Hard coded bot name
const botName = 'ChatCord Bot';

// For the posted params
let username = 'USER';
let room = 'DEFAULT';

// Basic routing
/* 
    TODO implement full app routing (single page app ?)
*/
app.post('/chat', (req, res) => {

    // Set the params
    username = req.body.username;
    //room = req.body.room;
    
    roomModel.findOne({ room : req.body.room }, 'room', (err, result) => {
        console.log(err);
        room = result.room;
    });  
    
    // Serve the chat.html file to it's route
    res.sendFile(path.join(__dirname, 'public/chat.html'));

});
// redirect to index for all other routes
app.get('/*', (req, res) => {
    res.redirect('/');
});

/*
// Use middleware 
chat.use(function(socket, next){

    // TODO user authentication here
    // room log in form validation

    next();
});
*/

// Listens for connection event on /chat namespace  
chat.on('connection', socket => {    

    /*
    // Get params from url
    //console.log(socket.nsp.name);
    //console.log(socket.handshake.query);
    const username = socket.handshake.query.username;
    const room = socket.handshake.query.room;  
    */

    // Create the user in the users array
    const user = users.joinRoom(socket.id, username, room);

    // Join the Socket.io room
    socket.join(room, () => { 
        
        /* 
            The current user is connected to two rooms :
            - personnal room (room name is socket.id)
            - choosen room from the log in form  
        */ 
        //console.log(`${username} is connected to rooms : ${Object.keys(socket.rooms).join(' ')}`); 
        
        // Emit a welcome message to the user that connects to the room 
        socket.emit('roomMessage', messages.formatMessage(botName, `Welcome to ChatCord ${username} !`, Date()));

        // Broadcast to all the users in the current room except the one who connects
        socket.broadcast
            .to(room)
            .emit(
            'roomMessage', 
            messages.formatMessage(botName, `${username} has joined the chat.`, Date())
        );
        
        // Emit roomInfos back to all the users connected to the room
        chat.to(room).emit('roomInfos', {
            room: room,
            users: users.getRoomUsers(room)
        });  

    });    
    
    // Listen for submitted userMessage
    socket.on('userMessage', msg => {

        // Get the current user
        //const user = users.getCurrentUser(socket.id);

        /* 
            TODO validate the message data
        */
       const message = { text: msg, date: Date(), username: username };

        roomModel.updateOne({ room : room }, { $push : { messages : message } }, (err, result) => {
            console.log('message saved !');            
        });        

        // Emits userMessage back as roomMessage
        chat.to(room).emit('roomMessage', messages.formatMessage(username, msg, Date()));
    
    });

     // Runs when client disconnects
     socket.on('disconnect', () => {

        // Remove user from users array
        const user = users.leaveRoom(socket.id);
        
        if(user) {

            // Broadcast roomMessage to users except the current user
            socket.broadcast.to(room)
            .emit(
                'roomMessage', 
                messages.formatMessage(botName, `${username} has left the chat.`, Date())
            );
            
            // Emit updated roomInfos back to the room users
            chat.to(room).emit('roomInfos', {
                room: room,
                users: users.getRoomUsers(room)
            });
            
        }        
    
    });
    
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
