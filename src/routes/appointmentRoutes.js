const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Appointment = require("../models/appointment.js");

router.get("/", (req, res) => {
  res.json(db.getDB("appointment"));
});

router.post("/", (req, res) => {
  let id = db.getDB("appointment").length + 1;
  let newAppointment = new Appointment(
    id,
    null,
    req.body.comments,
    req.body.date,
    req.body.student,
    req.body.professional,
  );

  if (isNaN(new Date(newAppointment.date))) {
    res.status(400).send("Data inválida");
    return;
  }
  let students = db.getDB("student");
  if (!students.some((el) => el.name === newAppointment.student)) {
    res.status(400).send("Estudante não existe");
    return;
  }
  let professionals = db.getDB("professional");
  if (!professionals.some((el) => el.name === newAppointment.professional)) {
    res.status(400).send("Profissional não existe");
    return;
  } else {
    newAppointment.specialty = professionals.find(
      (pf) => pf.name === newAppointment.professional,
    ).specialty;
  }
  if (!newAppointment.comments) {
    newAppointment.comments = "";
  }

  db.addDB(newAppointment);

  res.status(200).json(newAppointment);
});

router.get("/:id", (req, res) => {
  let appointment = db
    .getDB("appointment")
    .find((el) => el.id === parseInt(req.params.id));
  if (appointment) {
    res.status(200).json(appointment);
  } else {
    res.status(404).send("Consulta não encontrada");
  }
});

router.put("/:id", (req, res) => {
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
    if (req.body.date && !isNaN(new Date(req.body.date))) {
      newAppointment.date = req.body.date;
    } else {
      res.status(400).send("Data inválida");
      return;
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
    db.addDB(newAppointment);

    res.status(200).json(newAppointment);
  } else {
    res.status(404).send("Consulta não encontrada");
  }
});

router.delete("/:id", (req, res) => {
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
