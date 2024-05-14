// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir uma classificação no Banco de Dados
const insertNacionalidadeAtor = async (dadosNacionalidadeAtor) => {
    try {
        let sql = `insert into tbl_nacionalidade_ator (
                                                    id_ator, 
                                                    id_nacionalidade
                                                    ) values (
                                                              '${dadosNacionalidadeAtor.id_ator}', 
                                                              '${dadosNacionalidadeAtor.id_nacionalidade}'
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
        let sql = 'select CAST(id as DECIMAL) as id FROM tbl_nacionalidade_ator order by id desc limit 1'
        
        let rsNacionalidadeAtores = await prisma.$queryRawUnsafe(sql)

        if (rsNacionalidadeAtores.length > 0) {
            return rsNacionalidadeAtores[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar uma classificação
const updateNacionalidadeAtor = async (idNacionalidadeAtor, dadosNacionalidadeAtor) => {

    let sql

    try {
            sql = `update tbl_nacionalidade_ator set 
                                                    id_ator = '${dadosNacionalidadeAtor.id_ator}', 
                                                    id_nacionalidade = '${dadosNacionalidadeAtor.id_nacionalidade}'
                                                    where id = ${idNacionalidadeAtor}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

// Função para deletar uma classificação no Banco de Dados
const deleteNacionalidadeAtor = async (id) => {

    try {

        let sql = `delete from tbl_nacionalidade_ator where id = ${id}`

        let rsNacionalidadeAtores = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidadeAtores

    } catch (error) {
        return false
    }
}

const selectByIdNacionalidadeAtor = async (idAtor) => {
    try {
        let sql = `SELECT * FROM tbl_nacionalidade_ator WHERE id_ator = ${idAtor}`
        
        let rsNacionalidadeAtores = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidadeAtores

    } catch (error) {
        return false
    }
}

// Função para selecionar todas as classificações
const selectAllNacionalidadeAtores = async () => {

    try {

        let sql = 'select * from tbl_nacionalidade_ator'
        
        let rsNacionalidadeAtores = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidadeAtores

    } catch (error) {
        return false
    }
}


module.exports = {
    insertNacionalidadeAtor,
    selectId,
    updateNacionalidadeAtor,
    deleteNacionalidadeAtor,
    selectAllNacionalidadeAtores,
    selectByIdNacionalidadeAtor
}
