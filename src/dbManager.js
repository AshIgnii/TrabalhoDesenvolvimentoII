class dbManager {
  constructor() {
    this.fs = require("fs");
    this.dbFolder = __dirname + "/db";
    this.modelsFolder = __dirname + "/models";
    this.modNames = [];
    this.models = new Map();

    if (!this.fs.existsSync(this.dbFolder)) {
      this.fs.mkdirSync(this.dbFolder);
    }
    this.fs.readdirSync(this.modelsFolder).forEach((file) => {
      this.modNames.push(`${file.split(".")[0]}`);
      this.models.set(
        file.split(".")[0],
        require(`${this.modelsFolder}/${file}`),
      );
    });
    this.modNames.forEach((file) => {
      if (!this.fs.existsSync(`${this.dbFolder}/${file}.json`)) {
        this.fs.writeFileSync(`${this.dbFolder}/${file}.json`, "");
      }
    });
  }

  getType(obj) {
    let type;
    this.models.forEach((model, key) => {
      if (obj instanceof model) {
        type = key;
      }
    });
    return type;
  }

  addDB(obj) {
    let type = this.getType(obj);
    let file = this.fs.readFileSync(`${this.dbFolder}/${type}.json`, "utf8");
    let data = file ? JSON.parse(file) : [];

    if (data.some((el) => JSON.stringify(el) === JSON.stringify(obj))) {
      console.warn("Tentativa de adicionar objeto duplicado, ignorando...");
      return false;
    }

    data.push(obj);
    this.fs.writeFileSync(
      `${this.dbFolder}/${type}.json`,
      JSON.stringify(data),
    );
    return true;
  }

  getDB(type) {
    let file = this.fs.readFileSync(`${this.dbFolder}/${type}.json`, "utf8");
    return file ? JSON.parse(file) : [];
  }

  removeDB(type, obj) {
    let file = this.fs.readFileSync(`${this.dbFolder}/${type}.json`, "utf8");
    let data = file ? JSON.parse(file) : [];

    data = data.filter((el) => JSON.stringify(el) !== JSON.stringify(obj));
    this.fs.writeFileSync(
      `${this.dbFolder}/${type}.json`,
      JSON.stringify(data),
    );
  }
}

module.exports = dbManager;
