const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Event = require("../models/event.js");

router.get("/", (req, res) => {
  res.json(db.getDB("event"));
});

router.post("/", (req, res) => {
  let id = db.getDB("event").length + 1;
  let newEvent = new Event(
    id,
    req.body.description,
    req.body.comments,
    req.body.date,
  );

  if (!req.body.date || !req.body.description) {
    res
      .status(400)
      .send("Preencha todos os campos obrigatórios (date, description)");
    return;
  }

  if (req.body.comments) {
    if (typeof req.body.comments !== "string") {
      res.status(400).send("Comentário inválido, utilize apenas string");
      return;
    }
  }

  if (typeof req.body.description !== "string") {
    res.status(400).send("Descrição inválida, utilize apenas string");
    return;
  }

  if (isNaN(new Date(newEvent.date))) {
    res.status(400).send("Data inválida");
    return;
  }

  let rs = db.addDB(newEvent);
  if (rs !== true) {
    let original = db.getDB("event")[rs];
    newEvent.id = original.id;
  }
  res.status(200).json(newEvent);
});

router.get("/:id", (req, res) => {
  let event = db.getDB("event").find((el) => el.id === parseInt(req.params.id));
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404).send("Evento não encontrado");
  }
});

router.put("/:id", (req, res) => {
  let event = db.getDB("event").find((el) => el.id === parseInt(req.params.id));
  if (event) {
    let id = event.id;

    let newEvent = new Event(id, event.description, event.comments, event.date);

    if (req.body.description) {
      if (typeof req.body.description !== "string") {
        res.status(400).send("Descrição inválida, utilize apenas string");
        return;
      }
      newEvent.description = req.body.description;
    }

    if (req.body.comments) {
      if (typeof req.body.comments !== "string") {
        res.status(400).send("Comentário inválido, utilize apenas string");
        return;
      }
      newEvent.comments = req.body.comments;
    }

    if (req.body.date) {
      if (isNaN(new Date(req.body.date))) {
        res.status(400).send("Data inválida");
        return;
      }
      newEvent.date = req.body.date;
    }

    db.removeDB("event", event);
    db.addDB(newEvent);
    res.status(200).json(newEvent);
  } else {
    res.status(404).send("Evento não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  let event = db.getDB("event").find((el) => el.id === parseInt(req.params.id));
  if (event) {
    db.removeDB("event", event);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Evento não encontrado");
  }
});

module.exports = router;
