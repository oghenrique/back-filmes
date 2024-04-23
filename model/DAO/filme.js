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
const insertFilme = async (dadosFilme, idGenero) => {
    try {
        let sql

        // Validando se a data de relançamento é vazia
        if (!dadosFilme.data_relancamento) {
            sql = `insert into tbl_filme( titulo,
                                          sinopse,
                                          duracao,
                                          data_lancamento,
                                          foto_capa,
                                          valor_unitario,
                                          id_classificacao
                                          ) values (
                                                    '${dadosFilme.titulo}',
                                                    '${dadosFilme.sinopse}',
                                                    '${dadosFilme.duracao}',
                                                    '${dadosFilme.data_lancamento}',
                                                    '${dadosFilme.foto_capa}',
                                                    '${dadosFilme.valor_unitario}',
                                                    '${dadosFilme.id_classificacao}'
                                                    )`
        } else {
            sql = `insert into tbl_filme( titulo,
                                              sinopse,
                                              duracao,
                                              data_lancamento,
                                              data_relancamento,
                                              foto_capa,
                                              valor_unitario,
                                              id_classificacao
                                             ) values (
                                                       '${dadosFilme.titulo}',
                                                       '${dadosFilme.sinopse}',
                                                       '${dadosFilme.duracao}',
                                                       '${dadosFilme.data_lancamento}',
                                                       '${dadosFilme.data_relancamento}',
                                                       '${dadosFilme.foto_capa}',
                                                       '${dadosFilme.valor_unitario}',
                                                       '${dadosFilme.id_classificacao}'
                                            )`
        }

        console.log("Consulta SQL para inserção do filme:", sql)

        let result = await prisma.$executeRawUnsafe(sql)

        // Obter o ID do filme inserido
        let filmeId = null
        if (result) {
            filmeId = result.insertId
            console.log("ID do filme inserido:", filmeId)
        } else {
            throw new Error("Falha ao inserir o filme.")
        }

        // Verificar se foi fornecido um ID de gênero
        if (idGenero) {
            // Gerar consulta SQL para inserir o gênero do filme
            const insertGeneroQuery = `insert into tbl_filme_genero (id_filme, id_genero)
                                            values (LAST_INSERT_ID(), ${idGenero})`

            console.log("Consulta SQL para inserção do gênero:", insertGeneroQuery)

            // Executar a consulta SQL para inserir o gênero
            let generoResult = await prisma.$executeRawUnsafe(insertGeneroQuery)

            // Verificar se a inserção do gênero foi bem-sucedida
            if (!generoResult) {
                return false // Retorna false se houver algum problema na inserção do gênero
            }

            console.log("Resultado da inserção do gênero:", generoResult) // Adicione este console log

            return true // Retorna true se a inserção do gênero for bem-sucedida
        } else {
            // Se não foi fornecido um ID de gênero, retorna false
            return false
        }
    } catch (error) {
        console.error("Erro durante a inserção do filme:", error) // Adicione este console log
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
                                                titulo = '${dadosFilme.titulo}',
                                                sinopse =  '${dadosFilme.sinopse}',
                                                duracao = '${dadosFilme.duracao}',
                                                data_lancamento = '${dadosFilme.data_lancamento}',
                                                foto_capa = '${dadosFilme.foto_capa}',
                                                valor_unitario = '${dadosFilme.valor_unitario}',
                                                id_classificacao = '${dadosFilme.id_classificacao}'
                                                where id = ${idFilme}`

        } else {

            sql = `update tbl_filme set
                                                   titulo = '${dadosFilme.titulo}',
                                                   sinopse =  '${dadosFilme.sinopse}',
                                                   duracao = '${dadosFilme.duracao}',
                                                   data_lancamento = '${dadosFilme.data_lancamento}',
                                                   data_relancamento = '${dadosFilme.data_relancamento}',
                                                   foto_capa = '${dadosFilme.foto_capa}',
                                                   valor_unitario = '${dadosFilme.valor_unitario}',
                                                   id_classificacao = '${dadosFilme.id_classificacao}'
                    where id = ${idFilme}`

        }
        //$executeRawUnsafe() - serve para executar scripts sql que não retornam valores (insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts sql que RETORNAM dados do BD (select)
        let result = await prisma.$executeRawUnsafe(sql)

        // Verifica se a atualização foi bem-sucedida
        if (result) {
            // Verifica se a nova ngenero foi fornecida nos dados do filme
            if (dadosFilme.id_genero !== undefined) {
                // Verifica se a ngenero atual é diferente da nova ngenero fornecida
                const generoAtualQuery = `SELECT id_genero FROM tbl_filme_genero WHERE id_filme = ${idFilme}`
                const generoAtualResult = await prisma.$executeRawUnsafe(generoAtualQuery)
                const generoAtual = generoAtualResult[0]?.id_genero

                if (generoAtual !== dadosFilme.id_genero) {
                    // Atualiza a ngenero do filme na tabela intermediária
                    const updateNgeneroQuery = `UPDATE tbl_filme_genero 
                                                      SET id_genero = ${dadosFilme.id_genero} 
                                                      WHERE id_filme = ${idFilme}`
                    await prisma.$executeRawUnsafe(updateNgeneroQuery)
                }
            }
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}

//Função para deletar um filme no Banco de Dados
const deleteFilme = async (id) => {

    try {
        // Exclui o registro correspondente na tabela tbl_filme_genero
        let sqlGenero = `DELETE FROM tbl_filme_genero WHERE id_filme = ${id}`
        await prisma.$executeRawUnsafe(sqlGenero)

        // Exclui o filme da tabela tbl_filme
        let sqlFilme = `DELETE FROM tbl_filme WHERE id = ${id}`
        await prisma.$executeRawUnsafe(sqlFilme)

        return true // Retorna true para indicar que a exclusão foi bem-sucedida
    } catch (error) {
        console.error("Erro ao excluir filme:", error)
        return false // Retorna false em caso de erro na exclusão
    }

}

//Função para retornar todos os filmes do Banco de Dados
const selectAllFilmes = async () => {

    try {
        //Script SQL para buscar todos os registros do database
        let sql = `SELECT 
                            a.*, 
                            n.nome AS nome_genero,
                            s.nome AS nome_classificacao
                        FROM 
                            tbl_filme a
                        LEFT JOIN 
                            tbl_filme_genero na ON a.id = na.id_filme
                        LEFT JOIN 
                            tbl_genero n ON na.id_genero = n.id
                        LEFT JOIN 
                            tbl_classificacao s ON a.id_classificacao = s.id`

        //$queryRawUnsafe(sql) ------ Encaminha uma variavel
        //$queryRaw('select * from tbl_filme') ------------- Encaminha direto o script

        //Executa o scriptSQL no DB e guarda o retorno dos dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes

    } catch (error) {
        console.error("Erro ao selecionar todos os filmes:", error)
        return false

    }

}

//Função para buscar um filme no Banco de Dados filtrando pelo ID
const selectByIdFilme = async (id) => {

    try {
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_genero,
                        s.nome AS nome_classificacao
                    FROM 
                        tbl_filme a
                    LEFT JOIN 
                        tbl_filme_genero na ON a.id = na.id_filme
                    LEFT JOIN 
                        tbl_genero n ON na.id_genero = n.id
                    LEFT JOIN 
                        tbl_classificacao s ON a.id_classificacao = s.id
                    WHERE 
                        a.id = ${id}`

        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes

    } catch (error) {
        console.error("Erro ao selecionar o filme pelo ID:", error)
        return false
    }


}

const selectByNomeFilme = async (titulo) => {
    try {
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_genero,
                        s.nome AS nome_classificacao
                    FROM 
                        tbl_filme a
                    LEFT JOIN 
                        tbl_filme_genero na ON a.id = na.id_filme
                    LEFT JOIN 
                        tbl_genero n ON na.id_genero = n.id
                    LEFT JOIN 
                        tbl_classificacao s ON a.id_classificacao = s.id
                    WHERE 
                        a.titulo LIKE '%${titulo}%'`

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
