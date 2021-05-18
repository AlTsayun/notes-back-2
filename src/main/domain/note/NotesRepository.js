module.exports = class NotesRepository{
    idToNote;
    freeIdentifier;
    constructor() {
        this.idToNote = new Map();
        this.freeIdentifier = 0;
    }
    addNote(){

        const o_date = new Intl.DateTimeFormat;
        const f_date = (m_ca, m_it) => Object({...m_ca, [m_it.type]: m_it.value});
        const m_date = o_date.formatToParts().reduce(f_date, {});
        const formattedDate = `${m_date.year}-${m_date.month}-${m_date.day}`;
    
        let note = {
            title: "",
            status: "to do",
            completionDate: formattedDate,
            text: "",
            files: [],
        }

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
    getAllNotes(params){
        let notes = Array.from(this.idToNote.values())

        if (params.statusFilter === "to do") {
            notes = notes.filter((note) => note.status === "to do")
        } else if (params.statusFilter === "in progress") {
            notes = notes.filter((note) => note.status === "in progress")
        } else if (params.statusFilter === "done") {
            notes = notes.filter((note) => note.status === "done")
        }

        if (params.completionDateOrder === "newest"){
            notes.sort((a, b) => a.completionDate > b.completionDate && -1 || 1)
        } else if (params.completionDateOrder === "oldest"){
            notes.sort((a, b) => a.completionDate < b.completionDate && -1 || 1)
        }

        return notes
    }


}