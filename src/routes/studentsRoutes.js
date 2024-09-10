module.exports = (() => {
    let route = require('express').Router();

    route.get('/', (req, res) => {
        // listar todos os estudantes
    });
    route.get('/:arg', (req, res) => {
        // listar estudante por id, nome
    });

    return route;
})();