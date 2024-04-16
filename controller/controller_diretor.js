// Import do arquivo DAO para manipular dados dos diretores
const diretoresDAO = require('../model/DAO/diretor.js')

//Função para retornar todos os diretores do database
const getListarDiretores = async () => {

    //Cria o objeto JSON
    let diretoresJSON = {}

    //Cria a função DAO para retornar os dados do BD
    let dadosDiretores = await diretoresDAO.selectAllDiretores()

    //Validação para criar o JSON de dados
    if (dadosDiretores) {
        if (dadosDiretores.length > 0) {
            diretoresJSON.diretores = dadosDiretores
            diretoresJSON.quantidade = dadosDiretores.length
            diretoresJSON.status_code = 200

            return diretoresJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}



module.exports = {
    getListarDiretores
}