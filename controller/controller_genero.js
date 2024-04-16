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
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }
                }

            }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

//Função para retornar todos os atores do database
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



module.exports = {
    setInserirNovoGenero,
    getListarGeneros
}