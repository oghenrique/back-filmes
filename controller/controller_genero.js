// Import do arquivo DAO para manipular dados dos generos
const generosDAO = require('../model/DAO/genero.js')

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
    getListarGeneros
}