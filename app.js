
// Rest

const express = require("express");
const path = require("path");
const routes = require(path.resolve("src", "main", "rest", "apiv1", "routes.js"))
const app = express();
const port = 5000

const cors = require('cors');
app.use(cors());

const cookieParser = require('cookie-parser');
const MessageHandler = require(path.resolve("src", "main", "websocket", "MessageHandler.js"));
const WsServerImpl = require(path.resolve("src", "main", "websocket", "WsServerImpl.js"));
app.use(cookieParser())

app.use("/api", routes)
app.listen(process.env.PORT || port, () => console.log(`Server is running on port ${port}...`));



const webSocketsServerPort = 8000
const wsMessageHandler = new MessageHandler()
const wsServerImpl = new WsServerImpl(wsMessageHandler)
wsServerImpl.listen(webSocketsServerPort)