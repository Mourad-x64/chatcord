const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/chatCord', { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.error(`Connection to mongodb failed ! : ${ error }`));

const db = mongoose.connection;

db.once('open', () => { console.log('Connection to mongodb successfull.'); });


module.exports = {
  db
}