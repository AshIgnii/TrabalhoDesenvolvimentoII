const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Event = require("../models/event.js");
const numberRegex = new RegExp("^\\d+$");
const phoneNumberRegex = new RegExp("^\\d{2}\\s\\d{4,5}\\s\\d{4}$");

router.get("/", (req, res) => {
  // #swagger.tags = ['events']
  /* #swagger.parameters['filtro'] = {
          in: "query",
          name: "Filtro de busca",
          required: false,
          type: "object",
          schema: {
            $ref: "#/components/schemas/event"
          },
          style: "form",
          explode: true
  }
  */
  let args = req.query;
  if (args === undefined || Object.keys(args).length <= 0) {
    res.json(db.getDB("event"));
  } else {
    Object.keys(args).forEach((key, index) => {
      let value = args[key];
      if (numberRegex.test(value)) {
        args[key] = parseInt(value);
      } else if (phoneNumberRegex.test(value)) {
        args[key] = parseInt(value.split(" ").reduce((el, acc) => (el += acc)));
      }
    });

    let dummy = new Event();
    let keys = Object.getOwnPropertyNames(dummy);

    let commonKeys = keys.filter((el) => Object.keys(args).includes(el));
    if (commonKeys.length <= 0) {
      res.status(400).send("Argumentos inválidos");
      return;
    }

    let objs = db.getDB("event");
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
  // #swagger.tags = ['events']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/event"
          }
        }
      }
    }
  */
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

router.put("/:id", (req, res) => {
  // #swagger.tags = ['events']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/event"
          }
        }
      }
    }
  */
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
    let rs = db.addDB(newEvent);
    if (rs !== true) {
      let original = db.getDB("newEvent")[rs];
      newEvent.id = original.id;
    }
    res.status(200).json(newEvent);
  } else {
    res.status(404).send("Evento não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  // #swagger.tags = ['events']
  let event = db.getDB("event").find((el) => el.id === parseInt(req.params.id));
  if (event) {
    db.removeDB("event", event);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Evento não encontrado");
  }
});

module.exports = router;
