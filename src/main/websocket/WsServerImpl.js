const path = require("path")
const IdGenerator = require(path.resolve("src", "main", "infra", "IdGenerator.js"))

module.exports = class WsServerImpl{

    constructor(messageHandler){
        this.messageHandler = messageHandler
        this.httpServer = require('http').createServer()
        this.idGenerator = new IdGenerator()
        this.clients = {}
    }

    listen(port){
        this.port = port
        const WebSocketServer = require('websocket').server
        this.httpServer.listen(port)
        this.wsServer = new WebSocketServer({ httpServer: this.httpServer })
        this.wsServer.on('request', (request) => this.onRequest(request))
        console.log(`Websocket server is running on port ${port}...`)
    }

    onRequest(request){
        const userID = this.idGenerator.getUniqueId()
        console.log((new Date()) + ' Recieved a new request from origin ' + request.origin + '.')
        
        //TODO: rewrite this part of the code to accept only the requests from allowed origin
        const connection = request.accept(null, request.origin)
        connection.on('message', (message) => this.onMessage(message, connection))
        connection.on('close', (connection) => this.onCloseConnection(connection, userID))

        connection.userID = userID
        this.clients[userID] = connection
        console.log('connected: ' + userID + ' in ' + this.clients)
    }

    onMessage(message, connection){
        console.log('Received Message: ', message)
        if (message.type === 'utf8') {
            this.messageHandler.handle(JSON.parse(message.utf8Data), connection)
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes')
            // connection.sendBytes(message.binaryData)
        }
    }

    onCloseConnection(connection, userID){
        console.log((new Date()) + " Peer " + userID + " disconnected.")
        delete this.clients[userID]
    }

}