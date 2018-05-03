module.exports = (app) => {
    app.post('/correios/calculo-prazo', (req, res) => {
        var dadosDaEntrega = req.body
        var correiosSOAPClient = new app.servicos.correiosSOAPClient()
        correiosSOAPClient.calculaPrazo(dadosDaEntrega,
            (erro, resultado) => {
                if(erro){
                    res.status(500).send(erro)
                    return
                }
                console.log('prazo calculado')
                res.json(resultado)
            })
    })
}