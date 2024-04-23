// Import do arquivo DAO para manipular dados das classificações
const classificacoesDAO = require('../model/DAO/classificacao.js')

const message = require('../modulo/config.js')


// Função para inserir uma nova classificação no banco de dados
const setInserirNovaClassificacao = async (dadosClassificacao, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaClassificacaoJSON = {}

            if (
                dadosClassificacao.nome == '' || dadosClassificacao.nome == undefined || dadosClassificacao.nome == null || dadosClassificacao.nome.length > 45 ||
                dadosClassificacao.sigla == '' || dadosClassificacao.sigla == undefined || dadosClassificacao.sigla == null || dadosClassificacao.sigla.length > 2 ||
                dadosClassificacao.descricao == '' || dadosClassificacao.descricao == undefined || dadosClassificacao.descricao == null || dadosClassificacao.descricao.length > 300 ||   
                dadosClassificacao.icone == '' || dadosClassificacao.icone == undefined || dadosClassificacao.icone == null || dadosClassificacao.icone.length > 150
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaClassificacao = await classificacoesDAO.insertClassificacao(dadosClassificacao)

                if (novaClassificacao) {
                    let id = await classificacoesDAO.selectId()
                    novaClassificacaoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaClassificacaoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaClassificacaoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaClassificacaoJSON.id = parseInt(id)
                    novaClassificacaoJSON.nome = dadosClassificacao

                    return novaClassificacaoJSON // 201
                } else {
                    console.log("Erro interno do servidor ao inserir classificação no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

// Função para atualizar uma classificação no banco de dados
const setAtualizarClassificacao = async (dadosClassificacao, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateClassificacaoJSON = {}

            if (
                dadosClassificacao.nome == '' || dadosClassificacao.nome == undefined || dadosClassificacao.nome == null || dadosClassificacao.nome.length > 45 ||
                dadosClassificacao.sigla == '' || dadosClassificacao.sigla == undefined || dadosClassificacao.sigla == null || dadosClassificacao.sigla.length > 2 ||
                dadosClassificacao.descricao == '' || dadosClassificacao.descricao == undefined || dadosClassificacao.descricao == null || dadosClassificacao.descricao.length > 300 ||
                dadosClassificacao.icone == '' || dadosClassificacao.icone == undefined || dadosClassificacao.icone == null || dadosClassificacao.icone.length > 150
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let classificacaoAtualizada = await classificacoesDAO.updateClassificacao(id, dadosClassificacao)

                if (classificacaoAtualizada) {
                    let updatedClassificacao = await classificacoesDAO.selectByIdClassificacao(id) // Recupera a classificação atualizada do banco de dados
                    let updatedId = updatedClassificacao[0].id // Extrai o id da classificação atualizada

                    // Constrói o JSON de resposta com o id atualizado
                    updateClassificacaoJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateClassificacaoJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateClassificacaoJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateClassificacaoJSON.id = updatedId // Usa o id atualizado aqui
                    updateClassificacaoJSON.nome = dadosClassificacao

                    return updateClassificacaoJSON // Retorna a resposta JSON atualizada
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
const setExcluirClassificacao = async (id) => {

    try {

        let idClassificacao = id

        let validaClassificacao = await getBuscarClassificacao(idClassificacao)

        let dadosClassificacao = await classificacoesDAO.deleteClassificacao(idClassificacao)

        if (idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaClassificacao.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            if (dadosClassificacao) {
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
const getListarClassificacoes = async () => {
    // Cria o objeto JSON
    let classificacoesJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosClassificacoes = await classificacoesDAO.selectAllClassificacoes()

    // Validação para criar o JSON de dados
    if (dadosClassificacoes) {
        if (dadosClassificacoes.length > 0) {
            classificacoesJSON.classificacoes = dadosClassificacoes
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

// Função para buscar uma classificação pelo ID
const getBuscarClassificacao = async (id) => {
    let idClassificacao = id
    let classificacaoJSON = {}

    if (idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosClassificacao = await classificacoesDAO.selectByIdClassificacao(idClassificacao)

        if (dadosClassificacao) {
            if (dadosClassificacao.length > 0) {
                classificacaoJSON.classificacao = dadosClassificacao
                classificacaoJSON.status_code = 200

                return classificacaoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

const getBuscarNomeClassificacao = async (nome) => {

    let nomeClassificacao = nome

    let classificacaoJSON = {}

    if (nomeClassificacao == '' || nomeClassificacao == undefined) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosClassificacao = await classificacoesDAO.selectByNomeClassificacao(nomeClassificacao)

        if (dadosClassificacao) {

            if (dadosClassificacao.length > 0) {

                classificacaoJSON.classificacao = dadosClassificacao
                classificacaoJSON.status_code = 200

                return classificacaoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaClassificacao,
    setAtualizarClassificacao,
    setExcluirClassificacao,
    getListarClassificacoes,
    getBuscarClassificacao,
    getBuscarNomeClassificacao
}
