module.exports = class NotesHandler{
    idToNote;
    freeIdentifier;
    constructor() {
        this.idToNote = new Map();
        this.freeIdentifier = 0;
    }
    addNote(note){
        note.id = this.freeIdentifier.toString()
        this.idToNote.set(note.id, note)
        this.freeIdentifier++
        console.log('NotesHandler added note', note)
        return note
    }

    removeNote(noteId){
        console.log('NotesHandler removed note', noteId)
        return this.idToNote.delete(noteId)
    }

    updateNote(note){
        console.log('NotesHandler updated note', note)
        if (this.idToNote.delete(note.id)){
            this.idToNote.set(note.id, note)
            return true
        }
        return false
    }

    getNoteById(noteId){
        return this.idToNote.get(noteId)
    }
    getAllNotes(){
        return this.idToNote.values();
    }


}