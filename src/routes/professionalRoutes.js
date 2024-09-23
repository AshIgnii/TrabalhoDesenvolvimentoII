const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Professional = require("../models/professional.js");
const phoneRegex = new RegExp("[a-z]|[A-Z]|\\s");

router.get("/", (req, res) => {
  res.json(db.getDB("professional"));
});

router.post("/", (req, res) => {
  let id = db.getDB("professional").length + 1;
  let newProfessional = new Professional(
    id,
    req.body.name,
    req.body.speciality,
    req.body.contact,
    req.body.phoneNumber,
    req.body.status,
  );
  if (
    !req.body.name ||
    !req.body.speciality ||
    !req.body.contact ||
    !req.body.phoneNumber
  ) {
    res
      .status(400)
      .send(
        "Preencha todos os campos obrigatórios (name, speciality, contact, phoneNumber)",
      );
    return;
  }
  if (typeof req.body.phoneNumber === "string") {
    let formNum = parseInt(
      newProfessional.phoneNumber
        .split(phoneRegex)
        .reduce((el, acc) => el + acc),
    );
    if (isNaN(formNum)) {
      res
        .status(400)
        .send("Número de telefone inválido, utilize apenas números");
      return;
    } else {
      newProfessional.phoneNumber = formNum;
    }
  } else if (typeof req.body.phoneNumber === "number") {
    newProfessional.phoneNumber = req.body.phoneNumber;
  } else {
    res.status(400).send("Número de telefone inválido");
    return;
  }

  if (req.body.status) {
    if (typeof newProfessional.status === "string") {
      let st = newProfessional.status.toLowerCase();
      if (st === "on" || st === "off") {
        newProfessional.status = st;
      } else if (st === "") {
        newProfessional.status = "on";
      } else {
        res.status(400).send("Status inválido");
        return;
      }
    } else {
      res.status(400).send("Status inválido");
      return;
    }
  } else {
    newProfessional.status = "on";
  }

  let rs = db.addDB(newProfessional);
  if (rs !== true) {
    let original = db.getDB("professional")[rs];
    newProfessional.id = original.id;
  }
  res.status(200).json(newProfessional);
});

router.get("/:id", (req, res) => {
  let getprof = db
    .getDB("professional")
    .find((el) => el.id == parseInt(req.params.id));
  if (getprof) {
    res.status(200).json(getprof);
  } else {
    res.status(404).send("Professional não encontrado");
  }
});

router.put("/:id", (req, res) => {
  let prof = db
    .getDB("professional")
    .find((el) => el.id == parseInt(req.params.id));
  if (prof) {
    let newprof = new Professional(
      prof.id,
      prof.name,
      prof.speciality,
      prof.contact,
      prof.phoneNumber,
      prof.status,
    );

    if (req.body.name) {
      newprof.name = req.body.name;
    }
    if (req.body.speciality) {
      newprof.speciality = req.body.speciality;
    }

    if (req.body.contact) {
      newprof.contact = req.body.contact;
    }

    if (req.body.phoneNumber) {
      if (typeof req.body.phoneNumber === "string") {
        let formNum = parseInt(
          req.body.phoneNumber
            .split(phoneRegex)
            .reduce((el, acc) => (el += acc)),
        );
        if (isNaN(formNum)) {
          res
            .status(400)
            .send("Número de telefone inválido, utilize apenas números");
          return;
        }
        newprof.phoneNumber = formNum;
      } else if (typeof req.body.phoneNumber === "number") {
        newprof.phoneNumber = req.body.phoneNumber;
      }
    }

    if (req.body.status) {
      if (typeof req.body.status === "string") {
        let st = req.body.status.toLowerCase();
        if (st === "on" || st === "off") {
          newprof.status = st;
        } else if (st === "") {
          newprof.status = "on";
        } else {
          res.status(400).send("Status inválido");
          return;
        }
      } else {
        res.status(400).send("Status inválido");
        return;
      }
    }

    db.removeDB("professional", prof);
    let rs = db.addDB(newprof);
    if (rs !== true) {
      let original = db.getDB("professional")[rs];
      newprof.id = original.id;
    }

    res.status(200).json(newprof);
  } else {
    res.status(404).send("Professional não encontrado");
    return;
  }
});

router.delete("/:id", (req, res) => {
  let prof = db
    .getDB("professional")
    .find((el) => el.id == parseInt(req.params.id));
  if (prof) {
    db.removeDB("professional", prof);
    res.status(200).send("OK");
  } else {
    res.status(404).send("Professional não encontrado");
    return;
  }
});

module.exports = router;
