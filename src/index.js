const express = require("express");
const app = express();
const event = require("./models/student.js");
const { initDB, addDB } = require("./functions");

initDB();

let cu = new event();
addDB(cu);
