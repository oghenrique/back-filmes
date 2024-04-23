//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um filme no Banco de Dados
const insertAtor = async (dadosAtor) => {
    try {
       
        let sql

        //Validação para verificar se a data de falecimento é vazia
        if (dadosAtor.data_falecimento == null ||
            dadosAtor.data_falecimento == undefined ||
            dadosAtor.data_falecimento == ''
        ) {
            sql = `insert into tbl_ator (
                                         nome_completo, 
                                         nome_artistico, 
                                         biografia, 
                                         data_nascimento, 
                                         foto, 
                                         id_sexo
                                        ) values (
                                                  '${dadosAtor.nome_completo}', 
                                                  '${dadosAtor.nome_artistico}', 
                                                  '${dadosAtor.biografia}',
                                                  '${dadosAtor.data_nascimento}', 
                                                  '${dadosAtor.foto}', 
                                                  '${dadosAtor.id_sexo}'
                                                )`
        } else {
            sql = `insert into tbl_ator (
                                         nome_completo, 
                                         nome_artistico, 
                                         biografia, 
                                         data_nascimento, 
                                         data_falecimento, 
                                         foto, 
                                         id_sexo
                                        ) values (
                                                  '${dadosAtor.nome_completo}', 
                                                  '${dadosAtor.nome_artistico}',
                                                  '${dadosAtor.biografia}',
                                                  '${dadosAtor.data_nascimento}', 
                                                  '${dadosAtor.data_falecimento}', 
                                                  '${dadosAtor.foto}', 
                                                  '${dadosAtor.id_sexo}'
                                                )`
        }

        let result = await prisma.$executeRawUnsafe(sql)
        
        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

const updateAtor = async (idAtor, dadosAtor) => {
    let sql
    try {
        // Validação para verificar se a data de relançamento é vazia, pois devemos ajustar o script SQL para o BD
        if (dadosAtor.data_falecimento == null ||
            dadosAtor.data_falecimento == undefined ||
            dadosAtor.data_falecimento == '') {
            sql = `update tbl_ator set 
                                                nome_completo = '${dadosAtor.nome_completo}',
                                                nome_artistico =  '${dadosAtor.nome_artistico}',
                                                biografia = '${dadosAtor.biografia}',
                                                data_nascimento = '${dadosAtor.data_nascimento}',
                                                foto = '${dadosAtor.foto}',
                                                id_sexo = '${dadosAtor.id_sexo}'
                                                where id = ${idAtor}`
        } else {
            sql = `update tbl_ator set
                                                   nome_completo = '${dadosAtor.nome_completo}',
                                                   nome_artistico =  '${dadosAtor.nome_artistico}',
                                                   biografia = '${dadosAtor.biografia}',
                                                   data_nascimento = '${dadosAtor.data_nascimento}',
                                                   data_falecimento = '${dadosAtor.data_falecimento}',
                                                   foto = '${dadosAtor.foto}',
                                                   id_sexo = '${dadosAtor.id_sexo}'
                    where id = ${idAtor}`
        }
        let result = await prisma.$executeRawUnsafe(sql)
        
        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}


const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from tbl_ator order by id desc limit 1'

        let rsAtores = await prisma.$queryRawUnsafe(sql)

        if (rsAtores) {
            return rsAtores[0].id // Corrigindo para retornar o ID corretamente
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectByIdAtor = async (id) => {
    try {
        let sql = `select * from tbl_ator where id=${id}`

        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores
    } catch (error) {
        return false
    }
}


const deleteAtor = async (id) => {
    try {
        // Exclui o registro correspondente na tabela tbl_nacionalidade_ator
        let sqlNacionalidade = `DELETE FROM tbl_nacionalidade_ator WHERE id_ator = ${id}`
        await prisma.$executeRawUnsafe(sqlNacionalidade)

        // Exclui o ator da tabela tbl_ator
        let sqlAtor = `DELETE FROM tbl_ator WHERE id = ${id}`
        await prisma.$executeRawUnsafe(sqlAtor)

        return true // Retorna true para indicar que a exclusão foi bem-sucedida
    } catch (error) {
        console.error("Erro ao excluir ator:", error)
        return false // Retorna false em caso de erro na exclusão
    }
}




const selectAllAtores = async () => {
    try {
        // Script SQL para buscar todos os registros do database
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_ator a
                   LEFT JOIN 
                        tbl_nacionalidade_ator na ON a.id = na.id_ator
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores
    } catch (error) {
        console.error("Erro ao selecionar todos os atores:", error)
        return false
    }
}


const selectByNomeCompletoAtor = async (nome_completo) => {
    try {
        // Script SQL para buscar atores pelo nome completo, incluindo o nome da nacionalidade e do sexo
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_ator a
                   LEFT JOIN 
                        tbl_nacionalidade_ator na ON a.id = na.id_ator
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id
                   WHERE 
                        a.nome_completo LIKE '%${nome_completo}%'`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores
    } catch (error) {
        console.error("Erro ao selecionar atores pelo nome completo:", error)
        return false
    }
}

const selectByNomeArtisticoAtor = async (nome_artistico) => {
    try {
        // Script SQL para buscar atores pelo nome artístico, incluindo o nome da nacionalidade e do sexo
        let sql = `SELECT 
                        a.*, 
                        n.nome AS nome_nacionalidade,
                        s.nome AS nome_sexo
                   FROM 
                        tbl_ator a
                   LEFT JOIN 
                        tbl_nacionalidade_ator na ON a.id = na.id_ator
                   LEFT JOIN 
                        tbl_nacionalidade n ON na.id_nacionalidade = n.id
                   LEFT JOIN 
                        tbl_sexo s ON a.id_sexo = s.id
                   WHERE 
                        a.nome_artistico LIKE '%${nome_artistico}%'`

        // Executa o script SQL no DB e guarda o retorno dos dados
        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores
    } catch (error) {
        console.error("Erro ao selecionar atores pelo nome artístico:", error)
        return false
    }
}


module.exports = {
    insertAtor,
    selectId,
    updateAtor,
    deleteAtor,
    selectAllAtores,
    selectByIdAtor,
    selectByNomeCompletoAtor,
    selectByNomeArtisticoAtor
}
