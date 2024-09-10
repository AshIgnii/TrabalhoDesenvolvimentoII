const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Lista de professores
});

router.post('/', (req, res) => {
  // Adicionar um professor
});

router.get('/:id', (req, res) => {
  // Detalhes do professor por id, nome
});

router.put('/:id', (req, res) => {
  // Atualizar o professor por id, nome
});

router.delete('/:arg', (req, res) => {
  // Deletar o professor por id, nome
});

module.exports = router;