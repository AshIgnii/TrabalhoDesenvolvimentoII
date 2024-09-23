const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();
const Professional = require("../models/professional.js");

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
  if (!req.body.name || !req.body.speciality || !req.body.contact || !req.body.phoneNumber) {
    res.status(404).send("Preencha todos os campos obrigatórios (name, speciality, contact, phoneNumber, status)");
    return;
  }
  if (typeof req.body.phoneNumber === "string") {
    if (isNaN(parseInt(req.body.phoneNumber.split(" ").reduce((el, acc) => (el += acc)),),)) 
      {
      res.status(404).send("Número de telefone inválido, utilize apenas números");
      return;
    }
  } 

  if (req.body.status == "" || !req.body.status) {
    newProfessional.status = "ON";
  }
  if (req.body.status && (req.body.status != "ON" || req.body.status != "on") && (req.body.status != "OFF" || req.body.status != "off")) {
    res.status(404).send("Status inválido");
    return;
  }
  else {
    db.addDB(newProfessional);
    res.status(200).json(newProfessional);
  }

});

router.get("/:id", (req, res) => {
  let getprof = db.getDB("professional").find((el) => el.id == parseInt(req.params.id))
  if (getprof) {
    res.status(200).json(getprof)
  }
  else {
    res.status(404).send("ID inserido inválido, professional não encontrado")
  }
}
  // Obter um objeto específico por ID
);

router.put("/:id", (req, res) => {
  let prof = db.getDB("Professional").find((el) => el.id == parseInt(req.params.id));
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
      if (
        isNaN(
          parseInt(
            req.body.phoneNumber.split(" ").reduce((el, acc) => (el += acc)),
          ),
        )
      ) {
        res.status(404).send("Número de telefone inválido, utilize apenas números");
        return;
      }
      newprof.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.status) {
      if (newprof.body.status == '') {
        newprof.body.status = 'ON';
      }
      if ((req.body.status != 'ON' || req.body.status != 'on') && (req.body.stutus != 'OFF' || req.body.stutus != 'off')) {
        res.status(400).send("Status inválido");
      }
    }
    db.removeDB("professional", prof);
    db.addDB(newprof);
    res.status(200).json(newprof);
  }
  else {
    res.status(404).send("Professional não encontrado");
    return;
  }
});

router.delete("/:id", (req, res) => {
  let prof = db.getDB("professional").find((el) => el.id == parseInt(req.params.id));
  if (prof) {
    db.removeDB("professional", prof);
    res.status(200).send("O Professional foi deletado do banco de dados com sucesso!");
  }
  res.status(404).send("Professional não encontrado");
  return;
});

module.exports = router;
