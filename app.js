
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

// Web socket

const MessageHandler = require(path.resolve("src", "main", "websocket", "MessageHandler.js"))
const WsServerImpl = require(path.resolve("src", "main", "websocket", "WsServerImpl.js"))

const webSocketsServerPort = 8000
const wsMessageHandler = new MessageHandler(notesService)
const wsServerImpl = new WsServerImpl(wsMessageHandler)
wsServerImpl.listen(webSocketsServerPort)

// GraphQL

const graphqlBuildSchema = require(path.resolve("src", "main", "graphql", "BuildSchemaImpl.js"))
const RootResolver = require(path.resolve("src", "main", "graphql", "RootResolver.js"))
const rootResolver = new RootResolver(notesService)
var { graphqlHTTP } = require('express-graphql')


const graphQlServer = express()

graphQlServer.use(cors())

graphQlServer.use('/graphql', graphqlHTTP({
  schema: graphqlBuildSchema,
  rootValue: rootResolver.root,
  graphiql: true,
}))

graphQlServer.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')