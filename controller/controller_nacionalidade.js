// Import do arquivo DAO para manipular dados das classificações
const nacionalidadesDAO = require('../model/DAO/nacionalidade.js')

const message = require('../modulo/config.js')

const setInserirNovaNacionalidade = async (dadosNacionalidade, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaNacionalidadeJSON = {}

            if (
                dadosNacionalidade.nome == '' || dadosNacionalidade.nome == undefined || dadosNacionalidade.nome == null || dadosNacionalidade.nome.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                //encaminha os dados para o DAO inserir
                let novaNacionalidade = await nacionalidadesDAO.insertNacionalidade(dadosNacionalidade)

                if (novaNacionalidade) {

                    let id = await nacionalidadesDAO.selectId()

                    //Cria o JSON de retorno com informações de requisição e os dados novos
                    novaNacionalidadeJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaNacionalidadeJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaNacionalidadeJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaNacionalidadeJSON.id = parseInt(id)
                    novaNacionalidadeJSON.nacionalidade = dadosNacionalidade

                    return novaNacionalidadeJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir nacionalidade no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setAtualizarNacionalidade = async (dadosNacionalidade, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateNacionalidadeJSON = {}

            if (
                dadosNacionalidade.nome == '' || dadosNacionalidade.nome == undefined || dadosNacionalidade.nome == null || dadosNacionalidade.nome.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                //encaminha os dados para o DAO inserir
                let nacionalidadeAtualizada = await nacionalidadesDAO.updateNacionalidade(id, dadosNacionalidade)

                if (nacionalidadeAtualizada) {
                    let updatedNacionalidade = await nacionalidadesDAO.selectByIdNacionalidade(id) // Recupera o filme atualizado do banco de dados
                    let updatedId = updatedNacionalidade[0].id // Extrai o id do filme atualizado

                    // Constrói o JSON de resposta com o id atualizado
                    updateNacionalidadeJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateNacionalidadeJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateNacionalidadeJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateNacionalidadeJSON.id = updatedId // Usa o id atualizado aqui
                    updateNacionalidadeJSON.nacionalidade = dadosNacionalidade

                    return updateNacionalidadeJSON // Retorna a resposta JSON atualizada

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirNacionalidade = async (id) => {

    try {

        let idNacionalidade = id

        let validaNacionalidade = await getBuscarNacionalidade(idNacionalidade)

        let dadosNacionalidade = await nacionalidadesDAO.deleteNacionalidade(idNacionalidade)

        if (idNacionalidade == '' || idNacionalidade == undefined || isNaN(idNacionalidade)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaNacionalidade.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosNacionalidade)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

//Função para retornar todos os nacionalidades do database
const getListarNacionalidades = async () => {

    //Cria o objeto JSON
    let nacionalidadesJSON = {}

    //Cria a função DAO para retornar os dados do BD
    let dadosNacionalidades = await nacionalidadesDAO.selectAllNacionalidades()

    //Validação para criar o JSON de dados
    if (dadosNacionalidades) {
        if (dadosNacionalidades.length > 0) {
            nacionalidadesJSON.nacionalidades = dadosNacionalidades
            nacionalidadesJSON.quantidade = dadosNacionalidades.length
            nacionalidadesJSON.status_code = 200

            return nacionalidadesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

//Função para retornar filtro do nacionalidade pelo ID
const getBuscarNacionalidade = async (id) => {

    let idNacionalidade = id

    let nacionalidadeJSON = {}

    if (idNacionalidade == '' || idNacionalidade == undefined || isNaN(idNacionalidade)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosNacionalidade = await nacionalidadesDAO.selectByIdNacionalidade(idNacionalidade)

        if (dadosNacionalidade) {

            if (dadosNacionalidade.length > 0) {
                nacionalidadeJSON.nacionalidade = dadosNacionalidade
                nacionalidadeJSON.status_code = 200

                return nacionalidadeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


const getBuscarNomeNacionalidade = async (nome) => {

    let nomeNacionalidade = nome

    let nacionalidadeJSON = {}

    if (nomeNacionalidade == '' || nomeNacionalidade == undefined) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosNacionalidade = await nacionalidadesDAO.selectByNomeNacionalidade(nomeNacionalidade)

        if (dadosNacionalidade) {

            if (dadosNacionalidade.length > 0) {

                nacionalidadeJSON.nacionalidade = dadosNacionalidade
                nacionalidadeJSON.status_code = 200

                return nacionalidadeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaNacionalidade,
    setAtualizarNacionalidade,
    setExcluirNacionalidade,
    getListarNacionalidades,
    getBuscarNacionalidade,
    getBuscarNomeNacionalidade
}