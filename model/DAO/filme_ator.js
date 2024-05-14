// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir uma classificação no Banco de Dados
const insertFilmeAtor = async (dadosFilmeAtor) => {
    try {
        let sql = `insert into tbl_filme_ator (
                                                    id_filme, 
                                                    id_ator
                                                    ) values (
                                                              '${dadosFilmeAtor.id_filme}', 
                                                              '${dadosFilmeAtor.id_ator}'
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
        let sql = 'select CAST(id as DECIMAL) as id FROM tbl_filme_ator order by id desc limit 1'
        
        let rsFilmeAtores = await prisma.$queryRawUnsafe(sql)

        if (rsFilmeAtores.length > 0) {
            return rsFilmeAtores[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar uma classificação
const updateFilmeAtor = async (idFilmeAtor, dadosFilmeAtor) => {

    let sql

    try {
            sql = `update tbl_filme_ator set 
                                                    id_filme = '${dadosFilmeAtor.id_filme}', 
                                                    id_ator = '${dadosFilmeAtor.id_ator}'
                                                    where id = ${idFilmeAtor}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

// Função para deletar uma classificação no Banco de Dados
const deleteFilmeAtor = async (id) => {

    try {

        let sql = `delete from tbl_filme_ator where id = ${id}`

        let rsFilmeAtores = await prisma.$queryRawUnsafe(sql)

        return rsFilmeAtores

    } catch (error) {
        return false
    }
}

// Função para selecionar uma classificação pelo ID
const selectByIdFilmeAtor = async (idFilme) => {

    try {

        let sql = `SELECT * FROM tbl_filme_diretor WHERE id_filme = ${idFilme}}`
        
        let rsFilmeAtores = await prisma.$queryRawUnsafe(sql)

        return rsFilmeAtores

    } catch (error) {
        return false
    }
}

// Função para selecionar todas as classificações
const selectAllFilmeAtores = async () => {

    try {

        let sql = 'select * from tbl_filme_ator'
        
        let rsFilmeAtores = await prisma.$queryRawUnsafe(sql)

        return rsFilmeAtores

    } catch (error) {
        return false
    }
}


module.exports = {
    insertFilmeAtor,
    selectId,
    updateFilmeAtor,
    deleteFilmeAtor,
    selectAllFilmeAtores,
    selectByIdFilmeAtor
}
