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

const selectAllGeneros = async () => {

    try {
        let sql = 'select * from tbl_genero'

        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        return rsGeneros

    } catch (error) {

        return false

    }

}

module.exports = {
    insertGenero,
    selectAllGeneros
}