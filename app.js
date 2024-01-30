/***********************************************************************************************
 * Objetivo: Criar uma estrutura para trazer informações sobre os dados da ACME Filmes         *
 * Autor: Gustavo Henrique                                                                     *
 * Data: 23/01/2024                                                                            *
 * Versão: 1.0                                                                                 *
***********************************************************************************************/


const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()


app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET')

    app.use(cors())

    next()
})

//EndPoints: listar todos os filmes
app.get('/v1/acme/filmes', cors(), async (request, response, next) => {

    let controleListaFilmes = require('./controller/funcoes.js')
    let filmes = controleListaFilmes.getListarFilmes()
    response.json(filmes)
    response.status(200)
})

//EndPoints: listar filmes pelo id
app.get('/v1/acme/filme/:id', cors(), async (request, response, next) => {

    let controleFilmeId = require('./controller/funcoes.js')
    let id = request.params.id

    let dadosFilme = controleFilmeId.getIdFilme(id)

    if (dadosFilme) {
        response.json(dadosFilme)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: "Não foi possivel encontrar um item" })
    }


})

app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')
})