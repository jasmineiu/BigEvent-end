// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入验证数据合法的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证规则的对象
const { update_userinfo_schema ,update_password_schema,update_avatar_schema} = require('../schema/user')



// 导入用户信息的处理函数模块、
const userinfo_handler = require('../router_handler/userinfo')


// 定义 获取用户的基本信息 路由
router.get('/userinfo',userinfo_handler.getUserInfo)
// 定义 更新用户的基本信息 路由
router.post('/userinfo',expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 定义 重置密码 路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)
// 定义 更新用户头像 路由
router.post('/update/avatar',expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)


// 向外共享路由对象
module.exports = router