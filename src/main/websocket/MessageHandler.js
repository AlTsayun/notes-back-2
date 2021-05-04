module.exports = class MessageHandler {
    constructor(notesService) {
        this.notesService = notesService
    }


    handle(message, connection) {
        console.log('Handling ws message', message)

        if (message.intention === 'get notes') {
            this.__send(connection, JSON.stringify({ 
                intention: "notes", 
                body: this.notesService.getAllNotes(message.body) 
            }))
        } else if (message.intention === 'get note') {
            this.__send(connection, JSON.stringify({ 
                intention: "note", 
                body: this.notesService.getNoteById(message.body.id) 
            }))
        } else if (message.intention === 'add note') {
            this.__send(connection, JSON.stringify({
                intention: 'added note',
                body: this.notesService.addNote(message.body)
            }))
        } else if (message.intention === 'update note') {
            this.__send(connection, JSON.stringify(this.notesService.updateNote(message.body)))
        } else if (message.intention === 'delete note') {
            this.notesService.removeNote(message.body.id)
            this.__send(connection, JSON.stringify({
                intention: "notes updated",
                body: {}
            }))
        }
    }

    __send(connection, message) {
        console.log('Message sent:', message)
        connection.send(message)
    }
}