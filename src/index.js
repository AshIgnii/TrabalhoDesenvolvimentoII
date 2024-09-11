const express = require('express');
const app = express();
const { initDB } = require('./functions');

initDB();
console.log('Banco de dados inicializado!');