/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL                                *
 * Data: 30/01/2024                                                                                       *
 * Autor: Gustavo Henrique                                                                                *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um filme no Banco de Dados
const insertFilme = async () => {

}

//Função para atualizar um filme no Banco de Dados
const updateFilme = async () => {

}

//Função para deletar um filme no Banco de Dados
const deleteFilme = async () => {

}

//Função para retornar todos os filmes do Banco de Dados
const selectAllFilmes = async () => {
    //Script SQL para buscar todos os registros do database
    let sql = 'select * from tbl_filmes'

    //$queryRawUnsafe(sql) ------ Encaminha uma variavel
    //$queryRaw('select * from tbl_filme') ------------- Encaminha direto o script

    //Executa o scriptSQL no DB e guarda o retorno dos dados
    let rsFilmes = await prisma.$queryRawUnsafe(sql) 

    //Validação para retornar os dados ou retornar false
    if(rsFilmes.length > 0)
        return rsFilmes
    else
        return false

}

//Função para buscar um filme no Banco de Dados filtrando pelo ID
const selectByIdFilme = async (id) => {

    let sql = `select * from tbl_filmes where id = ${id}`

    let rsFilmes = await prisma.$queryRawUnsafe(sql)

    if(rsFilmes.length > 0)
        return rsFilmes
        else 
    return false

}

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme
}