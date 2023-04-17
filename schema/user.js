// 导入@hapi/joi 定义验证规则
const joi = require('joi')

// 定义用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 定义密码的验证规则
const password = joi.string().pattern(/^[\S]{3,12}$/).required()

// 定义 id nickname email 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()


// 对外暴露 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    body:{
        username,
        password,
    },
}

// 对外暴露 验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
    body:{
        id,
        nickname,
        email,
    },
}

// 对外暴露 重置密码的验证规则对象
exports.update_password_schema = {
    body:{
        // 使用password这个规则，验证req.body.oldpwd的值
        oldPwd:password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd:joi.not(joi.ref('oldPwd')).concat(password),
    }
}

// 对外暴露 验证规则对象-更新头像
exports.update_avatar_schema = {
    body:{
        avatar,
    },
}