// import {Auth} from "../auth/auth";


const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({extended: false})
const jsonBodyParser = bodyParser.json()
const fs = require('fs')
const multer = require('multer')

const Auth = require(path.resolve("src", "main", "domain", "auth", "service", "Auth.js"))
let auth = new Auth()

const NotesHandler = require(path.resolve("src", "main", "domain", "note", "NotesHandler.js"))
let notesHandler = new NotesHandler()
const AccountsHandler = require(path.resolve("src", "main", "domain", "account", "AccountsHandler.js"))
let accountsHandler = new AccountsHandler()

const routes = express.Router()

// import cors from 'cors';
// const server = express();

// Set multer
routes.use(multer({dest: path.resolve("uploads")}).any());

routes.get('/notes',
    // (req, res, next) => {
    // auth.verifyTokenMiddleware(req, res, next)
// },
    (req, res) => {
    let notes = Array.from(notesHandler.getAllNotes())

    if (req.query.statusFilter === "to do") {
        notes = notes.filter((note) => note.status === "to do")
    } else if (req.query.statusFilter === "in progress") {
        notes = notes.filter((note) => note.status === "in progress")
    } else if (req.query.statusFilter === "done") {
        notes = notes.filter((note) => note.status === "done")
    }

    res.json(notes)
})

routes.get('/about', (req, res) => {
    res.json({aboutText: "this is about text"})
})

routes.post('/notes', (req, res) => {

    console.log('post body: ', req.body)

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

    note = notesHandler.addNote(note)
    res.status(201).json(note)
})

routes.get('/notes/:noteId', (req, res) => {
    let note = notesHandler.getNoteById(req.params.noteId)
    if (note !== undefined) {
        res.status(200).json(note)
    } else {
        res.status(404).send()
    }
})

routes.put('/notes/:noteId', urlEncodedParser, (req, res) => {

    let oldNote = notesHandler.getNoteById(req.params.noteId)
    let newFiles = oldNote.files.concat(req.files)
    console.log('Put body', req.body)
    let note = {
        id: req.params.noteId,
        title: req.body.title,
        status: req.body.status,
        completionDate: req.body.completionDate,
        text: req.body.text,
        files: newFiles,
    }
    notesHandler.updateNote(note)
    res.status(201).json(note)
})

routes.delete('/notes/:noteId', urlEncodedParser, (req, res) => {
    let note = notesHandler.getNoteById(req.params.noteId)
    if (note !== undefined) {
        for (let file of note.files) {
            fs.unlink(file.path, (err) => {
                if (err) throw err;
                console.log(`File ${file.path} was deleted`);
            })
        }
        notesHandler.removeNote(req.params.noteId)
        res.status(200).send()
    } else {
        res.status(404).send()
    }
})

routes.get('/notes/:noteId/attachments/files/:filename', (req, res) => {
    let note = notesHandler.getNoteById(req.params.noteId)
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

routes.delete('/notes/:noteId/attachments/files/:filename', urlEncodedParser, (req, res) => {
    let note = notesHandler.getNoteById(req.params.noteId)
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
            res.status(200).send()
        } else {
            res.status(404).send()
        }
    } else {
        res.status(404).send()
    }
})

routes.post('/login', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        salt: req.body.salt
    }
    accountsHandler.getUserByUsername(req.body.username)
    auth.sign({user}, (err, token) => {
        res.json({
            token
        })
    })



})

routes.post('/signup', jsonBodyParser, (req, res) => {
    console.log(req.body)
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    accountsHandler.addUser(user)
    res.status(201).json(accountsHandler.getUserByUsername(req.body.username))
})
module.exports = routes