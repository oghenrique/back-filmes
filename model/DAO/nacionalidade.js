//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um filme no Banco de Dados
const insertNacionalidade = async (dadosNacionalidade) => {

    try {
        let sql

        sql = `insert into tbl_nacionalidade(nome) values('${dadosNacionalidade.nome}')`

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
        let sql = 'select CAST(id as DECIMAL)as id from tbl_nacionalidade order by id desc limit 1'

        let rsNacionalidades = await prisma.$queryRawUnsafe(sql)

        if (rsNacionalidades) {
            return rsNacionalidades[0].id // Corrigindo para retornar o ID corretamente
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateNacionalidade = async (idNacionalidade, dadosNacionalidade) => {

    let sql

    try {
        sql = `update tbl_nacionalidade set nome = '${dadosNacionalidade.nome}' where id = ${idNacionalidade}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

//Função para deletar um genero no Banco de Dados
const deleteNacionalidade = async (id) => {

    try {
        let sql = `delete from tbl_nacionalidade where id = ${id}`

        let rsNacionalidades = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidades

    } catch (error) {
        return false
    }

}

const selectByIdNacionalidade = async (id) => {

    try {
        let sql = `select * from tbl_nacionalidade where id = ${id}`

        let rsNacionalidades = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidades

    } catch (error) {
        return false
    }


}

const selectAllNacionalidades = async () => {

    try {
        let sql = 'select * from tbl_nacionalidade'

        let rsNacionalidades = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidades

    } catch (error) {

        return false

    }

}


const selectByNomeNacionalidade = async (nome) => {
    try {
        let sql = `select * from tbl_nacionalidade where nome like '%${nome}%'`

        let rsNacionalidades = await prisma.$queryRawUnsafe(sql)

        return rsNacionalidades

    } catch (error) {
        return false
    }
}

module.exports = {
    insertNacionalidade,
    selectId,
    updateNacionalidade,
    deleteNacionalidade,
    selectAllNacionalidades,
    selectByIdNacionalidade,
    selectByNomeNacionalidade
}