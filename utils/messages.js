const moment = require('moment');
moment.locale('Fr');

//formatting the message using moment.js
function formatMessage(username, text, date){
    return {
        text,
        date: moment().format('LT', date),
        username 
    }
}

//exporting the function as a module
module.exports = { 
    formatMessage 
};