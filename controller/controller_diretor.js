// Import do arquivo DAO para manipular dados dos atores
const diretoresDAO = require('../model/DAO/diretor.js')

//Import do arquivo de configuração do Projeto
const message = require('../modulo/config.js')

//Função para inserir um novo atore
const setInserirNovoDiretor = async (dadosDiretor, contentType) => {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let statusValidated = false
            let novoDiretorJSON = {}

            if (dadosDiretor.nome_completo == '' || dadosDiretor.nome_completo == undefined || dadosDiretor.nome_completo == null || dadosDiretor.nome_completo.length > 100 ||
                dadosDiretor.nome_artistico == '' || dadosDiretor.nome_artistico == undefined || dadosDiretor.nome_artistico.length > 100 || dadosDiretor.biografia == '' ||
                dadosDiretor.biografia == undefined || dadosDiretor.biografia == null || dadosDiretor.data_nascimento == '' ||
                dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length != 10 ||
                dadosDiretor.foto == '' || dadosDiretor.foto == undefined || dadosDiretor.foto == null || dadosDiretor.foto.length > 150 ||
                dadosDiretor.id_sexo == undefined || isNaN(dadosDiretor.id_sexo) || dadosDiretor.id_sexo == null || 
                dadosDiretor.id_nacionalidade == undefined || isNaN(dadosDiretor.id_nacionalidade) || dadosDiretor.id_nacionalidade == null 


            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {

                //Validação para verificar se a data de relancameno tem um conteúdo válido
                if (dadosDiretor.data_falecimento != '' &&
                    dadosDiretor.data_falecimento != null &&
                    dadosDiretor.data_falecimento != undefined

                ) {
                    //Verifica a qtde de caracter
                    if (dadosDiretor.data_falecimento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS//400
                    } else {
                        statusValidated = true //validação para liberar a inserção dos dados no DAO
                    }

                } else {
                    statusValidated = true  //validação para liberar a inserção dos dados no DAO
                }

                //se a variável for verdadeira, podemos encaminhar os dados para o DAO
                if (statusValidated) {

                    //encaminha os dados para o DAO inserir
                    let novoDiretor = await diretoresDAO.insertDiretor(dadosDiretor, dadosDiretor.id_nacionalidade)

                    if (novoDiretor) {

                        let id = await diretoresDAO.selectId()

                        //Cria o JSON de retorno com informações de requisição e os dados novos
                        novoDiretorJSON.status = message.SUCESS_CREATED_ITEM.status
                        novoDiretorJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                        novoDiretorJSON.message = message.SUCESS_CREATED_ITEM.message
                        novoDiretorJSON.id = parseInt(id)
                        novoDiretorJSON.diretor = dadosDiretor

                        return novoDiretorJSON //201

                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }
                }

            }

        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }

}

const setAtualizarDiretor = async (dadosDiretor, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let statusValidated = false
            let updateDiretorJSON = {}

            if (dadosDiretor.nome_completo == '' || dadosDiretor.nome_completo == undefined || dadosDiretor.nome_completo == null || dadosDiretor.nome_completo.length > 100 ||
                dadosDiretor.nome_artistico == '' || dadosDiretor.nome_artistico == undefined || dadosDiretor.nome_artistico.length > 100 || dadosDiretor.biografia == '' ||
                dadosDiretor.biografia == undefined || dadosDiretor.biografia == null || dadosDiretor.data_nascimento == '' ||
                dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length != 10 ||
                dadosDiretor.foto == '' || dadosDiretor.foto == undefined || dadosDiretor.foto == null || dadosDiretor.foto.length > 150 ||
                dadosDiretor.id_sexo == undefined || isNaN(dadosDiretor.id_sexo) || dadosDiretor.id_sexo == null

            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {

                //Validação para verificar se a data de relancameno tem um conteúdo válido
                if (dadosDiretor.data_falecimento != '' &&
                    dadosDiretor.data_falecimento != null &&
                    dadosDiretor.data_falecimento != undefined) {
                    //Verifica a qtde de caracter
                    if (dadosDiretor.data_falecimento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS//400
                    } else {
                        statusValidated = true //validação para liberar a inserção dos dados no DAO
                    }

                } else {
                    statusValidated = true  //validação para liberar a inserção dos dados no DAO
                }

                //se a variável for verdadeira, podemos encaminhar os dados para o DAO
                if (statusValidated) {

                    //encaminha os dados para o DAO inserir
                    let diretorAtualizado = await diretoresDAO.updateDiretor(id, dadosDiretor)

                    if (diretorAtualizado) {
                        let updatedDiretor = await diretoresDAO.selectByIdDiretor(id) // Recupera o atore atualizado do banco de dados
                        let updatedId = updatedDiretor[0].id // Extrai o id do atore atualizado

                        // Constrói o JSON de resposta com o id atualizado
                        updateDiretorJSON.status = message.SUCESS_UPDATE_ITEM.status
                        updateDiretorJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                        updateDiretorJSON.message = message.SUCESS_UPDATE_ITEM.message
                        updateDiretorJSON.id = updatedId // Usa o id atualizado aqui
                        updateDiretorJSON.diretor = dadosDiretor

                        return updateDiretorJSON // Retorna a resposta JSON atualizada
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                }

            }

        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }

}

const setExcluirDiretor = async (id) => {

    try {

        let idDiretor = id

        let validaDiretor = await getBuscarDiretor(idDiretor)

        let dadosDiretor = await diretoresDAO.deleteDiretor(idDiretor)

        if (idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)) {

            return message.ERROR_INVALID_ID //400

        } else if(validaDiretor.status == false){
            return message.ERROR_NOT_FOUND

        } else {
            
            if(dadosDiretor)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

//Função para retornar todos os atores do database
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

const getBuscarDiretor = async (id) => {

    let idDiretor = id

    let diretorJSON = {}

    //Validação para verificar o ID do atore antes de encaminhar para o DAO
    if (idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)) {
        return message.ERROR_INVALID_ID
    } else {

        //Encaminha o ID do atore para o DAO para o retorno do Banco de Dados
        let dadosDiretor = await diretoresDAO.selectByIdDiretor(idDiretor)

        //Validação para verificar se o DAO retornou dados
        if (dadosDiretor) {

            if (dadosDiretor.length > 0) {
                //Cria o JSON de retorno de dados
                diretorJSON.diretor = dadosDiretor
                diretorJSON.status_code = 200

                return diretorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

const getBuscarNomeCompletoDiretor = async (nome) => {

    let nomeCompleto = nome

    let diretorJSON = {}

    if (nomeCompleto == '' || nomeCompleto == undefined) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosDiretor = await diretoresDAO.selectByNomeCompletoDiretor(nomeCompleto)

        if (dadosDiretor) {

            if (dadosDiretor.length > 0) {

                diretorJSON.diretor = dadosDiretor
                diretorJSON.status_code = 200

                return diretorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

const getBuscarNomeArtisticoDiretor = async (nome) => {

    let nomeArtistico = nome

    let diretorJSON = {}

    if (nomeArtistico == '' || nomeArtistico == undefined) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosDiretor = await diretoresDAO.selectByNomeArtisticoDiretor(nomeArtistico)

        if (dadosDiretor) {

            if (dadosDiretor.length > 0) {

                diretorJSON.diretor = dadosDiretor
                diretorJSON.status_code = 200

                return diretorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoDiretor,
    setAtualizarDiretor,
    setExcluirDiretor,
    getListarDiretores,
    getBuscarDiretor,
    getBuscarNomeCompletoDiretor,
    getBuscarNomeArtisticoDiretor
}