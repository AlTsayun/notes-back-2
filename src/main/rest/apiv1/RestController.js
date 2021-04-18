
const path = require("path")
const fs = require('fs')
const multer = require('multer')

module.exports = class RestController {
    constructor(notesService, auth, accountsHandler){
        const bodyParser = require('body-parser')
        const urlEncodedParser = bodyParser.urlencoded({extended: false})
        const jsonBodyParser = bodyParser.json()

        const router = require("express").Router()

        router.use(multer({dest: path.resolve("uploads")}).any());


        router.get('/notes',
            auth.verifyTokenInCookie.bind(auth),
            (req, res) => {
            let notes = Array.from(notesService.getAllNotes({statusFilter: req.query.statusFilter}))
            res.json(notes)
        })

        router.get('/about', (req, res) => {
            res.json({aboutText: "this is about text"})
        })

        router.post('/notes',
            auth.verifyTokenInCookie.bind(auth),
            (req, res) => {

            console.log('post body: ', req.body)

            let note = notesService.addNote()
            res.status(201).json(note)
        })

        router.get('/notes/:noteId', (req, res) => {
            let note = notesService.getNoteById(req.params.noteId)
            if (note !== undefined) {
                res.status(200).json(note)
            } else {
                res.status(404).send()
            }
        })

        router.put('/notes/:noteId', urlEncodedParser, (req, res) => {

            let oldNote = notesService.getNoteById(req.params.noteId)
            let newFiles = oldNote.files.concat(req.files)
            console.log('Put body', req.body)
            console.log('req.files', req.files)
            let note = {
                id: req.params.noteId,
                title: req.body.title,
                status: req.body.status,
                completionDate: req.body.completionDate,
                text: req.body.text,
                files: newFiles,
            }
            notesService.updateNote(note)
            res.status(201).json(note)
        })

        router.delete('/notes/:noteId', (req, res) => {
            let note = notesService.getNoteById(req.params.noteId)
            if (note !== undefined) {
                for (let file of note.files) {
                    fs.unlink(file.path, (err) => {
                        if (err) throw err;
                        console.log(`File ${file.path} was deleted`);
                    })
                }
                notesService.removeNote(req.params.noteId)
                res.status(204).send()
            } else {
                res.status(404).send()
            }
        })

        router.get('/notes/:noteId/attachments/files/:filename', (req, res) => {
            let note = notesService.getNoteById(req.params.noteId)
            if (note !== undefined) {
                let file = note.files.find((file) => {
                    return file.filename === req.params.filename
                })
                if (file !== undefined) {
                    res.status(200).download(file.path, file.originalname)
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(404).send()
            }
        })

        router.delete('/notes/:noteId/attachments/files/:filename', (req, res) => {
            let note = notesService.getNoteById(req.params.noteId)
            if (note !== undefined) {
                let file = note.files.find((file) => {
                    return file.filename === req.params.filename
                })
                if (file !== undefined) {
                    fs.unlink(file.path, (err) => {
                        if (err) throw err;
                        console.log(`File ${file.path} was deleted`);
                    });
                    note.files = note.files.filter((file) => {
                        return file.filename !== req.params.filename
                    })
                    res.status(204).send()
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(404).send()
            }
        })

        router.post('/login', jsonBodyParser, (req, res) => {
            console.log('Post body', req.body)
            const user = accountsHandler.getUserByUsername(req.body.username)
            if (user !== undefined){
                auth.sign({user}, (err, token) => {
                    console.log('created token', token)
                    res.cookie('token', token, {  
                        maxAge: 30000000,
                        httpOnly: true
                    })
                    res.status(204).send()
                })
            } else {
                console.log('Incorrect credentials while login')
                res.status(401).send()
            }
        })

        router.post('/signup', jsonBodyParser, (req, res) => {
            console.log('Post body', req.body)
            const user = {
                username: req.body.username,
                password: req.body.password
            }
            accountsHandler.addUser(user)
            res.status(201).json(accountsHandler.getUserByUsername(req.body.username)).send()
        })
        this.router = router
    }

    getRouter(){
        return this.router
    }
}