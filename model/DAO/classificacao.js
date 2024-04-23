// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir uma classificação no Banco de Dados
const insertClassificacao = async (dadosClassificacao) => {
    try {
        let sql = `insert into tbl_classificacao (nome, 
                                                    sigla, 
                                                    descricao, 
                                                    icone
                                                    ) values (
                                                              '${dadosClassificacao.nome}', 
                                                              '${dadosClassificacao.sigla}', 
                                                              '${dadosClassificacao.descricao}',
                                                              '${dadosClassificacao.icone}'
                                                              )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        return false
    }
}

// Função para selecionar o último ID de classificação
const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM tbl_classificacao order by id desc limit 1'
        
        let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

        if (rsClassificacoes.length > 0) {
            return rsClassificacoes[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar uma classificação
const updateClassificacao = async (idClassificacao, dadosClassificacao) => {

    let sql

    try {
            sql = `update tbl_classificacao set 
                                                    nome = '${dadosClassificacao.nome}', 
                                                    sigla = '${dadosClassificacao.sigla}', 
                                                    descricao = '${dadosClassificacao.descricao}', 
                                                    icone = '${dadosClassificacao.icone}' 
                                                    where id = ${idClassificacao}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

// Função para deletar uma classificação no Banco de Dados
const deleteClassificacao = async (id) => {

    try {

        let sql = `delete from tbl_classificacao where id = ${id}`

        let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

        return rsClassificacoes

    } catch (error) {
        return false
    }
}

// Função para selecionar uma classificação pelo ID
const selectByIdClassificacao = async (id) => {

    try {

        let sql = `select * from tbl_classificacao where id = ${id}`
        
        let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

        return rsClassificacoes

    } catch (error) {
        return false
    }
}

// Função para selecionar todas as classificações
const selectAllClassificacoes = async () => {

    try {

        let sql = 'select * from tbl_classificacao'
        
        let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

        return rsClassificacoes

    } catch (error) {
        return false
    }
}

// Função para selecionar uma classificação pelo nome
const selectByNomeClassificacao = async (nome) => {

    try {

        let sql = `select * from tbl_classificacao where nome like '%${nome}%'`
        
        let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

        return rsClassificacoes

    } catch (error) {
        return false
    }
}

module.exports = {
    insertClassificacao,
    selectId,
    updateClassificacao,
    deleteClassificacao,
    selectAllClassificacoes,
    selectByIdClassificacao,
    selectByNomeClassificacao
}
