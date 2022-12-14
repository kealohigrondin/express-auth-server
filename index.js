//run using command 'node index.js' from the /server folder
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
const config = require("./config");
const cors = require("cors");

//cors setup
const corsOptions = { origin: "http://localhost:3000" };

//DB setup
mongoose
  .connect(config.mongodbconnectionstring)
  .then(() => {
    const port = process.env.PORT || 3090; //use predefined port or 3090
    const server = http.createServer(app);
    server.listen(port);
    console.log("Server listening on:", port);
  })
  .catch((err) => {
    console.log(`ERROR" ${err}`);
  });

//App Setup (express setup)
//all incoming requests get passed thru these middlewares
app.use(morgan("combined")); //middleware, logging framework
app.use(bodyParser.json({ type: "*/*" })); //middleware
app.use(cors(corsOptions));
router(app);

//Server Setup (connecting express to outside world)
