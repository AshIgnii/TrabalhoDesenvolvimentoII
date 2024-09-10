const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Lista de estudantes
});

router.post('/', (req, res) => {
  // Adicionar um estudante
});

router.get('/:id', (req, res) => {
  // Detalhes do estudante por id, nome
});

router.put('/:id', (req, res) => {
  // Atualizar o estudante por id, nome
});

router.delete('/:arg', (req, res) => {
  // Deletar o estudante por id, nome
});

module.exports = router;