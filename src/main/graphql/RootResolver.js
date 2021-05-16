
// The root provides a resolver function for each API endpoint
module.exports =
    class RootResolverImpl {
        constructor(notesService) {
            this.notesService = notesService
        }

        root = {
            getNotes: (args) => {
                console.log('getNotes recieved args:', args)
                let notes = this.notesService.getAllNotes(args)
                console.log('getNotes responses:', notes)
              return notes
            },
            getNote: (args) => {
                console.log('getNote recieved args:', args)
                let note = this.notesService.getNoteById(args.id)
                console.log('getNote responses:', note)
              return note
            },
            addNote: (args) => {
                console.log('addNote recieved args:', args)
                let note = this.notesService.addNote()
                console.log('addNote responses:', note)
              return note
            },
            updateNote: (args) => {
                console.log('updateNote recieved args:', args)
                let updateResult = this.notesService.updateNote(args)
                console.log('updateNote responses:', updateResult)
              return updateResult
            },
            deleteNote: (args) => {
                console.log('deleteNote recieved args:', args)
                let deleteResult = this.notesService.removeNote(args.id)
                console.log('deleteNote responses:', deleteResult)
              return deleteResult
            }
          }
    }