// Import do arquivo DAO para manipular dados dos classificação
const classificacoesDAO = require('../model/DAO/classificao.js')

//Função para retornar todos os atores do database
const getListarClassificacoes = async () => {

    //Cria o objeto JSON
    let classificacoesJSON = {}

    //Cria a função DAO para retornar os dados do BD
    let dadosClassificacoes = await classificacoesDAO.selectAllClassificacoes()

    //Validação para criar o JSON de dados
    if (dadosClassificacoes) {
        if (dadosClassificacoes.length > 0) {
            classificacoesJSON.atores = dadosClassificacoes
            classificacoesJSON.quantidade = dadosClassificacoes.length
            classificacoesJSON.status_code = 200

            return classificacoesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}



module.exports = {
    getListarClassificacoes
}