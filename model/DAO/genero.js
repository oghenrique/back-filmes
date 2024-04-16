//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const selectAllGeneros = async () => {

    try {
        //Script SQL para buscar todos os registros do database
        let sql = 'select * from tbl_genero'

        //$queryRawUnsafe(sql) ------ Encaminha uma variavel
        //$queryRaw('select * from tbl_filme') ------------- Encaminha direto o script

        //Executa o scriptSQL no DB e guarda o retorno dos dados
        let rsGeneros = await prisma.$queryRawUnsafe(sql)

        return rsGeneros

    } catch (error) {

        return false

    }

}

module.exports = {
    selectAllGeneros
}