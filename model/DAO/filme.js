/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de filmes                      *
 * Data: 30/01/2024                                                                                       *
 * Autor: Gustavo Henrique                                                                                *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um filme no Banco de Dados
const insertFilme = async (dadosFilme) => {

    try {
        let sql

        //Validação para verificar se a data de relançamento é vazia, pois devemos ajustar o script SQL para o BD --- > 
        //OBS: essa condição é provisória, já que iremos tratar no BD com uma procedure

        if (dadosFilme.data_relancamento == null ||
            dadosFilme.data_relancamento == undefined ||
            dadosFilme.data_relancamento == ''
        ) {

            sql = `insert into tbl_filme( nome,
                                          sinopse,
                                          duracao,
                                          data_lancamento,
                                          foto_capa,
                                          valor_unitario
                                          ) values (
                                                    '${dadosFilme.nome}',
                                                    '${dadosFilme.sinopse}',
                                                    '${dadosFilme.duracao}',
                                                    '${dadosFilme.data_lancamento}',
                                                    '${dadosFilme.foto_capa}',
                                                    '${dadosFilme.valor_unitario}'
                                                    )`

        } else {

            sql = `insert into tbl_filme( nome,
                                              sinopse,
                                              duracao,
                                              data_lancamento,
                                              data_relancamento,
                                              foto_capa,
                                              valor_unitario
                                             ) values (
                                                       '${dadosFilme.nome}',
                                                       '${dadosFilme.sinopse}',
                                                       '${dadosFilme.duracao}',
                                                       '${dadosFilme.data_lancamento}',
                                                       '${dadosFilme.data_relancamento}',
                                                       '${dadosFilme.foto_capa}',
                                                       '${dadosFilme.valor_unitario}'
                                            )`

        }

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
        let sql = 'select CAST(id as DECIMAL)as id from tbl_filme order by id desc limit 1'

        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        if (rsFilmes) {
            return rsFilmes[0].id // Corrigindo para retornar o ID corretamente
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}


//Função para atualizar um filme no Banco de Dados
const updateFilme = async (idFilme, dadosFilme) => {

    let sql

    try {

        //Validação para verificar se a data de relançamento é vazia, pois devemos ajustar o script SQL para o BD --- > 
        //OBS: essa condição é provisória, já que iremos tratar no BD com uma procedure

        if (dadosFilme.data_relancamento == null ||
            dadosFilme.data_relancamento == undefined ||
            dadosFilme.data_relancamento == ''
        ) {

            sql = `update tbl_filme set 
                                                nome = '${dadosFilme.nome}',
                                                sinopse =  '${dadosFilme.sinopse}',
                                                duracao = '${dadosFilme.duracao}',
                                                data_lancamento = '${dadosFilme.data_lancamento}',
                                                foto_capa = '${dadosFilme.foto_capa}',
                                                valor_unitario = '${dadosFilme.valor_unitario}'
                                                where id = ${idFilme}`

        } else {

            sql = `update tbl_filme set
                                                   nome = '${dadosFilme.nome}',
                                                   sinopse =  '${dadosFilme.sinopse}',
                                                   duracao = '${dadosFilme.duracao}',
                                                   data_lancamento = '${dadosFilme.data_lancamento}',
                                                   data_relancamento = '${dadosFilme.data_relancamento}',
                                                   foto_capa = '${dadosFilme.foto_capa}',
                                                   valor_unitario = '${dadosFilme.valor_unitario}'
                    where id = ${idFilme}`

        }
        //$executeRawUnsafe() - serve para executar scripts sql que não retornam valores (insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts sql que RETORNAM dados do BD (select)
        let result = await prisma.$executeRawUnsafe(sql)

        // if (result)
        return result

        // else
        //     return false

        //Cria a variável SQL

    } catch (error) {

        return false
    }

}

//Função para deletar um filme no Banco de Dados
const deleteFilme = async (id) => {

    try {
        let sql = `delete from tbl_filme where id = ${id}`

        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes

    } catch (error) {
        return false
    }

}

//Função para retornar todos os filmes do Banco de Dados
const selectAllFilmes = async () => {

    try {
        //Script SQL para buscar todos os registros do database
        let sql = 'select * from tbl_filme'

        //$queryRawUnsafe(sql) ------ Encaminha uma variavel
        //$queryRaw('select * from tbl_filme') ------------- Encaminha direto o script

        //Executa o scriptSQL no DB e guarda o retorno dos dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes

    } catch (error) {

        return false

    }

}

//Função para buscar um filme no Banco de Dados filtrando pelo ID
const selectByIdFilme = async (id) => {

    try {
        let sql = `select * from tbl_filme where id = ${id}`

        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes

    } catch (error) {
        return false
    }


}

const selectByNomeFilme = async (nome) => {
    try {
        let sql = `select * from tbl_filme where nome like '%${nome}%'`

        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes

    } catch (error) {
        return false
    }
}



module.exports = {
    insertFilme,
    selectId,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme
}
