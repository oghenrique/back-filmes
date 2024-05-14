// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir uma classificação no Banco de Dados
const insertFilmeGenero = async (dadosFilmeGenero) => {
    try {
        let sql = `insert into tbl_filme_genero (
                                                    id_filme, 
                                                    id_genero
                                                    ) values (
                                                              '${dadosFilmeGenero.id_filme}', 
                                                              '${dadosFilmeGenero.id_genero}'
                                                              )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM tbl_filme_genero order by id desc limit 1'
        
        let rsFilmeGeneros = await prisma.$queryRawUnsafe(sql)

        if (rsFilmeGeneros.length > 0) {
            return rsFilmeGeneros[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar uma classificação
const updateFilmeGenero = async (idFilmeGenero, dadosFilmeGenero) => {

    let sql

    try {
            sql = `update tbl_filme_genero set 
                                                    id_filme = '${dadosFilmeGenero.id_filme}', 
                                                    id_genero = '${dadosFilmeGenero.id_genero}'
                                                    where id = ${idFilmeGenero}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

// Função para deletar uma classificação no Banco de Dados
const deleteFilmeGenero = async (id) => {

    try {

        let sql = `delete from tbl_filme_genero where id = ${id}`

        let rsFilmeGeneros = await prisma.$queryRawUnsafe(sql)

        return rsFilmeGeneros

    } catch (error) {
        return false
    }
}

const selectByIdFilmeGenero = async (idFilme) => {
    try {
        let sql = `SELECT * FROM tbl_filme_genero WHERE id_filme = ${idFilme}`
        
        let rsFilmeGeneros = await prisma.$queryRawUnsafe(sql)

        return rsFilmeGeneros

    } catch (error) {
        return false
    }
}


const selectAllFilmeGeneros = async () => {

    try {

        let sql = 'select * from tbl_filme_genero'
        
        let rsFilmeGeneros = await prisma.$queryRawUnsafe(sql)

        return rsFilmeGeneros

    } catch (error) {
        return false
    }
}

const selectFilmesByGenero = async (idGenero) => {
    try {
        let sql = `SELECT f.titulo 
                   FROM tbl_filme f
                   INNER JOIN tbl_filme_genero fg ON f.id = fg.id_filme
                   WHERE fg.id_genero = ${idGenero}`
        
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes
    } catch (error) {
        return false
    }
}


module.exports = {
    insertFilmeGenero,
    selectId,
    updateFilmeGenero,
    deleteFilmeGenero,
    selectAllFilmeGeneros,
    selectByIdFilmeGenero,
    selectFilmesByGenero
}
