const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Student = require("../models/student.js");

router.get("/", (req, res) => {
  res.json(db.getDB("student"));
});

router.post("/", (req, res) => {
  let id = db.getDB("student").length + 1;
  let newStudent = new Student(
    id,
    req.body.name,
    req.body.age,
    req.body.parents,
    req.body.phoneNumber,
    req.body.specialNeeds,
    req.body.status,
  );

  if (
    !req.body.name ||
    !req.body.age ||
    !req.body.parents ||
    !req.body.phoneNumber ||
    !req.body.specialNeeds
  ) {
    res
      .status(400)
      .send(
        "Preencha todos os campos obrigatórios (name, age, parents, phoneNumber, specialNeeds)",
      );
    return;
  }

  if (typeof req.body.age === "string") {
    if (
      isNaN(parseInt(req.body.age.split(" ").reduce((el, acc) => (el += acc))))
    ) {
      res.status(400).send("Idade inválida, utilize apenas números");
      return;
    }
  }

  if (typeof req.body.phoneNumber === "string") {
    if (
      isNaN(
        parseInt(
          req.body.phoneNumber.split(" ").reduce((el, acc) => (el += acc)),
        ),
      )
    ) {
      res
        .status(400)
        .send("Número de telefone inválido, utilize apenas números");
      return;
    }
  }

  if (newStudent.status !== "on" && newStudent.status !== "off") {
    newStudent.status = "on";
  }

  let rs = db.addDB(newStudent);
  if (rs !== true) {
    let original = db.getDB("student")[rs];
    newStudent.id = original.id;
  }

  res.status(200).json(newStudent);
});

router.get("/:id", (req, res) => {
  let student = db
    .getDB("student")
    .find((el) => el.id === parseInt(req.params.id));
  if (student) {
    res.status(200).json(student);
  } else {
    res.status(404).send("Aluno não encontrado");
  }
});

router.put("/:id", (req, res) => {
  let student = db
    .getDB("student")
    .find((el) => el.id === parseInt(req.params.id));
  if (student) {
    let id = student.id;

    let newStudent = new Student(
      id,
      student.name,
      student.age,
      student.parents,
      student.phoneNumber,
      student.specialNeeds,
      student.status,
    );

    if (req.body.name) {
      newStudent.name = req.body.name;
    }
    if (req.body.age) {
      if (
        isNaN(
          parseInt(req.body.age.split(" ").reduce((el, acc) => (el += acc))),
        )
      ) {
        res.status(400).send("Idade inválida, utilize apenas números");
        return;
      }
      newStudent.age = req.body.age;
    }
    if (req.body.parents) {
      newStudent.parents = req.body.parents;
    }
    if (req.body.phoneNumber) {
      if (
        isNaN(
          parseInt(
            req.body.phoneNumber.split(" ").reduce((el, acc) => (el += acc)),
          ),
        )
      ) {
        res
          .status(400)
          .send("Número de telefone inválido, utilize apenas números");
        return;
      }
      newStudent.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.specialNeeds) {
      newStudent.specialNeeds = req.body.specialNeeds;
    }
    if (req.body.status) {
      if (req.body.status === "") {
        newStudent.status = "on";
      } else if (req.body.status !== "on" && req.body.status !== "off") {
        res.status(400).send("Status inválido");
        return;
      }
      newStudent.status = req.body.status;
    }

    db.removeDB("student", student);
    let rs = db.addDB(newStudent);
    if (rs !== true) {
      let original = db.getDB("newStudent")[rs];
      newStudent.id = original.id;
    }

    res.status(200).json(newStudent);
  } else {
    res.status(404).send("Aluno não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  let student = db
    .getDB("student")
    .find((el) => el.id === parseInt(req.params.id));
  if (student) {
    db.removeDB("student", student);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Aluno não encontrado");
  }
});

module.exports = router;
