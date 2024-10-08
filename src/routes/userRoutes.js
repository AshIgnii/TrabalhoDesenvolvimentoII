const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const User = require("../models/user.js");
const emailRegex = new RegExp(
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
);
const numberRegex = new RegExp("^\\d+$");
const phoneNumberRegex = new RegExp("^\\d{2}\\s\\d{4,5}\\s\\d{4}$");

router.get("/", (req, res) => {
  // #swagger.tags = ['users']
  /* #swagger.parameters['filtro'] = {
          in: "query",
          name: "Filtro de busca",
          required: false,
          type: "object",
          schema: {
            $ref: "#/components/schemas/user"
          },
          style: "form",
          explode: true
  }
  */
  let args = req.query;
  if (args === undefined || Object.keys(args).length <= 0) {
    res.json(db.getDB("user"));
  } else {
    Object.keys(args).forEach((key, index) => {
      let value = args[key];
      if (numberRegex.test(value)) {
        args[key] = parseInt(value);
      } else if (phoneNumberRegex.test(value)) {
        args[key] = parseInt(value.split(" ").reduce((el, acc) => (el += acc)));
      }
    });

    let dummy = new User();
    let keys = Object.getOwnPropertyNames(dummy);

    let commonKeys = keys.filter((el) => Object.keys(args).includes(el));
    if (commonKeys.length <= 0) {
      res.status(400).send("Argumentos inválidos");
      return;
    }

    let objs = db.getDB("user");
    let rs = objs.filter((el) => {
      let flag = true;
      commonKeys.forEach((key) => {
        if (el[key] !== args[key]) {
          flag = false;
        }
      });
      return flag;
    });

    if (rs.length <= 0) {
      res.status(404).send("Nenhum resultado encontrado");
      return;
    }

    res.json(rs);
  }
});

router.post("/", (req, res) => {
  // #swagger.tags = ['users']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/user"
          }
        }
      }
    }
  */
  let id = db.getDB("user").length + 1;
  let newUser = new User(
    id,
    req.body.name,
    req.body.email,
    req.body.user,
    req.body.pwd,
    req.body.level,
    req.body.status,
  );

  if (!req.body.name || !req.body.email || !req.body.user || !req.body.pwd) {
    res
      .status(400)
      .send("Preencha todos os campos obrigatórios (name, email, user, pwd)");
    return;
  }

  if (!emailRegex.test(newUser.email)) {
    res.status(400).send("Email inválido");
    return;
  }
  if (newUser.level === "") {
    newUser.level = "user";
  } else if (newUser.level !== "admin" && newUser.level !== "user") {
    res.status(400).send("Nível inválido");
    return;
  }
  if (newUser.status !== "on" && newUser.status !== "off") {
    newUser.status = "on";
  }

  let rs = db.addDB(newUser);
  if (rs !== true) {
    let original = db.getDB("user")[rs];
    newUser.id = original.id;
  }

  res.status(200).json(newUser);
});

router.put("/:id", (req, res) => {
  // #swagger.tags = ['users']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/user"
          }
        }
      }
    }
  */
  let user = db.getDB("user").find((el) => el.id === parseInt(req.params.id));
  if (user) {
    let id = user.id;

    let newUser = new User(
      id,
      user.name,
      user.email,
      user.user,
      user.pwd,
      user.level,
      user.status,
    );

    if (req.body.name) {
      newUser.name = req.body.name;
    }
    if (req.body.email) {
      if (!emailRegex.test(req.body.email)) {
        res.status(400).send("Email inválido");
        return;
      }
      newUser.email = req.body.email;
    }
    if (req.body.user) {
      newUser.user = req.body.user;
    }
    if (req.body.pwd) {
      newUser.pwd = req.body.pwd;
    }
    if (req.body.level) {
      if (req.body.level === "" || !req.body.level) {
        newUser.level = "user";
      } else if (req.body.level !== "admin" && req.body.level !== "user") {
        res.status(400).send("Nível inválido");
        return;
      }
      newUser.level = req.body.level;
    }
    if (req.body.status) {
      if (req.body.status === "") {
        newUser.status = "on";
      } else if (req.body.status !== "on" && req.body.status !== "off") {
        res.status(400).send("Status inválido");
        return;
      }
      newUser.status = req.body.status;
    }

    db.removeDB("user", user);
    let rs = db.addDB(newUser);
    if (rs !== true) {
      let original = db.getDB("newUser")[rs];
      newUser.id = original.id;
    }

    res.status(200).json(newUser);
  } else {
    res.status(404).send("Usuário não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  // #swagger.tags = ['users']
  let user = db.getDB("user").find((el) => el.id === parseInt(req.params.id));
  if (user) {
    db.removeDB("user", user);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Usuário não encontrado");
  }
});

module.exports = router;
