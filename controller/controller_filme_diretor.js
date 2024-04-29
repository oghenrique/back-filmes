// Import do arquivo DAO para manipular dados das classificações
const filmeDiretorDAO = require('../model/DAO/filme_diretor.js')

const message = require('../modulo/config.js')

const setInserirNovoFilmeDiretor = async (dadosFilmeDiretor, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoFilmeDiretorJSON = {}

            if (
                dadosFilmeDiretor.id_filme == undefined || isNaN(dadosFilmeDiretor.id_filme) || dadosFilmeDiretor.id_filme == null ||
                dadosFilmeDiretor.id_diretor == undefined || isNaN(dadosFilmeDiretor.id_diretor) || dadosFilmeDiretor.id_diretor == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novoFilmeDiretor = await filmeDiretorDAO.insertFilmeDiretor(dadosFilmeDiretor)

                if (novoFilmeDiretor) {
                    let id = await filmeDiretorDAO.selectId()
                    novoFilmeDiretorJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoFilmeDiretorJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoFilmeDiretorJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoFilmeDiretorJSON.id = parseInt(id)
                    novoFilmeDiretorJSON.filme_diretor = dadosFilmeDiretor

                    return novoFilmeDiretorJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 
    }
}

const setAtualizarFilmeDiretor = async (dadosFilmeDiretor, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateFilmeDiretorJSON = {}

            if (
                dadosFilmeDiretor.id_filme == undefined || isNaN(dadosFilmeDiretor.id_filme) || dadosFilmeDiretor.id_filme == null ||
                dadosFilmeDiretor.id_diretor == undefined || isNaN(dadosFilmeDiretor.id_diretor) || dadosFilmeDiretor.id_diretor == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let FilmeDiretorAtualizado = await filmeDiretorDAO.updateFilmeDiretor(id, dadosFilmeDiretor)

                if (FilmeDiretorAtualizado) {
                    let updatedFilmeDiretor = await filmeDiretorDAO.selectByIdFilmeDiretor(id) 
                    let updatedId = updatedFilmeDiretor[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateFilmeDiretorJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateFilmeDiretorJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateFilmeDiretorJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateFilmeDiretorJSON.id = updatedId 
                    updateFilmeDiretorJSON.filme_diretor = dadosFilmeDiretor

                    return updateFilmeDiretorJSON // Retorna a resposta JSON atualizado
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
const setExcluirFilmeDiretor = async (id) => {

    try {

        let idFilmeDiretor = id

        let validaFilmeDiretor = await getBuscarFilmeDiretor(idFilmeDiretor)

        let dadosFilmeDiretor = await filmeDiretorDAO.deleteFilmeDiretor(idFilmeDiretor)

        if (idFilmeDiretor == '' || idFilmeDiretor == undefined || isNaN(idFilmeDiretor)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaFilmeDiretor.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            if (dadosFilmeDiretor) {
                return message.SUCESS_DELETE_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarFilmesDiretores = async () => {
    // Cria o objeto JSON
    let filmesDiretoresJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosFilmesDiretores = await filmeDiretorDAO.selectAllFilmeDiretores()

    // Validação para criar o JSON de dados
    if (dadosFilmesDiretores) {
        if (dadosFilmesDiretores.length > 0) {
            filmesDiretoresJSON.filmes_diretores = dadosFilmesDiretores
            filmesDiretoresJSON.quantidade = dadosFilmesDiretores.length
            filmesDiretoresJSON.status_code = 200

            return filmesDiretoresJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarFilmeDiretor = async (id) => {
    let idFilmeDiretor = id
    let filmeDiretorJSON = {}

    if (idFilmeDiretor == '' || idFilmeDiretor == undefined || isNaN(idFilmeDiretor)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosFilmeDiretor = await filmeDiretorDAO.selectByIdFilmeDiretor(idFilmeDiretor)

        if (dadosFilmeDiretor) {
            if (dadosFilmeDiretor.length > 0) {
                filmeDiretorJSON.filme_diretor = dadosFilmeDiretor
                filmeDiretorJSON.status_code = 200

                return filmeDiretorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovoFilmeDiretor,
    setAtualizarFilmeDiretor,
    setExcluirFilmeDiretor,
    getListarFilmesDiretores,
    getBuscarFilmeDiretor
}