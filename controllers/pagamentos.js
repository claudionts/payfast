module.exports = (app) => {
    app.get('/pagamentos', (req, res) => {
        console.log('Recebida requisição de teste na porta 3000.')
        res.send('OK.')
    })

    app.delete('/pagamentos/pagamento/:id', (req, res) => {
        var pagamento = {}
        var id = req.params.id
        pagamento.id = id
        pagamento.status = 'CANCELADO'

        var connection = app.persistencia.connectionFactory()
        var pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.atualiza(pagamento, (erro) => {
            if(erro) {
                res.status(500).send(erro)
            }
            console.log('Pagamento cancelado')
            res.status(204).send(pagamento)
        })
    })

    app.put('/pagamentos/pagamento/:id', (req, res) => {
        var pagamento = {}
        var id = req.params.id
        pagamento.id = id
        pagamento.status = 'CONFIRMADO'

        var connection = app.persistencia.connectionFactory()
        var pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.atualiza(pagamento, (erro) => {
            if(erro) {
                res.status(500).send(erro)
            }
            console.log('Pagamento criado')
            res.send(pagamento)
        })
    })    

    app.post('/pagamentos/pagamento', (req, res) => {

        req.assert("pagamento.forma_de_pagamento", 
            "Forma de pagamento é Obrigatório").notEmpty()
        req.assert("pagamento.valor", 
            "Valor é obrigatório e deve ser um decimal")
                .notEmpty().isFloat()

        var errors = req.validationErrors()

        if(errors) {
            console.log('Erros de validacao encontrado')
            res.status(400).send(errors)
        }

        var pagamento = req.body["pagamento"] 
        console.log('processando um requisicao de um novo pagamento')

        pagamento.status = 'CRIADO'
        pagamento.data = new Date

        var connection = app.persistencia.connectionFactory()
        var pagamentoDao = new app.persistencia.PagamentoDao(connection)
        
        pagamentoDao.salva(pagamento, (erro, resultado) => {
            if(erro) {
                console.log('Erro ao inserir no banco: '+erro)
                res.status(500).send(erro)
            } else {
                pagamento.id = resultado.insertId
                console.log('pagamento criado')
                if(pagamento.forma_de_pagamento == 'cartao') {
                    var cartao = req.body["cartao"]
                    console.log(cartao)
                    res.status(201).json(cartao)
                    clienteCartores.autoriza(cartao)
                    return
                }
                res.location('/pagamentos/pagamento/' + 
                        pagamento.id)

                var response = {
                    dados_pagamento: pagamento,
                    links: [
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                            rel: "confirmar",
                            method: "PUT"
                        },
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/"
                                + pagamento.id,
                            rel: "cancelar",
                            method: "DELETE"
                        }
                    ]
                }                        
                res.status(201).json(response)
            }
        })
    })
}
