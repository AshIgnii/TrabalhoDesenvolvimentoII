const express = require('express');
const app = express();

const studentRoutes = require('./routes/studentsRoutes.js');
app.use('/student', studentRoutes);

const teacherRoutes = require('./routes/teachersRoutes.js');
app.use('/teacher', teacherRoutes);