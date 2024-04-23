// Import do arquivo DAO para manipular dados dos generos
const generosDAO = require('../model/DAO/genero.js')

const message = require('../modulo/config.js')

const setInserirNovoGenero = async (dadosGenero, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoGeneroJSON = {}

            if (
                dadosGenero.nome == '' || dadosGenero.nome == undefined || dadosGenero.nome == null || dadosGenero.nome.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                //encaminha os dados para o DAO inserir
                let novoGenero = await generosDAO.insertGenero(dadosGenero)

                if (novoGenero) {

                    let id = await generosDAO.selectId()

                    //Cria o JSON de retorno com informações de requisição e os dados novos
                    novoGeneroJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoGeneroJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoGeneroJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoGeneroJSON.id = parseInt(id)
                    novoGeneroJSON.nome = dadosGenero

                    return novoGeneroJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir gênero no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setAtualizarGenero = async (dadosGenero, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateGeneroJSON = {}

            if (
                dadosGenero.nome == '' || dadosGenero.nome == undefined || dadosGenero.nome == null || dadosGenero.nome.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                //encaminha os dados para o DAO inserir
                let generoAtualizado = await generosDAO.updateGenero(id, dadosGenero)

                if (generoAtualizado) {
                    let updatedGenero = await generosDAO.selectByIdGenero(id) // Recupera o filme atualizado do banco de dados
                    let updatedId = updatedGenero[0].id // Extrai o id do filme atualizado

                    // Constrói o JSON de resposta com o id atualizado
                    updateGeneroJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateGeneroJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateGeneroJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateGeneroJSON.id = updatedId // Usa o id atualizado aqui
                    updateGeneroJSON.nome = dadosGenero

                    return updateGeneroJSON // Retorna a resposta JSON atualizada

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirGenero = async (id) => {

    try {

        let idGenero = id

        let validaGenero = await getBuscarGenero(idGenero)

        let dadosGenero = await generosDAO.deleteGenero(idGenero)

        if (idGenero == '' || idGenero == undefined || isNaN(idGenero)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaGenero.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosGenero)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

//Função para retornar todos os generos do database
const getListarGeneros = async () => {

    //Cria o objeto JSON
    let generosJSON = {}

    //Cria a função DAO para retornar os dados do BD
    let dadosGeneros = await generosDAO.selectAllGeneros()

    //Validação para criar o JSON de dados
    if (dadosGeneros) {
        if (dadosGeneros.length > 0) {
            generosJSON.atores = dadosGeneros
            generosJSON.quantidade = dadosGeneros.length
            generosJSON.status_code = 200

            return generosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

//Função para retornar filtro do genero pelo ID
const getBuscarGenero = async (id) => {

    let idGenero = id

    let generoJSON = {}

    if (idGenero == '' || idGenero == undefined || isNaN(idGenero)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosGenero = await generosDAO.selectByIdGenero(idGenero)

        if (dadosGenero) {

            if (dadosGenero.length > 0) {
                generoJSON.genero = dadosGenero
                generoJSON.status_code = 200

                return generoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


const getBuscarNomeGenero = async (nome) => {

    let nomeGenero = nome

    let generoJSON = {}

    if (nomeGenero == '' || nomeGenero == undefined) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosGenero = await generosDAO.selectByNomeGenero(nomeGenero)

        if (dadosGenero) {

            if (dadosGenero.length > 0) {

                generoJSON.genero = dadosGenero
                generoJSON.status_code = 200

                return generoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoGenero,
    setAtualizarGenero,
    setExcluirGenero,
    getListarGeneros,
    getBuscarGenero,
    getBuscarNomeGenero
}