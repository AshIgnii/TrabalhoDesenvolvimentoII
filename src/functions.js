const fs = require('fs');
const dbFolder = './src/db';

function initDB() {
    const dbFiles = ['users.json', 'students.json', 'teachers.json', 'appointments.json', 'professionals.json', 'events.json'];
    dbFiles.forEach((file) => {
        if (!fs.existsSync(`${dbFolder}/${file}`)) {
            fs.writeFileSync(`${dbFolder}/${file}`, '');
        }
    });
}

module.exports = { initDB };