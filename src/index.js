const express = require('express');
const app = express();
const { initDB } = require('./functions');

initDB();
