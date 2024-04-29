const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const selectAllSexos = async () => {
    try {
        let sql = "select * from tbl_sexo"
    
        let rsSexos = await prisma.$queryRawUnsafe(sql)
    
        return rsSexos
      } catch (error) {
        return false
    }
}

const selectSexoById = async  (id)=> {
    try {
        let sql = `select * from tbl_sexo where id = ${id}`
    
        let rsSexos = await prisma.$queryRawUnsafe(sql)
    
        return rsSexos
      } catch (error) {
        return false
    }
}

module.exports = {
    selectAllSexos,
    selectSexoById
}