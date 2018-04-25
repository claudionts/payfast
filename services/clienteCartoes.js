var restify = require('restify')

var cliente = restify.createJsonClient({
    url: 'http://localhost:3001'
})

cliente.post('/cartoes/autoriza', cartao,
            (erro, req, res, retorno) => {
            console.log('consumindo servicos de cartoes')
            console.log(retorno)
})
