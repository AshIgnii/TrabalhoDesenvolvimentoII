module.exports = (() => {
    let route = require('express').Router();

    route.get('/', (req, res) => {
        // listar todos os professores
    });
    route.get('/:arg', (req, res) => {
        // listar professor por id, nome
    });

    return route;
})();