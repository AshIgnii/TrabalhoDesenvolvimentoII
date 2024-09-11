const fs = require("fs");
const dbFolder = __dirname + "/db";
const modelsFolder = __dirname + "/models";
let modNames = [];
let models = new Map();

function initDB() {
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
  }
  fs.readdirSync(modelsFolder).forEach((file) => {
    modNames.push(`${file.split(".")[0]}`);
    models.set(file.split(".")[0], require(`${modelsFolder}/${file}`));
  });
  modNames.forEach((file) => {
    if (!fs.existsSync(`${dbFolder}/${file}.json`)) {
      fs.writeFileSync(`${dbFolder}/${file}.json`, "");
    }
  });
}

function getType(obj) {
  let type;
  models.forEach((model, key) => {
    if (obj instanceof model) {
      type = key;
    }
  });
  return type;
}

function addDB(obj) {
  let type = getType(obj);
  let file = fs.readFileSync(`${dbFolder}/${type}.json`, "utf8");
  data = file ? JSON.parse(file) : [];

  if (data.some((el) => JSON.stringify(el) === JSON.stringify(obj))) {
    console.warn("Tentativa de adicionar objeto duplicado, ignorando...");
    return;
  }

  data.push(obj);
  fs.writeFileSync(`${dbFolder}/${type}.json`, JSON.stringify(data));
}

function getDB(type) {
  let file = fs.readFileSync(`${dbFolder}/${type}.json`, "utf8");
  return file ? JSON.parse(file) : [];
}

module.exports = { initDB, addDB };
