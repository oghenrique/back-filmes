// Import do arquivo DAO para manipular dados dos atores
const atoresDAO = require('../model/DAO/ator.js')

//Função para retornar todos os atores do database
const getListarAtores = async () => {

    //Cria o objeto JSON
    let atoresJSON = {}

    //Cria a função DAO para retornar os dados do BD
    let dadosAtores = await atoresDAO.selectAllAtores()

    //Validação para criar o JSON de dados
    if (dadosAtores) {
        if (dadosAtores.length > 0) {
            atoresJSON.atores = dadosAtores
            atoresJSON.quantidade = dadosAtores.length
            atoresJSON.status_code = 200

            return atoresJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}



module.exports = {
    getListarAtores
}