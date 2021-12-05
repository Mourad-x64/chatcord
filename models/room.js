const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    room: {
        type: String,
        required: true
    },
    messages: [{
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    }]
});

const roomModel = mongoose.model('room', schema);

module.exports = { roomModel };