/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar validações, consistencias e regra de negócio para os filmes *
 * Data: 30/01/2024                                                                                       *
 * Autor: Gustavo Henrique                                                                                *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import do arquivo de configuração do Projeto
const message = require('../modulo/config.js')

//import do arquivo DAO para manipular dados dos filmes 
const filmesDAO = require('../model/DAO/filme.js')

//Função para inserir um novo filme
const setNovoFilme = async () => {

}

//Função para atualizar um filme existente
const setAtualizarFilme = async () => {

}

//Função para excluir um Filme existente
const setExcluirFilme = async () => {

}

//Função para retornar todos os filmes do database
const getListarFilmes = async () => {

    //Cria o objeto JSON
    let filmesJSON = {}

    //Cria a função DAO para retornar os dados do BD
    let dadosFilmes = await filmesDAO.selectAllFilmes()



    //Validação para criar o JSON de dados
    if (dadosFilmes) {
        if (dadosFilmes.length > 0) {
            filmesJSON.filmes = dadosFilmes
            filmesJSON.quantidade = dadosFilmes.length
            filmesJSON.status_code = 200

            return filmesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }


}

//Função para retornar filtro do filme pelo ID
const getBuscarFilme = async (id) => {

    let idFilme = id

    let filmeJSON = {}

    //Validação para verificar o ID do Filme antes de encaminhar para o DAO
    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID_ID
    } else {

        //Encaminha o ID do filme para o DAO para o retorno do Banco de Dados
        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)

        //Validação para verificar se o DAO retornou dados
        if (dadosFilme) {

            if (dadosFilme.length > 0) {
                //Cria o JSON de retorno de dados
                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

//Função para retornar filtro do filme pelo nome
const getBuscarNomeFilme = async (nome) => {

    let nomeFilme = nome

    let filmeJSON = {}

    if (nomeFilme == '' || nomeFilme == undefined ) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosFilme = await filmesDAO.selectByNomeFilme(nomeFilme)

        if (dadosFilme) {
            
            if (dadosFilme.length > 0) {
               
                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarNomeFilme
}