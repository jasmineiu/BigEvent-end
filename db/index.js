// 导入 mysql 模拟
const mysql = require('mysql')
const { promisify } = require('util')

// 创建数据库连接对象
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'database_1',
})
// 测试
// db.query('select 1',(err,result)=>{
//     if(err) return console.log(err.message)
//     console.log(result)
// })

queryByPromisify = promisify(db.query).bind(db)

db.queryByPromisify = queryByPromisify

// 向外共享 db 数据库连接对象
module.exports = db