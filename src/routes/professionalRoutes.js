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
    req.body.email,
    req.body.phoneNumber,
    req.body.status,
  );
});

router.get("/:id", (req, res) => {
  // Obter um objeto específico por ID
});

router.put("/:id", (req, res) => {
  // Atualizar um objeto por ID
});

router.delete("/:id", (req, res) => {
  // Deletar um objeto por ID
});

module.exports = router;
