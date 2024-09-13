const express = require("express");
const router = express.Router();
const dbManager = require("../dbManager.js");
const db = new dbManager();

router.get("/", (req, res) => {
  // Todos os objetos
});

router.post("/", (req, res) => {
  // Adicionar um objeto
});

router.get("/:id", (req, res) => {
  // Obter um objeto específico por ID
});

router.put("/:id", (req, res) => {
  // Atualizar um objeto específico por ID
});

router.delete("/:id", (req, res) => {
  // Deletar um objeto específico por ID
});

module.exports = router;
