/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar validações, consistencias e regra de negócio para os filmes *
 * Data: 30/01/2024                                                                                       *
 * Autor: Gustavo Henrique                                                                                *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import do arquivo de configuração do Projeto
const message = require('../modulo/config.js')

//import do arquivo DAO para manipular dados dos filmes 
const filmesDAO = require('../model/DAO/filme.js')
const classificacaoDAO = require('../model/DAO/classificacao.js')
const filmeAtorDAO = require('../model/DAO/filme_ator.js')
const atorDAO = require('../model/DAO/ator.js')
const filmeDiretorDAO = require('../model/DAO/filme_diretor.js')
const generoDAO = require('../model/DAO/genero.js')
const filmeGeneroDAO = require('../model/DAO/filme_genero.js')
const diretorDAO = require('../model/DAO/diretor.js')
const controllerGeneros = require('../controller/controller_filme_genero.js')

//Função para inserir um novo filme
const setInserirNovoFilme = async (dadosFilme, contentType) => {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let statusValidated = false
            let novoFilmeJSON = {}

            // Verifica se os campos obrigatórios estão presentes e válidos
            if (
                dadosFilme.titulo == '' || dadosFilme.titulo == undefined || dadosFilme.titulo == null || dadosFilme.titulo.length > 80 ||
                dadosFilme.sinopse == '' || dadosFilme.sinopse == undefined || dadosFilme.titulo == null || dadosFilme.sinopse > 65000 ||
                dadosFilme.duracao == '' || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao > 9 ||
                dadosFilme.data_lancamento == '' || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length !== 10 ||
                dadosFilme.foto_capa == '' || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
                dadosFilme.valor_unitario.length > 8 || isNaN(dadosFilme.valor_unitario) || dadosFilme.id_classificacao == undefined || isNaN(dadosFilme.id_classificacao) ||
                dadosFilme.id_classificacao == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            // Validação para verificar se a data de relançamento tem um conteúdo válido
            if (dadosFilme.data_relancamento !== '' && dadosFilme.data_relancamento !== null && dadosFilme.data_relancamento !== undefined) {
                // Verifica o formato da data
                if (dadosFilme.data_relancamento.length !== 10) {
                    return message.ERROR_REQUIRED_FIELDS // 400
                }
            }

            statusValidated = true // Validação para liberar a inserção dos dados no DAO

            // Se a variável for verdadeira, podemos encaminhar os dados para o DAO
            if (statusValidated) {
                // Encaminha os dados para o DAO inserir
                let novoFilme = await filmesDAO.insertFilme(dadosFilme)

                if (novoFilme) {
                    let id = await filmesDAO.selectId()

                    // Cria o JSON de retorno com informações de requisição e os dados novos
                    novoFilmeJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoFilmeJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoFilmeJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoFilmeJSON.id = parseInt(id)
                    novoFilmeJSON.filme = dadosFilme

                    return novoFilmeJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

//Função para atualizar um filme existente
const setAtualizarFilme = async (dadosFilme, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let statusValidated = false
            let updateFilmeJSON = {}

            if (dadosFilme.titulo == '' || dadosFilme.titulo == undefined || dadosFilme.titulo == null || dadosFilme.titulo.length > 80 ||
                dadosFilme.sinopse == '' || dadosFilme.sinopse == undefined || dadosFilme.titulo == null || dadosFilme.sinopse > 65000 ||
                dadosFilme.duracao == '' || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao > 9 ||
                dadosFilme.data_lancamento == '' || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                dadosFilme.foto_capa == '' || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
                dadosFilme.valor_unitario.length > 8 || isNaN(dadosFilme.valor_unitario) || dadosFilme.id_classificacao == undefined || isNaN(dadosFilme.id_classificacao) ||
                dadosFilme.id_classificacao == null

            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {

                //Validação para verificar se a data de relancameno tem um conteúdo válido
                if (dadosFilme.data_relancamento != '' &&
                    dadosFilme.data_relancamento != null &&
                    dadosFilme.data_relancamento != undefined) {
                    //Verifica a qtde de caracter
                    if (dadosFilme.data_relancamento.length != 10) {
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
                    let filmeAtualizado = await filmesDAO.updateFilme(id, dadosFilme)

                    if (filmeAtualizado) {
                        let updatedFilm = await filmesDAO.selectByIdFilme(id) // Recupera o filme atualizado do banco de dados
                        let updatedId = updatedFilm[0].id // Extrai o id do filme atualizado

                        // Constrói o JSON de resposta com o id atualizado
                        updateFilmeJSON.status = message.SUCESS_UPDATE_ITEM.status
                        updateFilmeJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                        updateFilmeJSON.message = message.SUCESS_UPDATE_ITEM.message
                        updateFilmeJSON.id = updatedId // Usa o id atualizado aqui
                        updateFilmeJSON.filme = dadosFilme

                        return updateFilmeJSON // Retorna a resposta JSON atualizada
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

//Função para excluir um Filme existente
const setExcluirFilme = async (id) => {

    try {

        let idFilme = id

        let validaFilme = await getBuscarFilme(idFilme)

        let dadosFilme = await filmesDAO.deleteFilme(idFilme)

        if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaFilme.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosFilme)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

//Função para retornar todos os filmes do database
const getListarFilmes = async () => {

    let filmesJSON = {}

    let dadosFilmes = await filmesDAO.selectAllFilmes()

    if (dadosFilmes) {
        if (dadosFilmes.length > 0) {

            let filmeComClassificacao = await Promise.all(dadosFilmes.map(async (filme) => {
                // Obter classificação do filme
                let classificacaoFilme = await classificacaoDAO.selectByIdClassificacao(filme.id_classificacao)
                delete filme.id_classificacao
                filme.classificacao = classificacaoFilme
                        
                // Obter diretores do filme
                let filmesDiretor = await filmeDiretorDAO.selectByIdFilmeDiretor(filme.id)
                if (filmesDiretor) {
                    filme.diretores = await Promise.all(filmesDiretor.map(async (filmeDiretor) => {
                        const diretor = await diretorDAO.selectByIdDiretor(filmeDiretor.id_diretor)
                        return diretor
                    }))
                }

                // Obter atores do filme
                let filmesAtor = await filmeAtorDAO.selectByIdFilmeAtor(filme.id)
                if (filmesAtor) {
                    filme.atores = await Promise.all(filmesAtor.map(async (filmeAtor) => {
                        const ator = await atorDAO.selectByIdAtor(filmeAtor.id_ator)
                        return ator
                    }))
                }
            
                // Obter gêneros do filme
                let generos = await filmeGeneroDAO.selectByIdFilmeGenero(filme.id)
                if (generos) {
                    filme.generos = await Promise.all(generos.map(async (generoItem) => {
                        const genero = await generoDAO.selectByIdGenero(generoItem.id_genero)
                        return genero
                    }))
                }
            
                return filme
            }))
            

            filmesJSON.filmes = filmeComClassificacao
            filmesJSON.quantidade = filmeComClassificacao.length
            filmesJSON.status_code = 200

            return filmesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}


//Função para retornar filtro do filme pelo ID
const getBuscarFilme = async (id) => {

    let idFilme = id

    let filmeJSON = {}

    //Validação para verificar o ID do Filme antes de encaminhar para o DAO
    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID_ID
    } else {

        //Encaminha o ID do filme para o DAO para o retorno do Banco de Dados
        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)

        //Validação para verificar se o DAO retornou dados
        if (dadosFilme) {

            if (dadosFilme.length > 0) {

                let filmeComClassificacao = await Promise.all(dadosFilme.map(async (filme) => {
                    let classificacaoFilme = await classificacaoDAO.selectByIdClassificacao(filme.id_classificacao)
                    delete filme.id_classificacao
                    filme.classificacao = classificacaoFilme

                    let filmesAtor = await filmeAtorDAO.selectByIdFilmeAtor(filme.id)
                    if (filmesAtor) {
                        filme.atores = await Promise.all(filmesAtor.map(async (filmeAtor) => {
                            const ator = await atorDAO.selectByIdAtor(filmeAtor.id_ator)
                            return ator
                        }))

                        let filmesDiretor = await filmeDiretorDAO.selectByIdFilmeDiretor(filme.id)
                        if (filmesDiretor) {
                            filme.diretores = await Promise.all(filmesDiretor.map(async (filmeDiretor) => {
                                const diretor = await diretorDAO.selectByIdDiretor(filmeDiretor.id_diretor)
                                return diretor
                            }))

                            let filmesGenero = await filmeGeneroDAO.selectByIdFilmeGenero(filme.id)
                            if (filmesGenero) {
                                filme.generos = await Promise.all(filmesGenero.map(async (filmeGenero) => {
                                    const genero = await generoDAO.selectByIdGenero(filmeGenero.id_genero)
                                    return genero
                                }))
                            }
                        }

                    }

                    return filme
                }))

                filmeJSON.filme = filmeComClassificacao
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

//Função para retornar filtro do filme pelo nome
const getBuscarNomeFilme = async (titulo) => {

    let nomeFilme = titulo

    let filmeJSON = {}

    if (nomeFilme == '' || nomeFilme == undefined) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosFilme = await filmesDAO.selectByNomeFilme(nomeFilme)

        if (dadosFilme) {

            if (dadosFilme.length > 0) {

                let filmeComClassificacao = await Promise.all(dadosFilme.map(async (filme) => {
                    let classificacaoFilme = await classificacaoDAO.selectByIdClassificacao(filme.id_classificacao)
                    delete filme.id_classificacao
                    filme.classificacao = classificacaoFilme

                    let filmesAtor = await filmeAtorDAO.selectByIdFilmeAtor(filme.id)
                    if (filmesAtor) {
                        filme.atores = await Promise.all(filmesAtor.map(async (filmeAtor) => {
                            const ator = await atorDAO.selectByIdAtor(filmeAtor.id_ator)
                            return ator
                        }))

                        let filmesDiretor = await filmeDiretorDAO.selectByIdFilmeDiretor(filme.id)
                        if (filmesDiretor) {
                            filme.diretores = await Promise.all(filmesDiretor.map(async (filmeDiretor) => {
                                const diretor = await diretorDAO.selectByIdDiretor(filmeDiretor.id_diretor)
                                return diretor
                            }))

                            let filmesGenero = await filmeGeneroDAO.selectByIdFilmeGenero(filme.id)
                            if (filmesGenero) {
                                filme.generos = await Promise.all(filmesGenero.map(async (filmeGenero) => {
                                    const genero = await generoDAO.selectByIdGenero(filmeGenero.id_genero)
                                    return genero
                                }))
                            }
                        }

                    }

                    return filme
                }))

                filmeJSON.filme = filmeComClassificacao
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

const getBuscarPorClassificacao = async (idClassificacao) => {

    let filmeJSON = {}

    if (!idClassificacao) {
        return message.ERROR_NOT_FOUND
    } else {

        let dadosFilme = await filmesDAO.selectByClassificacao(idClassificacao)

        if (dadosFilme) {

            if (dadosFilme.length > 0) {

                let filmeComClassificacao = await Promise.all(dadosFilme.map(async (filme) => {
                    let classificacaoFilme = await classificacaoDAO.selectByIdClassificacao(filme.id_classificacao)
                    delete filme.id_classificacao
                    filme.classificacao = classificacaoFilme

                    let filmesAtor = await filmeAtorDAO.selectByIdFilmeAtor(filme.id)
                    if (filmesAtor) {
                        filme.atores = await Promise.all(filmesAtor.map(async (filmeAtor) => {
                            const ator = await atorDAO.selectByIdAtor(filmeAtor.id_ator)
                            return ator
                        }))

                        let filmesDiretor = await filmeDiretorDAO.selectByIdFilmeDiretor(filme.id)
                        if (filmesDiretor) {
                            filme.diretores = await Promise.all(filmesDiretor.map(async (filmeDiretor) => {
                                const diretor = await diretorDAO.selectByIdDiretor(filmeDiretor.id_diretor)
                                return diretor
                            }))

                            let filmesGenero = await filmeGeneroDAO.selectByIdFilmeGenero(filme.id)
                            if (filmesGenero) {
                                filme.generos = await Promise.all(filmesGenero.map(async (filmeGenero) => {
                                    const genero = await generoDAO.selectByIdGenero(filmeGenero.id_genero)
                                    return genero
                                }))
                            }
                        }

                    }

                    return filme
                }))

                filmeJSON.filme = filmeComClassificacao
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}



module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarNomeFilme,
    getBuscarPorClassificacao
}