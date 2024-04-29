const sexoDAO = require('../model/DAO/sexo.js')

const message = require('../modulo/config.js')

// Função para retornar todas as classificações do banco de dados
const getListarSexo = async () => {
    // Cria o objeto JSON
    let sexoJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosSexo = await sexoDAO.selectAllSexos()

    // Validação para criar o JSON de dados
    if (dadosSexo) {
        if (dadosSexo.length > 0) {
            sexoJSON.sexo = dadosSexo
            sexoJSON.quantidade = dadosSexo.length
            sexoJSON.status_code = 200

            return sexoJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

// Função para buscar uma classificação pelo ID
const getBuscarSexo= async (id) => {
    let idSexo = id
    let sexoJSON = {}

    if (idSexo == '' || idSexo == undefined || isNaN(idSexo)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosSexo = await sexoDAO.selectSexoById(idSexo)

        if (dadosSexo) {
            if (dadosSexo.length > 0) {
                sexoJSON.sexo= dadosSexo
                sexoJSON.status_code = 200

                return sexoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    getListarSexo,
    getBuscarSexo
}