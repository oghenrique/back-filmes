// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertFilmeDiretor = async (dadosFilmeDiretor) => {
    try {
        let sql = `insert into tbl_filme_diretor (
                                                    id_filme, 
                                                    id_diretor
                                                    ) values (
                                                              '${dadosFilmeDiretor.id_filme}', 
                                                              '${dadosFilmeDiretor.id_diretor}'
                                                              )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM tbl_filme_diretor order by id desc limit 1'
        
        let rsFilmeDiretores = await prisma.$queryRawUnsafe(sql)

        if (rsFilmeDiretores.length > 0) {
            return rsFilmeDiretores[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateFilmeDiretor = async (idFilmeDiretor, dadosFilmeDiretor) => {

    let sql

    try {
            sql = `update tbl_filme_diretor set 
                                                    id_filme = '${dadosFilmeDiretor.id_filme}', 
                                                    id_diretor = '${dadosFilmeDiretor.id_diretor}'
                                                    where id = ${idFilmeDiretor}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

const deleteFilmeDiretor = async (id) => {

    try {

        let sql = `delete from tbl_filme_diretor where id = ${id}`

        let rsFilmeDiretores = await prisma.$queryRawUnsafe(sql)

        return rsFilmeDiretores

    } catch (error) {
        return false
    }
}

const selectByIdFilmeDiretor = async (idFilme) => {
    try {
        let sql = `SELECT * FROM tbl_filme_diretor WHERE id_filme = ${idFilme}`
        
        let rsFilmeDiretores = await prisma.$queryRawUnsafe(sql)

        return rsFilmeDiretores

    } catch (error) {
        return false
    }
}


const selectAllFilmeDiretores = async () => {

    try {

        let sql = 'select * from tbl_filme_diretor'
        
        let rsFilmeDiretores = await prisma.$queryRawUnsafe(sql)

        return rsFilmeDiretores

    } catch (error) {
        return false
    }
}


module.exports = {
    insertFilmeDiretor,
    selectId,
    updateFilmeDiretor,
    deleteFilmeDiretor,
    selectAllFilmeDiretores,
    selectByIdFilmeDiretor
}
