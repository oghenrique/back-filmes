// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir uma classificação no Banco de Dados
const insertNacionalidadeDiretor = async (dadosNacionalidadeDiretor) => {
    try {
        let sql = `insert into tbl_nacionalidade_diretor (
                                                    id_diretor, 
                                                    id_nacionalidade
                                                    ) values (
                                                              '${dadosNacionalidadeDiretor.id_diretor}', 
                                                              '${dadosNacionalidadeDiretor.id_nacionalidade}'
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
        let sql = 'select CAST(id as DECIMAL) as id FROM tbl_nacionalidade_diretor order by id desc limit 1'
        
        let rsNacionalidadeDiretores = await prisma.$queryRawUnsafe(sql)

        if (rsNacionalidadeDiretores.length > 0) {
            return rsNacionalidadeDiretores[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar uma classificação
const updateNacionalidadeDiretor = async (idNacionalidadeDiretor, dadosNacionalidadeDiretor) => {

    let sql

    try {
            sql = `update tbl_nacionalidade_diretor set 
                                                    id_diretor = '${dadosNacionalidadeDiretor.id_diretor}', 
                                                    id_nacionalidade = '${dadosNacionalidadeDiretor.id_nacionalidade}'
                                                    where id = ${idNacionalidadeDiretor}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

// Função para deletar uma classificação no Banco de Dados
const deleteNacionalidadeDiretor = async (id) => {

    try {

        let sql = `delete from tbl_nacionalidade_diretor where id = ${id}`

        let rsNacionalidadeDiretores = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidadeDiretores

    } catch (error) {
        return false
    }
}

// Função para selecionar uma classificação pelo ID
const selectByIdNacionalidadeDiretor = async (id) => {

    try {

        let sql = `select * from tbl_nacionalidade_diretor where id = ${id}`
        
        let rsNacionalidadeDiretores = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidadeDiretores

    } catch (error) {
        return false
    }
}

// Função para selecionar todas as classificações
const selectAllNacionalidadeDiretores = async () => {

    try {

        let sql = 'select * from tbl_nacionalidade_diretor'
        
        let rsNacionalidadeDiretores = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidadeDiretores

    } catch (error) {
        return false
    }
}


module.exports = {
    insertNacionalidadeDiretor,
    selectId,
    updateNacionalidadeDiretor,
    deleteNacionalidadeDiretor,
    selectAllNacionalidadeDiretores,
    selectByIdNacionalidadeDiretor
}
