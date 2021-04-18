// import {Auth} from "../auth/auth";


const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({extended: false})
const jsonBodyParser = bodyParser.json()
const fs = require('fs')
const multer = require('multer')

const Auth = require(path.resolve("src", "main", "domain", "auth", "service", "Auth.js"))
let auth = new Auth('secret123')


const NotesRepo = require(path.resolve("src", "main", "domain", "note", "NotesRepository.js"))
let notesRepo= new NotesRepo()
const NotesService = require(path.resolve("src", "main", "domain", "note", "NotesService.js"))
let notesService = new NotesService(notesRepo)

const AccountsHandler = require(path.resolve("src", "main", "domain", "account", "AccountsHandler.js"))
let accountsHandler = new AccountsHandler()

const routes = express.Router()

// Set multer
routes.use(multer({dest: path.resolve("uploads")}).any());


routes.get('/notes',
    auth.verifyTokenInCookie.bind(auth),
    (req, res) => {
    let notes = Array.from(notesService.getAllNotes({statusFilter: req.query.statusFilter}))
    res.json(notes)
})

routes.get('/about', (req, res) => {
    res.json({aboutText: "this is about text"})
})

routes.post('/notes',
    auth.verifyTokenInCookie.bind(auth),
    (req, res) => {

    console.log('post body: ', req.body)

    note = notesService.addNote()
    res.status(201).json(note)
})

routes.get('/notes/:noteId', (req, res) => {
    let note = notesService.getNoteById(req.params.noteId)
    if (note !== undefined) {
        res.status(200).json(note)
    } else {
        res.status(404).send()
    }
})

routes.put('/notes/:noteId', urlEncodedParser, (req, res) => {

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

routes.delete('/notes/:noteId', (req, res) => {
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

routes.get('/notes/:noteId/attachments/files/:filename', (req, res) => {
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

routes.delete('/notes/:noteId/attachments/files/:filename', (req, res) => {
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

routes.post('/login', jsonBodyParser, (req, res) => {
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

routes.post('/signup', jsonBodyParser, (req, res) => {
    console.log('Post body', req.body)
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    accountsHandler.addUser(user)
    res.status(201).json(accountsHandler.getUserByUsername(req.body.username)).send()
})
module.exports = routes