// Import do arquivo DAO para manipular dados das classificações
const nacionalidadeAtorDAO = require('../model/DAO/ator_nacionalidade.js')

const message = require('../modulo/config.js')

// Função para inserir uma nova classificação no banco de dados
const setInserirNovaNacionalidadeAtor = async (dadosNacionalidadeAtor, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaNacionalidadeAtorJSON = {}

            if (
                dadosNacionalidadeAtor.id_ator == undefined || isNaN(dadosNacionalidadeAtor.id_ator) || dadosNacionalidadeAtor.id_ator == null ||
                dadosNacionalidadeAtor.id_nacionalidade == undefined || isNaN(dadosNacionalidadeAtor.id_nacionalidade) || dadosNacionalidadeAtor.id_nacionalidade == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaNacionalidadeAtor = await nacionalidadeAtorDAO.insertNacionalidadeAtor(dadosNacionalidadeAtor)

                if (novaNacionalidadeAtor) {
                    let id = await nacionalidadeAtorDAO.selectId()
                    novaNacionalidadeAtorJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaNacionalidadeAtorJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaNacionalidadeAtorJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaNacionalidadeAtorJSON.id = parseInt(id)
                    novaNacionalidadeAtorJSON.nacionalidade_ator = dadosNacionalidadeAtor

                    return novaNacionalidadeAtorJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

// Função para atualizar uma classificação no banco de dados
const setAtualizarNacionalidadeAtor = async (dadosNacionalidadeAtor, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateNacionalidadeAtorJSON = {}

            if (
                dadosNacionalidadeAtor.id_ator == undefined || isNaN(dadosNacionalidadeAtor.id_ator) || dadosNacionalidadeAtor.id_ator == null ||
                dadosNacionalidadeAtor.id_nacionalidade == undefined || isNaN(dadosNacionalidadeAtor.id_nacionalidade) || dadosNacionalidadeAtor.id_nacionalidade == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let nacionalidadeAtorAtualizada = await nacionalidadeAtorDAO.updateNacionalidadeAtor(id, dadosNacionalidadeAtor)

                if (nacionalidadeAtorAtualizada) {
                    let updatedNacionalidadeAtor = await nacionalidadeAtorDAO.selectByIdNacionalidadeAtor(id) 
                    let updatedId = updatedNacionalidadeAtor[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateNacionalidadeAtorJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateNacionalidadeAtorJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateNacionalidadeAtorJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateNacionalidadeAtorJSON.id = updatedId 
                    updateNacionalidadeAtorJSON.nacionalidade_ator = dadosNacionalidadeAtor

                    return updateNacionalidadeAtorJSON // Retorna a resposta JSON atualizada
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

// Função para excluir uma classificação do banco de dados
const setExcluirNacionalidadeAtor = async (id) => {

    try {

        let idNacionalidadeAtor = id

        let validaNacionalidadeAtor = await getBuscarNacionalidadeAtor(idNacionalidadeAtor)

        let dadosNacionalidadeAtor = await nacionalidadeAtorDAO.deleteNacionalidadeAtor(idNacionalidadeAtor)

        if (idNacionalidadeAtor == '' || idNacionalidadeAtor == undefined || isNaN(idNacionalidadeAtor)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaNacionalidadeAtor.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            if (dadosNacionalidadeAtor) {
                return message.SUCESS_DELETE_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

// Função para retornar todas as classificações do banco de dados
const getListarNacionalidadesAtores = async () => {
    // Cria o objeto JSON
    let nacionalidadesAtoresJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosNacionalidadesAtores = await nacionalidadeAtorDAO.selectAllNacionalidadeAtores()

    // Validação para criar o JSON de dados
    if (dadosNacionalidadesAtores) {
        if (dadosNacionalidadesAtores.length > 0) {
            nacionalidadesAtoresJSON.nacionalidades_atores = dadosNacionalidadesAtores
            nacionalidadesAtoresJSON.quantidade = dadosNacionalidadesAtores.length
            nacionalidadesAtoresJSON.status_code = 200

            return nacionalidadesAtoresJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

// Função para buscar uma classificação pelo ID
const getBuscarNacionalidadeAtor = async (id) => {
    let idNacionalidadeAtor = id
    let nacionalidadeAtorJSON = {}

    if (idNacionalidadeAtor == '' || idNacionalidadeAtor == undefined || isNaN(idNacionalidadeAtor)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosNacionalidadeAtor = await nacionalidadeAtorDAO.selectByIdNacionalidadeAtor(idNacionalidadeAtor)

        if (dadosNacionalidadeAtor) {
            if (dadosNacionalidadeAtor.length > 0) {
                nacionalidadeAtorJSON.nacionalidade_ator = dadosNacionalidadeAtor
                nacionalidadeAtorJSON.status_code = 200

                return nacionalidadeAtorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovaNacionalidadeAtor,
    setAtualizarNacionalidadeAtor,
    setExcluirNacionalidadeAtor,
    getListarNacionalidadesAtores,
    getBuscarNacionalidadeAtor
}