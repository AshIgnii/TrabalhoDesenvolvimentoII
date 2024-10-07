const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Teacher = require("../models/teacher.js");
const emailRegex = new RegExp(
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
);
const phoneRegex = new RegExp("[a-z]|[A-Z]|\\s");
const numberRegex = new RegExp("^\\d+$");

router.get("/", (req, res) => {
  let args = req.query;
  if (args === undefined || Object.keys(args).length <= 0) {
    res.json(db.getDB("teacher"));
  } else {
    Object.keys(args).forEach((key, index) => {
      let value = args[key];
      if (numberRegex.test(value)) {
        args[key] = parseInt(value);
      }
    });

    let dummy = new Teacher();
    let keys = Object.getOwnPropertyNames(dummy);

    let commonKeys = keys.filter((el) => Object.keys(args).includes(el));
    if (commonKeys.length <= 0) {
      res.status(400).send("Argumentos inválidos");
      return;
    }

    let objs = db.getDB("teacher");
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
  let id = db.getDB("teacher").length + 1;
  let newTeacher = new Teacher(
    id,
    req.body.name,
    req.body.schoolDiscipline,
    req.body.contact,
    req.body.phoneNumber,
    req.body.status,
  );

  if (
    !req.body.name ||
    !req.body.schoolDiscipline ||
    !req.body.contact ||
    !req.body.phoneNumber
  ) {
    res
      .status(400)
      .send(
        "Preencha todos os campos obrigatórios (name, schoolDiscipline, contact, phoneNumber)",
      );
    return;
  }

  if (!emailRegex.test(newTeacher.contact)) {
    res.status(400).send("Contato inválido");
    return;
  }
  if (typeof req.body.phoneNumber === "number") {
    newTeacher.phoneNumber = req.body.phoneNumber;
  } else if (typeof req.body.phoneNumber === "string") {
    if (
      isNaN(
        parseInt(
          req.body.phoneNumber
            .split(phoneRegex)
            .reduce((el, acc) => (el += acc)),
        ),
      )
    ) {
      res
        .status(400)
        .send("Número de telefone inválido, utilize apenas números");
      return;
    }
  }
  if (newTeacher.status !== "on" && newTeacher.status !== "off") {
    newTeacher.status = "on";
  }

  let rs = db.addDB(newTeacher);
  if (rs !== true) {
    let original = db.getDB("teacher")[rs];
    newTeacher.id = original.id;
  }

  res.status(200).json(newTeacher);
});

router.put("/:id", (req, res) => {
  let teacher = db
    .getDB("teacher")
    .find((el) => el.id === parseInt(req.params.id));
  if (teacher) {
    let id = teacher.id;

    let newTeacher = new Teacher(
      id,
      teacher.name,
      teacher.schoolDiscipline,
      teacher.contact,
      teacher.phoneNumber,
      teacher.status,
    );
    if (req.body.name) {
      newTeacher.name = req.body.name;
    }
    if (req.body.schoolDiscipline) {
      newTeacher.schoolDiscipline = req.body.schoolDiscipline;
    }
    if (req.body.contact) {
      if (!emailRegex.test(newTeacher.contact)) {
        res.status(400).send("Contato inválido");
        return;
      }
      newTeacher.contact = req.body.contact;
    }
    if (req.body.phoneNumber) {
      if (
        isNaN(
          parseInt(
            req.body.phoneNumber
              .split(phoneRegex)
              .reduce((el, acc) => (el += acc)),
          ),
        )
      ) {
        res
          .status(400)
          .send("Número de telefone inválido, utilize apenas números");
        return;
      }
      newTeacher.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.status) {
      if (newTeacher.status !== "on" && newTeacher.status !== "off") {
        newTeacher.status = "on";
      }
      newTeacher.status = req.body.status;
    }
    db.removeDB("teacher", teacher);
    let rs = db.addDB(newTeacher);
    if (rs !== true) {
      let original = db.getDB("newTeacher")[rs];
      newTeacher.id = original.id;
    }

    res.status(200).json(newTeacher);
  } else {
    res.status(404).send("Professor não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  let teacher = db
    .getDB("teacher")
    .find((el) => el.id === parseInt(req.params.id));
  if (teacher) {
    db.removeDB("teacher", teacher);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Professor não encontrado");
  }
});

module.exports = router;
