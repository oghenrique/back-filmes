/***********************************************************************************************
 * Objetivo: Criar uma estrutura para trazer informações sobre os dados da ACME Filmes         *
 * Autor: Gustavo Henrique                                                                     *
 * Data: 23/01/2024                                                                            *
 * Versão: 1.0                                                                                 *
***********************************************************************************************/

var catalogo = require('../model/filmes.js')

const getListarFilmes = () => {

    const filmesInfo = catalogo.filmes.filmes

    let filmesJSON = {}
    let filmesArray = []

    filmesInfo.forEach((filme) => {

        let filmeJSON = {
            id: filme.id,
            nome: filme.nome,
            email: filme.email,
            senha: filme.senha,
            telefone: filme.telefone
      }

        filmesArray.push(filmeJSON)

    })

    filmesJSON.filme = filmesArray
    filmesJSON.filmes = filmesInfo.length

    return filmesJSON

}
