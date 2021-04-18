module.exports = class MessageHandler{
    constructor(notesService){
        this.notesService = notesService
    }


    handle(message, connection){
        console.log('handling message', message)

        if (message.intention === 'get notes'){
            connection.send(this.notesService.getAllNotes(message.body))
        } else if (message.intention === 'get note'){

        } else if (message.intention === 'add note'){

        } else if (message.intention === 'update note'){

        }
    }
}