// Import do arquivo DAO para manipular dados das classificações
const filmeGeneroDAO = require('../model/DAO/filme_genero.js')

const message = require('../modulo/config.js')

const setInserirNovoFilmeGenero = async (dadosFilmeGenero, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoFilmeGeneroJSON = {}

            if (
                dadosFilmeGenero.id_filme == undefined || isNaN(dadosFilmeGenero.id_filme) || dadosFilmeGenero.id_filme == null ||
                dadosFilmeGenero.id_genero == undefined || isNaN(dadosFilmeGenero.id_genero) || dadosFilmeGenero.id_genero == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novoFilmeGenero = await filmeGeneroDAO.insertFilmeGenero(dadosFilmeGenero)

                if (novoFilmeGenero) {
                    let id = await filmeGeneroDAO.selectId()
                    novoFilmeGeneroJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoFilmeGeneroJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoFilmeGeneroJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoFilmeGeneroJSON.id = parseInt(id)
                    novoFilmeGeneroJSON.filme_genero = dadosFilmeGenero

                    return novoFilmeGeneroJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 
    }
}

const setAtualizarFilmeGenero = async (dadosFilmeGenero, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateFilmeGeneroJSON = {}

            if (
                dadosFilmeGenero.id_filme == undefined || isNaN(dadosFilmeGenero.id_filme) || dadosFilmeGenero.id_filme == null ||
                dadosFilmeGenero.id_genero == undefined || isNaN(dadosFilmeGenero.id_genero) || dadosFilmeGenero.id_genero == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let FilmeGeneroAtualizado = await filmeGeneroDAO.updateFilmeGenero(id, dadosFilmeGenero)

                if (FilmeGeneroAtualizado) {
                    let updatedFilmeGenero = await filmeGeneroDAO.selectByIdFilmeGenero(id) 
                    let updatedId = updatedFilmeGenero[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateFilmeGeneroJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateFilmeGeneroJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateFilmeGeneroJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateFilmeGeneroJSON.id = updatedId 
                    updateFilmeGeneroJSON.filme_genero = dadosFilmeGenero

                    return updateFilmeGeneroJSON // Retorna a resposta JSON atualizado
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
const setExcluirFilmeGenero = async (id) => {

    try {

        let idFilmeGenero = id

        let validaFilmeGenero = await getBuscarFilmeGenero(idFilmeGenero)

        let dadosFilmeGenero = await filmeGeneroDAO.deleteFilmeGenero(idFilmeGenero)

        if (idFilmeGenero == '' || idFilmeGenero == undefined || isNaN(idFilmeGenero)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaFilmeGenero.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            if (dadosFilmeGenero) {
                return message.SUCESS_DELETE_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarFilmesGeneros = async () => {
    // Cria o objeto JSON
    let FilmesGenerosJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosFilmesGeneros = await filmeGeneroDAO.selectAllFilmeGeneros()

    // Validação para criar o JSON de dados
    if (dadosFilmesGeneros) {
        if (dadosFilmesGeneros.length > 0) {
            FilmesGenerosJSON.filmes_generos = dadosFilmesGeneros
            FilmesGenerosJSON.quantidade = dadosFilmesGeneros.length
            FilmesGenerosJSON.status_code = 200

            return FilmesGenerosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarFilmeGenero = async (id) => {
    let idFilmeGenero = id
    let FilmeGeneroJSON = {}

    if (idFilmeGenero == '' || idFilmeGenero == undefined || isNaN(idFilmeGenero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosFilmeGenero = await filmeGeneroDAO.selectByIdFilmeGenero(idFilmeGenero)

        if (dadosFilmeGenero) {
            if (dadosFilmeGenero.length > 0) {
                FilmeGeneroJSON.filme_genero = dadosFilmeGenero
                FilmeGeneroJSON.status_code = 200

                return FilmeGeneroJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

const getFilmesByGenero = async (idGenero) => {
    let filmesJSON = {}

    if (!idGenero) {
        return message.ERROR_NOT_FOUND
    } else {
        let filmes = await filmeGeneroDAO.selectFilmesByGenero(idGenero)

        if (filmes) {
            if (filmes.length > 0) {
                filmesJSON.filmes = filmes.map(filme => filme.titulo)
                filmesJSON.status_code = 200
                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}





module.exports = {
    setInserirNovoFilmeGenero,
    setAtualizarFilmeGenero,
    setExcluirFilmeGenero,
    getListarFilmesGeneros,
    getBuscarFilmeGenero,
    getBuscarFilmeGenero,
    getFilmesByGenero
}