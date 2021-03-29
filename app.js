const express = require("express");
const path = require("path");
const routes = require(path.resolve(__dirname, "src", "main", "rest", "apiv1", "routes.js"))
const app = express();
const port = 5000

app.use("/api", routes)
app.listen(process.env.PORT || port, () => console.log(`Server is running on port ${port}...`));
