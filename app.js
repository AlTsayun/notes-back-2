// Common

const path = require("path")
const NotesRepo = require(path.resolve("src", "main", "domain", "note", "NotesRepository.js"))
const notesRepo = new NotesRepo()
const NotesService = require(path.resolve("src", "main", "domain", "note", "NotesService.js"))
const notesService = new NotesService(notesRepo)

// Rest

const express = require("express");
const routes = require(path.resolve("src", "main", "rest", "apiv1", "routes.js"))
const app = express();
const port = 5000

const cors = require('cors');
app.use(cors());

const cookieParser = require('cookie-parser');

app.use(cookieParser())

app.use("/api", routes)
app.listen(process.env.PORT || port, () => console.log(`Server is running on port ${port}...`));


// Web socket

const MessageHandler = require(path.resolve("src", "main", "websocket", "MessageHandler.js"))
const WsServerImpl = require(path.resolve("src", "main", "websocket", "WsServerImpl.js"))

const webSocketsServerPort = 8000
const wsMessageHandler = new MessageHandler(notesService)
const wsServerImpl = new WsServerImpl(wsMessageHandler)
wsServerImpl.listen(webSocketsServerPort)