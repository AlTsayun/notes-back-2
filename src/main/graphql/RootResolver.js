
// The root provides a resolver function for each API endpoint
module.exports =
    class RootResolverImpl {
        constructor(notesService) {
            this.notesService = notesService
        }

        root = {
            getNotes: (params) => {
                console.log('getNotes recieved params:', params)
                let notes = this.notesService.getAllNotes(params)
                console.log('getNotes responses:', notes)
              return JSON.stringify(notes)
            },
            getNote: (params) => {
                console.log('getNote recieved params:', params)
                let note = this.notesService.getNoteById(params.id)
                console.log('getNote responses:', note)
              return JSON.stringify(note)
            },
            addNote: (params) => {
                console.log('addNote recieved params:', params)
                let note = this.notesService.addNote()
                console.log('addNote responses:', note)
              return JSON.stringify(note)
            },
            updateNote: (params) => {
                console.log('updateNote recieved params:', params)
                let updateResult = this.notesService.updateNote(params)
                console.log('updateNote responses:', updateResult)
              return JSON.stringify(updateResult)
            },
            deleteNote: (params) => {
                console.log('deleteNote recieved params:', params)
                let deleteResult = this.notesService.removeNote(params.id)
                console.log('deleteNote responses:', deleteResult)
              return JSON.stringify(deleteResult)
            }
          }
    }