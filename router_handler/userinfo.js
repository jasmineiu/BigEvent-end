// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs模块来加密解密 密码
const bcrypt = require('bcryptjs')

// 获取【用户基本信息】的处理函数
exports.getUserInfo = async(req,res)=>{
    // 根据用户的 id，查询用户的基本信息
    //  注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    let results = []
    try {
        results = await db.queryByPromisify(sql, req.user.id)
        if (results.length !== 1) {
            return res.cc('获取用户信息失败')
        }
    } catch (e) {
        return res.cc(e)
    }
    //将用户信息响应给客户端
    res.send({
        status: 0,
        msg: '获取用户信息成功',
        data: results[0]
    })
}

// 更新【用户基本信息】的处理函数
exports.updateUserInfo = async(req,res)=>{
    // 定义待执行的SQL语句
    const sql = `update ev_users set? where id=?`
    // 调用db.query()执行SQL语句并传参
    try {
        const result = await db.queryByPromisify(sql, [req.body, req.body.id])
        if (result.affectedRows !== 1) {
            return res.cc('更新用户信息失败')
        }
    } catch (e) {
        res.cc(e)
    }
    res.cc('更新用户信息成功', 0)
}
//【重置密码】的处理函数
exports.updatePassword = async(req,res)=>{
    // 定义根据 id 查询用户数据的SQL语句
    const sql = `select * from ev_users where id=?`
    // 执行SQL语句查询用户是否存在
    let results = []
    try {
        results = await db.queryByPromisify(sql, req.user.id)
        if (results.length !== 1) {
            return res.cc('用户不存在')
        }
    } catch (e) {
        return res.cc(e)
    }

    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password)
    if(!compareResult) return res.cc('原密码输入错误')

    // 定义更新用户密码的SQL语句
    const sqlUpdate = `update ev_users set password=? where id=?`
    // 对新密码进行bcrypt加密
    const newPwd = bcrypt.hashSync(req.body.newPwd,10)
    // 执行SQL语句，根据 id 更新用户的 密码

    let resultUpdate = []
    try {
        resultUpdate = await db.queryByPromisify(sqlUpdate, [newPwd, req.user.id])
        if (resultUpdate.affectedRows !== 1) {
            return res.cc('重置密码失败')
        }
    } catch (e) {
        return res.cc(e)
    }
    res.cc('更新密码成功',0)
}

//更新用户信息头像的函数
exports.updateAvatar = async(req,res)=>{
    // 定义更新用户头像的SQL语句
    const sql = `update ev_users set user_pic=? where id=?`
    // 调用db.query()执行SQL语句，更新对应用户的头像
    let result = null
    try {
        result = await db.queryByPromisify(sql, [req.body.avatar, req.user.id])
        if (result.affectedRows !== 1) {
            return res.cc('更新用户头像失败')
        }
    } catch (e) {
        return res.cc(e)
    }
    res.cc('更新用户头像成功',0)
}