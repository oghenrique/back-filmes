//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const selectAllAtores = async () => {

    try {
        //Script SQL para buscar todos os registros do database
        let sql = 'select * from tbl_ator'

        //$queryRawUnsafe(sql) ------ Encaminha uma variavel
        //$queryRaw('select * from tbl_filme') ------------- Encaminha direto o script

        //Executa o scriptSQL no DB e guarda o retorno dos dados
        let rsAtores = await prisma.$queryRawUnsafe(sql)

        return rsAtores

    } catch (error) {

        return false

    }

}

module.exports = {
    selectAllAtores
}
