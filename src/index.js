const express = require("express");
const fs = require("fs");
const app = express();
const event = require(__dirname + "/models/student.js");
const dbManager = require(__dirname + "/dbManager.js");

app.use(express.json());

const routeFiles = fs.readdirSync(__dirname + "/routes");
routeFiles.forEach((file) => {
  let reqFile = require(__dirname + `/routes/${file}`);
  let route = "/" + file.split(".")[0].split("Routes")[0] + "s";
  app.use(route, reqFile);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
