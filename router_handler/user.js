// 在这里定义和用户相关的路由处理函数，供 /router/userr.js 模块进行调用

// 导入数据库操作模块
const db = require('../db/index')
// 导入bcrypyjs模块 加密和解密
const bcrypt = require('bcryptjs')
// 导入 jsonwebtoken模块，生成Token字符串
const jwt  = require('jsonwebtoken')
// 导入全局配置文件，加密token
const config = require('../config')
const { promisify } = require('util')

const dbQuery = promisify(db.query).bind(db)

// 注册模块的处理函数
exports.reguser = async(req,res)=>{
    // 接收表单数据
    const userinfo = req.body

    // 定义检测用户名的 SQL 语句
    const sqlStr = `select * from ev_users where username=?`
    // 执行SQL语句并根据结果判断用户名是否被占用

    try {
        const data = await dbQuery(sqlStr, userinfo.username)
        if (data.length > 0) {
            return res.cc('用户名已被占用，请更换其它用户名')
        }
    } catch (e) {
        return res.cc(e)
    }

    // 插入新用户
    // 定义插入新用户的SQL语句
    const sqlInsert = `insert into ev_users set?`

    // 确定用户名可用之后，对用户密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password,10)
    
    // 执行SQL语句并根据结果判断用户名是否插入成功
    try {
        const data = await dbQuery(sqlInsert, { username: userinfo.username, password: userinfo.password })
        if (data.affectedRows !== 1) {
            return res.cc('注册用户失败，请稍后重试')
        }
        res.cc('注册用户成功', 0)
    } catch (e) {
        return res.cc(e)
    }
}

// 登录的处理函数
exports.login = async(req, res) => {
    // 接收表单的数据
    const userinfo = req.body
    // 定义 SQL 语句
    const sqlStr = `select * from ev_users where username=?`
    // 执行 SQL 语句，根据用户名查询用户的信息

    let result = [];
    try {
        result = await dbQuery(sqlStr, userinfo.username)
        if (result.length !== 1) {
            return res.cc('登录失败')
        }
    } catch (e) {
        return res.cc(e)
    }

    // TODO：判断密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
    if (!compareResult) return res.cc('密码不正确，登录失败！')

    // 登陆成功，生成Token字符串
    const user = { ...result[0], password:null, user_pic:null}
    //生成token字符串
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{ 
        expiresIn:'10h', //token的有效期是10h 
    })

    //将生成的token字符响应给客户端
    res.send({
        status:0,
        message:'登录成功',
        // 为了方便客户端使用token，在服务器端直接拼接上 Bearer 的前缀
        token:'Bearer '+tokenStr,
    })
}
  