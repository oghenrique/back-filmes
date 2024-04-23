//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um filme no Banco de Dados
const insertGenero = async (dadosGenero) => {

    try {
        let sql

        sql = `insert into tbl_genero(nome) values('${dadosGenero.nome}')`

        //$executeRawUnsafe() - serve para executar scripts sql que não retornam valores (insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts sql que RETORNAM dados do BD (select)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

        //Cria a variável SQL

    } catch (error) {

        return false
    }

}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from tbl_genero order by id desc limit 1'

        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        if (rsGeneros) {
            return rsGeneros[0].id // Corrigindo para retornar o ID corretamente
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateGenero = async (idGenero, dadosGenero) => {

    let sql

    try {
        sql = `update tbl_genero set nome = '${dadosGenero.nome}' where id = ${idGenero}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

//Função para deletar um genero no Banco de Dados
const deleteGenero = async (id) => {

    try {
        let sql = `delete from tbl_genero where id = ${id}`

        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        return rsGeneros

    } catch (error) {
        return false
    }

}

const selectByIdGenero = async (id) => {

    try {
        let sql = `select * from tbl_genero where id = ${id}`

        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        return rsGeneros

    } catch (error) {
        return false
    }


}

const selectAllGeneros = async () => {

    try {
        let sql = 'select * from tbl_genero'

        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        return rsGeneros

    } catch (error) {

        return false

    }

}


const selectByNomeGenero = async (nome) => {
    try {
        let sql = `select * from tbl_genero where nome like '%${nome}%'`

        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        return rsGeneros

    } catch (error) {
        return false
    }
}

module.exports = {
    insertGenero,
    selectId,
    updateGenero,
    deleteGenero,
    selectAllGeneros,
    selectByIdGenero,
    selectByNomeGenero
}