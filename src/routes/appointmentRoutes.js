const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Appointment = require("../models/appointment.js");
const numberRegex = new RegExp("^\\d+$");
const phoneNumberRegex = new RegExp("^\\d{2}\\s\\d{4,5}\\s\\d{4}$");

router.get("/", (req, res) => {
  // #swagger.tags = ['appointments']
  /* #swagger.parameters['filtro'] = {
          in: "query",
          name: "Filtro de busca",
          required: false,
          type: "object",
          schema: {
            $ref: "#/components/schemas/appointment"
          },
          style: "form",
          explode: true
  }
  */
  let args = req.query;
  if (args === undefined || Object.keys(args).length <= 0) {
    res.json(db.getDB("appointment"));
  } else {
    Object.keys(args).forEach((key, index) => {
      let value = args[key];
      if (numberRegex.test(value)) {
        args[key] = parseInt(value);
      } else if (phoneNumberRegex.test(value)) {
        args[key] = parseInt(value.split(" ").reduce((el, acc) => (el += acc)));
      }
    });

    let dummy = new Appointment();
    let keys = Object.getOwnPropertyNames(dummy);

    let commonKeys = keys.filter((el) => Object.keys(args).includes(el));
    if (commonKeys.length <= 0) {
      res.status(400).send("Argumentos inválidos");
      return;
    }

    let objs = db.getDB("appointment");
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
  // #swagger.tags = ['appointments']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/appointment"
          }
        }
      }
    }
  */
  let id = db.getDB("appointment").length + 1;
  let newAppointment = new Appointment(
    id,
    req.body.specialty,
    req.body.comments,
    req.body.date,
    req.body.student,
    req.body.professional,
  );

  if (!req.body.date || !req.body.student || !req.body.professional) {
    res
      .status(400)
      .send(
        "Preencha todos os campos obrigatórios (date, student, professional)",
      );
    return;
  }

  if (typeof newAppointment.student !== "string") {
    res.status(400).send("Estudante deve ser uma string");
    return;
  }

  if (typeof newAppointment.professional !== "string") {
    res.status(400).send("Profissional deve ser uma string");
    return;
  }

  if (newAppointment.specialty) {
    if (typeof newAppointment.specialty !== "string") {
      res.status(400).send("Especialidade deve ser uma string");
      return;
    }
  }

  if (newAppointment.comments) {
    if (typeof newAppointment.comments !== "string") {
      res.status(400).send("Comentários devem ser uma string");
      return;
    }
  }

  if (isNaN(new Date(newAppointment.date))) {
    res.status(400).send("Data inválida");
    return;
  }
  let students = db.getDB("student");
  if (!students.some((el) => el.name === newAppointment.student)) {
    res.status(400).send("Estudante com este nome não existe");
    return;
  }
  let professionals = db.getDB("professional");
  if (!professionals.some((el) => el.name === newAppointment.professional)) {
    res.status(400).send("Profissional com este nome não existe");
    return;
  } else {
    if (!newAppointment.specialty) {
      newAppointment.specialty = professionals.find(
        (pf) => pf.name === newAppointment.professional,
      ).specialty;
    }
  }
  if (!newAppointment.comments) {
    newAppointment.comments = "";
  } else if (typeof newAppointment.comments !== "string") {
    res.status(400).send("Comentários devem ser uma string");
    return;
  }

  let rs = db.addDB(newAppointment);
  if (rs !== true) {
    let original = db.getDB("appointment")[rs];
    newAppointment.id = original.id;
  }

  res.status(200).json(newAppointment);
});

router.put("/:id", (req, res) => {
  // #swagger.tags = ['appointments']
  /*  #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/appointment"
          }
        }
      }
    }
  */
  let appointment = db
    .getDB("appointment")
    .find((el) => el.id === parseInt(req.params.id));
  if (appointment) {
    let id = appointment.id;

    let newAppointment = new Appointment(
      id,
      appointment.specialty,
      appointment.comments,
      appointment.date,
      appointment.student,
      appointment.professional,
    );

    if (req.body.specialty) {
      newAppointment.specialty = req.body.specialty;
    }
    if (req.body.comments) {
      newAppointment.comments = req.body.comments > 0 ? req.body.comments : "";
    }
    if (req.body.date) {
      if (isNaN(new Date(req.body.date))) {
        res.status(400).send("Data inválida");
        return;
      }
      newAppointment.date = req.body.date;
    }
    if (req.body.student) {
      let students = db.getDB("student");
      if (students.some((el) => el.name === req.body.student)) {
        newAppointment.student = req.body.student;
      } else {
        res.status(400).send("Estudante não existe");
        return;
      }
    }
    if (req.body.professional) {
      let professionals = db.getDB("professional");
      if (professionals.some((el) => el.name === req.body.professional)) {
        newAppointment.professional = req.body.professional;
      } else {
        res.status(400).send("Profissional não existe");
        return;
      }
    }

    db.removeDB("appointment", appointment);
    let rs = db.addDB(newAppointment);
    if (rs !== true) {
      let original = db.getDB("appointment")[rs];
      newAppointment.id = original.id;
    }

    res.status(200).json(newAppointment).send("OK");
  } else {
    res.status(404).send("Consulta não encontrada");
  }
});

router.delete("/:id", (req, res) => {
  // #swagger.tags = ['appointments']
  let appointment = db
    .getDB("appointment")
    .find((el) => el.id === parseInt(req.params.id));
  if (appointment) {
    db.removeDB("appointment", appointment);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Consulta não encontrada");
  }
});

module.exports = router;
