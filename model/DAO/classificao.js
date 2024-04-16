//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const selectAllClassificacoes = async () => {

    try {
        //Script SQL para buscar todos os registros do database
        let sql = 'select * from tbl_classificacao'

        //$queryRawUnsafe(sql) ------ Encaminha uma variavel
        //$queryRaw('select * from tbl_filme') ------------- Encaminha direto o script

        //Executa o scriptSQL no DB e guarda o retorno dos dados
        let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

        return rsClassificacoes

    } catch (error) {

        return false

    }

}

module.exports = {
    selectAllClassificacoes
}