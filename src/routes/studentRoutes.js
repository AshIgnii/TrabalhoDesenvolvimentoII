const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Student = require("../models/student.js");
const phoneRegex = new RegExp("[a-z]|[A-Z]|\\s");
const numberRegex = new RegExp("^\\d+$");
const phoneNumberRegex = new RegExp("^\\d{2}\\s\\d{4,5}\\s\\d{4}$");

router.get("/", (req, res) => {
  // #swagger.tags = ['students']
  /* #swagger.parameters['filtro'] = {
          in: "query",
          name: "Filtro de busca",
          required: false,
          type: "object",
          schema: {
            $ref: "#/components/schemas/student"
          },
          style: "form",
          explode: true
  }
  */
  let args = req.query;
  if (args === undefined || Object.keys(args).length <= 0) {
    res.json(db.getDB("student"));
  } else {
    Object.keys(args).forEach((key, index) => {
      let value = args[key];
      if (numberRegex.test(value)) {
        args[key] = parseInt(value);
      } else if (phoneNumberRegex.test(value)) {
        args[key] = parseInt(value.split(" ").reduce((el, acc) => (el += acc)));
      }
    });

    let dummy = new Student();
    let keys = Object.getOwnPropertyNames(dummy);

    let commonKeys = keys.filter((el) => Object.keys(args).includes(el));
    if (commonKeys.length <= 0) {
      res.status(400).send("Argumentos inválidos");
      return;
    }

    let objs = db.getDB("student");
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
  // #swagger.tags = ['students']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/student"
          }
        }
      }
    }
  */
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
      isNaN(
        parseInt(
          req.body.age.split(phoneRegex).reduce((el, acc) => (el += acc)),
        ),
      )
    ) {
      res.status(400).send("Idade inválida, utilize apenas números");
      return;
    }
  }

  if (typeof req.body.phoneNumber === "string") {
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
    } else if (phoneNumberRegex.test(req.body.phoneNumber)) {
      newStudent.phoneNumber = parseInt(
        req.body.phoneNumber.split(" ").reduce((el, acc) => (el += acc)),
      );
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

router.put("/:id", (req, res) => {
  // #swagger.tags = ['students']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/student"
          }
        }
      }
    }
  */
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
      if (typeof req.body.age === "string") {
        if (
          isNaN(
            parseInt(
              req.body.age.split(phoneRegex).reduce((el, acc) => (el += acc)),
            ),
          )
        ) {
          res.status(400).send("Idade inválida, utilize apenas números");
          return;
        }
        newStudent.age = req.body.age;
      } else if (typeof req.body.age === "number") {
        newStudent.age = req.body.age;
      }
    }
    if (req.body.parents) {
      newStudent.parents = req.body.parents;
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
      } else if (phoneNumberRegex.test(req.body.phoneNumber)) {
        newStudent.phoneNumber = parseInt(
          req.body.phoneNumber.split(" ").reduce((el, acc) => (el += acc)),
        );
      } else {
        newStudent.phoneNumber = req.body.phoneNumber;
      }
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
      let original = db.getDB("student")[rs];
      newStudent.id = original.id;
    }

    res.status(200).json(newStudent);
  } else {
    res.status(404).send("Aluno não encontrado");
  }
});

router.delete("/:id", (req, res) => {
  // #swagger.tags = ['students']
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
