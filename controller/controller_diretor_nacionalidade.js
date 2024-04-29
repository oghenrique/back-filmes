// Import do arquivo DAO para manipular dados das classificações
const nacionalidadeDiretorDAO = require('../model/DAO/diretor_nacionalidade.js')

const message = require('../modulo/config.js')

// Função para inserir uma nova classificação no banco de dados
const setInserirNovaNacionalidadeDiretor = async (dadosNacionalidadeDiretor, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaNacionalidadeDiretorJSON = {}

            if (
                dadosNacionalidadeDiretor.id_diretor == undefined || isNaN(dadosNacionalidadeDiretor.id_diretor) || dadosNacionalidadeDiretor.id_diretor == null ||
                dadosNacionalidadeDiretor.id_nacionalidade == undefined || isNaN(dadosNacionalidadeDiretor.id_nacionalidade) || dadosNacionalidadeDiretor.id_nacionalidade == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaNacionalidadeDiretor = await nacionalidadeDiretorDAO.insertNacionalidadeDiretor(dadosNacionalidadeDiretor)

                if (novaNacionalidadeDiretor) {
                    let id = await nacionalidadeDiretorDAO.selectId()
                    novaNacionalidadeDiretorJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaNacionalidadeDiretorJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaNacionalidadeDiretorJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaNacionalidadeDiretorJSON.id = parseInt(id)
                    novaNacionalidadeDiretorJSON.nacionalidade_diretor = dadosNacionalidadeDiretor

                    return novaNacionalidadeDiretorJSON // 201
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
const setAtualizarNacionalidadeDiretor = async (dadosNacionalidadeDiretor, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateNacionalidadeDiretorJSON = {}

            if (
                dadosNacionalidadeDiretor.id_diretor == undefined || isNaN(dadosNacionalidadeDiretor.id_diretor) || dadosNacionalidadeDiretor.id_diretor == null ||
                dadosNacionalidadeDiretor.id_nacionalidade == undefined || isNaN(dadosNacionalidadeDiretor.id_nacionalidade) || dadosNacionalidadeDiretor.id_nacionalidade == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let NacionalidadeDiretorAtualizada = await nacionalidadeDiretorDAO.updateNacionalidadeDiretor(id, dadosNacionalidadeDiretor)

                if (NacionalidadeDiretorAtualizada) {
                    let updatedNacionalidadeDiretor = await nacionalidadeDiretorDAO.selectByIdNacionalidadeDiretor(id) 
                    let updatedId = updatedNacionalidadeDiretor[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateNacionalidadeDiretorJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateNacionalidadeDiretorJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateNacionalidadeDiretorJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateNacionalidadeDiretorJSON.id = updatedId 
                    updateNacionalidadeDiretorJSON.nacionalidade_diretor = dadosNacionalidadeDiretor

                    return updateNacionalidadeDiretorJSON // Retorna a resposta JSON atualizada
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
const setExcluirNacionalidadeDiretor = async (id) => {

    try {

        let idNacionalidadeDiretor = id

        let validaNacionalidadeDiretor = await getBuscarNacionalidadeDiretor(idNacionalidadeDiretor)

        let dadosNacionalidadeDiretor = await nacionalidadeDiretorDAO.deleteNacionalidadeDiretor(idNacionalidadeDiretor)

        if (idNacionalidadeDiretor == '' || idNacionalidadeDiretor == undefined || isNaN(idNacionalidadeDiretor)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaNacionalidadeDiretor.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            if (dadosNacionalidadeDiretor) {
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
const getListarNacionalidadesDiretores = async () => {
    // Cria o objeto JSON
    let nacionalidadesdiretoresJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosNacionalidadesdiretores = await nacionalidadeDiretorDAO.selectAllNacionalidadeDiretores()

    // Validação para criar o JSON de dados
    if (dadosNacionalidadesdiretores) {
        if (dadosNacionalidadesdiretores.length > 0) {
            nacionalidadesdiretoresJSON.nacionalidades_diretores = dadosNacionalidadesdiretores
            nacionalidadesdiretoresJSON.quantidade = dadosNacionalidadesdiretores.length
            nacionalidadesdiretoresJSON.status_code = 200

            return nacionalidadesdiretoresJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

// Função para buscar uma classificação pelo ID
const getBuscarNacionalidadeDiretor = async (id) => {
    let idNacionalidadeDiretor = id
    let NacionalidadeDiretorJSON = {}

    if (idNacionalidadeDiretor == '' || idNacionalidadeDiretor == undefined || isNaN(idNacionalidadeDiretor)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosNacionalidadeDiretor = await nacionalidadeDiretorDAO.selectByIdNacionalidadeDiretor(idNacionalidadeDiretor)

        if (dadosNacionalidadeDiretor) {
            if (dadosNacionalidadeDiretor.length > 0) {
                NacionalidadeDiretorJSON.nacionalidade_diretor = dadosNacionalidadeDiretor
                NacionalidadeDiretorJSON.status_code = 200

                return NacionalidadeDiretorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovaNacionalidadeDiretor,
    setAtualizarNacionalidadeDiretor,
    setExcluirNacionalidadeDiretor,
    getListarNacionalidadesDiretores,
    getBuscarNacionalidadeDiretor
}