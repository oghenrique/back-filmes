//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um filme no Banco de Dados
const insertDiretor = async (dadosDiretor, idNacionalidade) => {

    try {
        let sql

        if (dadosDiretor.data_falecimento == null ||
            dadosDiretor.data_falecimento == undefined ||
            dadosDiretor.data_falecimento == ''
        ) {

            sql = `insert into tbl_diretor( nome_completo,
                                          nome_artistico,
                                          biografia,
                                          data_nascimento,
                                          foto,
                                          id_sexo
                                          ) values (
                                                    '${dadosDiretor.nome_completo}',
                                                    '${dadosDiretor.nome_artistico}',
                                                    '${dadosDiretor.biografia}',
                                                    '${dadosDiretor.data_nascimento}',
                                                    '${dadosDiretor.foto}',
                                                    '${dadosDiretor.id_sexo}'
                                                    )`

        } else {

            sql = `insert into tbl_diretor( nome_completo,
                                              nome_artistico,
                                              biografia,
                                              data_nascimento,
                                              data_falecimento,
                                              foto,
                                              id_sexo
                                             ) values (
                                                       '${dadosDiretor.nome_completo}',
                                                       '${dadosDiretor.nome_artistico}',
                                                       '${dadosDiretor.biografia}',
                                                       '${dadosDiretor.data_nascimento}',
                                                       '${dadosDiretor.data_falecimento}',
                                                       '${dadosDiretor.foto}',
                                                       '${dadosDiretor.id_sexo}'
                                            )`

        }

        //$executeRawUnsafe() - serve para executar scripts sql que não retornam valores (insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts sql que RETORNAM dados do BD (select)
        let result = await prisma.$executeRawUnsafe(sql)

        // Verificando se a inserção foi bem-sucedida
        if (result) {
            // Verificar se o idNacionalidade não é undefined
            if (idNacionalidade !== undefined) {
                // Inserindo a nacionalidade do diretor na tabela intermediária
                const insertNacionalidadeQuery = `insert into tbl_nacionalidade_diretor (id_diretor, id_nacionalidade)
                                                  values (LAST_INSERT_ID(), ${idNacionalidade})`
                let nacionalidadeResult = await prisma.$executeRawUnsafe(insertNacionalidadeQuery)
                // Verificando se a inserção da nacionalidade foi bem-sucedida
                if (nacionalidadeResult) {
                    return true
                } else {
                    return false
                }
            } else {
                // idNacionalidade é undefined, não foi possível inserir a nacionalidade
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateDiretor = async (idDiretor, dadosDiretor) => {

    let sql

    try {

        //Validação para verificar se a data de relançamento é vazia, pois devemos ajustar o script SQL para o BD --- > 
        //OBS: essa condição é provisória, já que iremos tratar no BD com uma procedure

        if (dadosDiretor.data_falecimento == null ||
            dadosDiretor.data_falecimento == undefined ||
            dadosDiretor.data_falecimento == ''
        ) {

            sql = `update tbl_diretor set 
                                                nome_completo = '${dadosDiretor.nome_completo}',
                                                nome_artistico =  '${dadosDiretor.nome_artistico}',
                                                biografia = '${dadosDiretor.biografia}',
                                                data_nascimento = '${dadosDiretor.data_nascimento}',
                                                foto = '${dadosDiretor.foto}',
                                                id_sexo = '${dadosDiretor.id_sexo}'
                                                where id = ${idDiretor}`

        } else {

            sql = `update tbl_diretor set
                                                   nome_completo = '${dadosDiretor.nome_completo}',
                                                   nome_artistico =  '${dadosDiretor.nome_artistico}',
                                                   biografia = '${dadosDiretor.biografia}',
                                                   data_nascimento = '${dadosDiretor.data_nascimento}',
                                                   data_falecimento = '${dadosDiretor.data_falecimento}',
                                                   foto = '${dadosDiretor.foto}',

                                                   id_sexo = '${dadosDiretor.id_sexo}'
                    where id = ${idDiretor}`

        }
        //$executeRawUnsafe() - serve para executar scripts sql que não retornam valores (insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts sql que RETORNAM dados do BD (select)
        let result = await prisma.$executeRawUnsafe(sql)

        // Verifica se a atualização foi bem-sucedida
        if (result) {
            // Verifica se a nova nacionalidade foi fornecida nos dados do diretor
            if (dadosDiretor.id_nacionalidade !== undefined) {
                // Verifica se a nacionalidade atual é diferente da nova nacionalidade fornecida
                const nacionalidadeAtualQuery = `SELECT id_nacionalidade FROM tbl_nacionalidade_diretor WHERE id_diretor = ${idDiretor}`
                const nacionalidadeAtualResult = await prisma.$executeRawUnsafe(nacionalidadeAtualQuery)
                const nacionalidadeAtual = nacionalidadeAtualResult[0]?.id_nacionalidade

                if (nacionalidadeAtual !== dadosDiretor.id_nacionalidade) {
                    // Atualiza a nacionalidade do diretor na tabela intermediária
                    const updateNacionalidadeQuery = `UPDATE tbl_nacionalidade_diretor 
                                                      SET id_nacionalidade = ${dadosDiretor.id_nacionalidade} 
                                                      WHERE id_diretor = ${idDiretor}`
                    await prisma.$executeRawUnsafe(updateNacionalidadeQuery)
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

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from tbl_diretor order by id desc limit 1'

        let rsDiretores = await prisma.$queryRawUnsafe(sql)

        if (rsDiretores) {
            return rsDiretores[0].id // Corrigindo para retornar o ID corretamente
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectByIdDiretor = async (id) => {

    try {
        // Script SQL para buscar o diretor pelo ID, incluindo o nome da nacionalidade e do sexo
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_diretor a
                   LEFT JOIN 
                        tbl_nacionalidade_diretor na ON a.id = na.id_diretor
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id
                   WHERE 
                        a.id = ${id}`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsDiretores = await prisma.$queryRawUnsafe(sql)

        return rsDiretores
    } catch (error) {
        console.error("Erro ao selecionar o diretor pelo ID:", error)
        return false
    }
}

const deleteDiretor = async (id) => {

    try {
        // Exclui o registro correspondente na tabela tbl_nacionalidade_diretor
        let sqlNacionalidade = `DELETE FROM tbl_nacionalidade_diretor WHERE id_diretor = ${id}`
        await prisma.$executeRawUnsafe(sqlNacionalidade)

        // Exclui o diretor da tabela tbl_diretor
        let sqlDiretor = `DELETE FROM tbl_diretor WHERE id = ${id}`
        await prisma.$executeRawUnsafe(sqlDiretor)

        return true // Retorna true para indicar que a exclusão foi bem-sucedida
    } catch (error) {
        console.error("Erro ao excluir diretor:", error)
        return false // Retorna false em caso de erro na exclusão
    }

}


const selectAllDiretores = async () => {

    try {
        // Script SQL para buscar todos os registros do database
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_diretor a
                   LEFT JOIN 
                        tbl_nacionalidade_diretor na ON a.id = na.id_diretor
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsDiretores = await prisma.$queryRawUnsafe(sql)

        return rsDiretores
    } catch (error) {
        console.error("Erro ao selecionar todos os diretores:", error)
        return false
    }

}

const selectByNomeCompletoDiretor = async (nome_completo) => {
    try {
        // Script SQL para buscar diretores pelo nome completo, incluindo o nome da nacionalidade e do sexo
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_diretor a
                   LEFT JOIN 
                        tbl_nacionalidade_diretor na ON a.id = na.id_diretor
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id
                   WHERE 
                        a.nome_completo LIKE '%${nome_completo}%'`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsDiretores = await prisma.$queryRawUnsafe(sql)

        return rsDiretores
    } catch (error) {
        console.error("Erro ao selecionar diretores pelo nome completo:", error)
        return false
    }
}

const selectByNomeArtisticoDiretor = async (nome_artistico) => {
    try {
        // Script SQL para buscar diretores pelo nome artístico, incluindo o nome da nacionalidade e do sexo
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_diretor a
                   LEFT JOIN 
                        tbl_nacionalidade_diretor na ON a.id = na.id_diretor
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id
                   WHERE 
                        a.nome_artistico LIKE '%${nome_artistico}%'`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsDiretores = await prisma.$queryRawUnsafe(sql)

        return rsDiretores
    } catch (error) {
        console.error("Erro ao selecionar diretores pelo nome artístico:", error)
        return false
    }
}

module.exports = {
    insertDiretor,
    selectId,
    updateDiretor,
    deleteDiretor,
    selectAllDiretores,
    selectByIdDiretor,
    selectByNomeCompletoDiretor,
    selectByNomeArtisticoDiretor
}
