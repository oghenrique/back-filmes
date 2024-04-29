// Import do arquivo DAO para manipular dados das classificações
const filmeAtorDAO = require('../model/DAO/filme_ator.js')

const message = require('../modulo/config.js')

const setInserirNovoFilmeAtor = async (dadosFilmeAtor, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoFilmeAtorJSON = {}

            if (
                dadosFilmeAtor.id_filme == undefined || isNaN(dadosFilmeAtor.id_filme) || dadosFilmeAtor.id_filme == null ||
                dadosFilmeAtor.id_ator == undefined || isNaN(dadosFilmeAtor.id_ator) || dadosFilmeAtor.id_ator == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novoFilmeAtor = await filmeAtorDAO.insertFilmeAtor(dadosFilmeAtor)

                if (novoFilmeAtor) {
                    let id = await filmeAtorDAO.selectId()
                    novoFilmeAtorJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoFilmeAtorJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoFilmeAtorJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoFilmeAtorJSON.id = parseInt(id)
                    novoFilmeAtorJSON.filme_ator = dadosFilmeAtor

                    return novoFilmeAtorJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 
    }
}

const setAtualizarFilmeAtor = async (dadosFilmeAtor, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateFilmeAtorJSON = {}

            if (
                dadosFilmeAtor.id_filme == undefined || isNaN(dadosFilmeAtor.id_filme) || dadosFilmeAtor.id_filme == null ||
                dadosFilmeAtor.id_ator == undefined || isNaN(dadosFilmeAtor.id_ator) || dadosFilmeAtor.id_ator == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let FilmeAtorAtualizado = await filmeAtorDAO.updateFilmeAtor(id, dadosFilmeAtor)

                if (FilmeAtorAtualizado) {
                    let updatedFilmeAtor = await filmeAtorDAO.selectByIdFilmeAtor(id) 
                    let updatedId = updatedFilmeAtor[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateFilmeAtorJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateFilmeAtorJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateFilmeAtorJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateFilmeAtorJSON.id = updatedId 
                    updateFilmeAtorJSON.filme_ator = dadosFilmeAtor

                    return updateFilmeAtorJSON // Retorna a resposta JSON atualizado
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camado da controller
    }
}

// Função para excluir uma classificação do banco de dados
const setExcluirFilmeAtor = async (id) => {

    try {

        let idFilmeAtor = id

        let validaFilmeAtor = await getBuscarFilmeAtor(idFilmeAtor)

        let dadosFilmeAtor = await filmeAtorDAO.deleteFilmeAtor(idFilmeAtor)

        if (idFilmeAtor == '' || idFilmeAtor == undefined || isNaN(idFilmeAtor)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaFilmeAtor.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            if (dadosFilmeAtor) {
                return message.SUCESS_DELETE_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarFilmesAtores = async () => {
    // Cria o objeto JSON
    let filmesAtoresJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosFilmesAtores = await filmeAtorDAO.selectAllFilmeAtores()

    // Validação para criar o JSON de dados
    if (dadosFilmesAtores) {
        if (dadosFilmesAtores.length > 0) {
            filmesAtoresJSON.filmes_atores = dadosFilmesAtores
            filmesAtoresJSON.quantidade = dadosFilmesAtores.length
            filmesAtoresJSON.status_code = 200

            return filmesAtoresJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarFilmeAtor = async (id) => {
    let idFilmeAtor = id
    let FilmeAtorJSON = {}

    if (idFilmeAtor == '' || idFilmeAtor == undefined || isNaN(idFilmeAtor)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosFilmeAtor = await filmeAtorDAO.selectByIdFilmeAtor(idFilmeAtor)

        if (dadosFilmeAtor) {
            if (dadosFilmeAtor.length > 0) {
                FilmeAtorJSON.filme_ator = dadosFilmeAtor
                FilmeAtorJSON.status_code = 200

                return FilmeAtorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovoFilmeAtor,
    setAtualizarFilmeAtor,
    setExcluirFilmeAtor,
    getListarFilmesAtores,
    getBuscarFilmeAtor
}