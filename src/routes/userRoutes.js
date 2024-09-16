const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const User = require("../models/user.js");
const emailRegex = new RegExp(
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
);

router.get("/", (req, res) => {
  res.json(db.getDB("user"));
});

router.post("/", (req, res) => {
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

  db.addDB(newUser);

  res.status(200).json(newUser);
});

router.get("/:id", (req, res) => {
  let user = db.getDB("user").find((el) => el.id === parseInt(req.params.id));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("Usuário não encontrado");
  }
});

router.put("/:id", (req, res) => {
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
    db.addDB(newUser);

    res.status(200).json(newUser);
  } else {
    res.status(404).send("Usuário não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  let user = db.getDB("user").find((el) => el.id === parseInt(req.params.id));
  if (user) {
    db.removeDB("user", user);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Usuário não encontrado");
  }
});

module.exports = router;
