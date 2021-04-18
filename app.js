
// Common

const path = require("path")
const NotesRepo = require(path.resolve("src", "main", "domain", "note", "NotesRepository.js"))
const notesRepo = new NotesRepo()
const NotesService = require(path.resolve("src", "main", "domain", "note", "NotesService.js"))
const notesService = new NotesService(notesRepo)

const Auth = require(path.resolve("src", "main", "domain", "auth", "service", "Auth.js"))
const auth = new Auth('secret123')

const AccountsHandler = require(path.resolve("src", "main", "domain", "account", "AccountsHandler.js"))
const accountsHandler = new AccountsHandler()

// Rest

const RestController = require(path.resolve("src", "main", "rest", "apiv1", "RestController.js"))
const restController = new RestController(notesService, auth, accountsHandler)

const restPort = 5000

const express = require("express")
const restApp = express()

const cors = require('cors')
restApp.use(cors())

const cookieParser = require('cookie-parser')
restApp.use(cookieParser())

restApp.use("/api", restController.getRouter())

restApp.listen(process.env.PORT || restPort, () => console.log(`Rest server is running on port ${restPort}...`))
