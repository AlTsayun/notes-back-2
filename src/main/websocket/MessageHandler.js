module.exports = class MessageHandler{
    constructor(){}


    handle(message, connection){
        console.log(message, ' recieved')

        if (message.intention === 'get notes'){
            
        } else if (message.intention === 'get note'){

        } else if (message.intention === 'add note'){

        } else if (message.intention === 'update note'){

        }
    }
}