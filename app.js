/***********************************************************************************************
 * Objetivo: Criar uma estrutura para trazer informações sobre os dados da ACME Filmes         *
 * Autor: Gustavo Henrique                                                                     *
 * Data: 23/01/2024                                                                            *
 * Versão: 1.0                                                                                 *
***********************************************************************************************/

/*Para realizar a integração com Banco de Dados precisamos de uma biblioteca
 * 
 * SEQUELIZE ORM (mais aniga)
 * PRISMA ORM    (mais atualizada)
 * FASTFY ORM    (mais atualizada)
 * 
 * Instalação do PRISMA ORM
 * 
 * npm install prisma --save (Conexão com database)
 * npm install @prisma/client -- save (executa os scripts SQL no database)
 * npx prisma init(inicia a utilização do prisma no projeto)
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()


app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

//Cria um objeto para definir o tipo de dados que irá chegar no BODY (JSON)
const bodyParserJSON = bodyParser.json()

/*************************** Import dos arquivos internos do projeto***********************/

const controllerFilmes = require('./controller/controller_filme.js')
const controllerAtores = require('./controller/controller_ator.js')
const controllerDiretores = require('./controller/controller_diretor.js')
const controllerGeneros = require('./controller/controller_genero.js')
const controllerClassificacoes = require('./controller/controller_classificacao.js')
const controllerNacionalidades = require('./controller/controller_nacionalidade.js')
const { filmes } = require('./model/filmes.js')

/******************************************************************************************/

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

//New EndPoint: retorna dados do Banco De Dados
app.get('/v2/acmefilmes/filmes', cors(), async (request, response, next) => {

    //Chama a função para retornar os dados de FIlme
    let dadosFilmes = await controllerFilmes.getListarFilmes()

    //Validação para retornar os dados ou o erro 404
    if (dadosFilmes) {
        response.json(dadosFilmes)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

//EndPoints: listar filme pelo nome usando Query
app.get('/v2/acmefilmes/filtro/filme', cors(), async (request, response, next) => {

    let nomeFilme = request.query.nomeFilme
    
    let dadosFilme = await controllerFilmes.getBuscarNomeFilme(nomeFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)

})

//EndPoints: listar filmes filtrando pelo id
app.get('/v2/acmefilmes/filme/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})


app.post('/v2/acmefilmes/filme',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerFilmes.setInserirNovoFilme(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.delete('/v2/acmefilmes/filme/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idFilme = request.params.id
    let dadosFilme = await controllerFilmes.setExcluirFilme(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})

app.put ('/v2/acmefilmes/filme/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idFilme = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerFilmes.setAtualizarFilme(dadosBody, contentType, idFilme)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

// ATORES

app.post('/v2/acmefilmes/ator',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerAtores.setInserirNovoAtor(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.get('/v2/acmefilmes/atores', cors(), async (request, response, next) => {

    //Chama a função para retornar os dados de FIlme
    let dadosAtores = await controllerAtores.getListarAtores()

    //Validação para retornar os dados ou o erro 404
    if (dadosAtores) {
        response.json(dadosAtores)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

app.get('/v2/acmefilmes/filtro/ator-completo', cors(), async (request, response, next) => {

    let nomeAtorCompleto= request.query.nomeAtorCompleto
    
    let dadosAtor = await controllerAtores.getBuscarNomeCompletoAtor(nomeAtorCompleto)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)

})

app.get('/v2/acmefilmes/filtro/ator-artistico', cors(), async (request, response, next) => {

    let nomeAtorArtistico = request.query.nomeAtorArtistico
    
    let dadosAtor = await controllerAtores.getBuscarNomeArtisticoAtor(nomeAtorArtistico)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)

})

app.get('/v2/acmefilmes/ator/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idAtor = request.params.id

    let dadosAtor = await controllerAtores.getBuscarAtor(idAtor)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

app.delete('/v2/acmefilmes/ator/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idAtor = request.params.id
    let dadosAtor = await controllerAtores.setExcluirAtor(idAtor)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

app.put ('/v2/acmefilmes/ator/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idAtor = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerAtores.setAtualizarAtor(dadosBody, contentType, idAtor)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

//DIRETORES

app.post('/v2/acmefilmes/diretor',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerDiretores.setInserirNovoDiretor(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.get('/v2/acmefilmes/diretores', cors(), async (request, response, next) => {

    //Chama a função para retornar os dados de FIlme
    let dadosDiretores = await controllerDiretores.getListarDiretores()

    //Validação para retornar os dados ou o erro 404
    if (dadosDiretores) {
        response.json(dadosDiretores)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

app.get('/v2/acmefilmes/filtro/diretor-completo', cors(), async (request, response, next) => {

    let nomeDiretorCompleto = request.query.nomeDiretorCompleto
    
    let dadosDiretor = await controllerDiretores.getBuscarNomeCompletoDiretor(nomeDiretorCompleto)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)

})

app.get('/v2/acmefilmes/filtro/diretor-artistico', cors(), async (request, response, next) => {

    let nomeDiretorArtistico = request.query.nomeDiretorArtistico
    
    let dadosDiretor = await controllerDiretores.getBuscarNomeArtisticoDiretor(nomeDiretorArtistico)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)

})

app.get('/v2/acmefilmes/diretor/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idDiretor = request.params.id

    let dadosDiretor = await controllerDiretores.getBuscarDiretor(idDiretor)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)
})

app.delete('/v2/acmefilmes/diretor/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idDiretor = request.params.id
    let dadosDiretor = await controllerDiretores.setExcluirDiretor(idDiretor)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)
})

app.put ('/v2/acmefilmes/diretor/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idDiretor = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerDiretores.setAtualizarDiretor(dadosBody, contentType, idDiretor)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

//GENEROS

app.post('/v2/acmefilmes/genero',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerGeneros.setInserirNovoGenero(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})


app.get('/v2/acmefilmes/generos', cors(), async (request, response, next) => {

    //Chama a função para retornar os dados de FIlme
    let dadosGeneros = await controllerGeneros.getListarGeneros()

    //Validação para retornar os dados ou o erro 404
    if (dadosGeneros) {
        response.json(dadosGeneros)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

//EndPoints: listar genero pelo nome usando Query
app.get('/v2/acmefilmes/filtro/genero', cors(), async (request, response, next) => {

    let nomeGenero = request.query.nomeGenero
    
    let dadosGenero = await controllerGeneros.getBuscarNomeGenero(nomeGenero)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)

})

app.get('/v2/acmefilmes/genero/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idGenero = request.params.id

    let dadosGenero = await controllerGeneros.getBuscarGenero(idGenero)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})

app.delete('/v2/acmefilmes/genero/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idGenero = request.params.id
    let dadosGenero = await controllerGeneros.setExcluirGenero(idGenero)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})

app.put ('/v2/acmefilmes/genero/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idGenero = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerGeneros.setAtualizarGenero(dadosBody, contentType, idGenero)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

//Classificação

app.post('/v2/acmefilmes/classificacao',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerClassificacoes.setInserirNovaClassificacao(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})


app.get('/v2/acmefilmes/classificacoes', cors(), async (request, response, next) => {

    //Chama a função para retornar os dados de FIlme
    let dadosClassificacoes = await controllerClassificacoes.getListarClassificacoes()

    //Validação para retornar os dados ou o erro 404
    if (dadosClassificacoes) {
        response.json(dadosClassificacoes)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

//EndPoints: listar classificação pelo nome usando Query
app.get('/v2/acmefilmes/filtro/classificacao', cors(), async (request, response, next) => {

    let nomeClassificacao = request.query.nomeClassificacao
    
    let dadosClassificacao = await controllerClassificacoes.getBuscarNomeClassificacao(nomeClassificacao)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)

})

app.get('/v2/acmefilmes/classificacao/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idClassificacao = request.params.id

    let dadosClassificacao = await controllerClassificacoes.getBuscarClassificacao(idClassificacao)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})

app.delete('/v2/acmefilmes/classificacao/:id',  cors(), bodyParserJSON, async (request, response, next) => {
    try {
        let idClassificacao = request.params.id;
        
        console.log("Recebida solicitação para excluir a classificação com ID:", idClassificacao);

        let dadosClassificacao = await controllerClassificacoes.setExcluirClassificacao(idClassificacao);

        console.log("Resposta da exclusão da classificação:", dadosClassificacao);

        response.status(dadosClassificacao.status_code);
        response.json(dadosClassificacao);
    } catch (error) {
        console.log("Erro ao processar solicitação de exclusão de classificação:", error);
        response.status(500).json({ error: "Internal server error" });
    }
});


app.put ('/v2/acmefilmes/classificacao/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idClassificacao = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerClassificacoes.setAtualizarClassificacao(dadosBody, contentType, idClassificacao)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

//Nacionalidade

app.post('/v2/acmefilmes/nacionalidade',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerNacionalidades.setInserirNovaNacionalidade(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})


app.get('/v2/acmefilmes/nacionalidades', cors(), async (request, response, next) => {

    //Chama a função para retornar os dados de FIlme
    let dadosNacionalidades = await controllerNacionalidades.getListarNacionalidades()

    //Validação para retornar os dados ou o erro 404
    if (dadosNacionalidades) {
        response.json(dadosNacionalidades)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

//EndPoints: listar genero pelo nome usando Query
app.get('/v2/acmefilmes/filtro/nacionalidade', cors(), async (request, response, next) => {

    let nomeNacionalidade = request.query.nomeNacionalidade
    
    let dadosNacionalidade = await controllerNacionalidades.getBuscarNomeNacionalidade(nomeNacionalidade)

    response.status(dadosNacionalidade.status_code)
    response.json(dadosNacionalidade)

})

app.get('/v2/acmefilmes/nacionalidade/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idNacionalidade = request.params.id

    let dadosNacionalidade = await controllerNacionalidades.getBuscarNacionalidade(idNacionalidade)

    response.status(dadosNacionalidade.status_code)
    response.json(dadosNacionalidade)
})

app.delete('/v2/acmefilmes/nacionalidade/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idNacionalidade = request.params.id
    let dadosNacionalidade = await controllerNacionalidades.setExcluirNacionalidade(idNacionalidade)

    response.status(dadosNacionalidade.status_code)
    response.json(dadosNacionalidade)
})

app.put ('/v2/acmefilmes/nacionalidade/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idNacionalidade = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerNacionalidades.setAtualizarNacionalidade(dadosBody, contentType, idNacionalidade)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')

})

