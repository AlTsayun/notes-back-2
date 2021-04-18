module.exports = class MessageHandler{
    constructor(notesService){
        this.notesService = notesService
    }


    handle(message, connection){
        console.log('handling message', message)

        if (message.intention === 'get notes'){
            connection.send(JSON.stringify(this.notesService.getAllNotes(message.body)))
        } else if (message.intention === 'get note'){
            connection.send(JSON.stringify(this.notesService.getNoteById(message.body.id)))
        } else if (message.intention === 'add note'){
            connection.send(JSON.stringify(this.notesService.addNote(message.body)))
        } else if (message.intention === 'update note'){
            connection.send(JSON.stringify(this.notesService.updateNote(message.body)))
        } else if (message.intention === 'delete note'){
            connection.send(JSON.stringify(this.notesService.removeNote(message.body.id)))
        }
    }
}