module.exports = class NotesService{

    constructor(notesRepo) {
        this.notesRepo = notesRepo
    }
    addNote(){
        return this.notesRepo.addNote()
    }

    removeNote(noteId){
        return this.notesRepo.removeNote(noteId)
    }

    updateNote(note){
        return this.notesRepo.updateNote(note)
    }

    getNoteById(noteId){
        return this.notesRepo.getNoteById(noteId)
    }

    getAllNotes(params){
        return this.notesRepo.getAllNotes(params)
    }


}