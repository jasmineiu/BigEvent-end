// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
//导入@hapi/joi 定义验证规则
const joi = require('joi')

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册侧为全局中间件 
app.use(cors())

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
app.use(express.static('./web'))

//配置解析表单数据的中间件,只解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended:false }))

// 相应数据的中间件——手动封装res.cc()函数用来响应【处理失败】结果
app.use((req,res,next)=>{
    // status=0为成功，status=1为失败，将默认值设置为1，方便处理失败的情况
    res.cc = (err,status=1)=>{ 
        // 状态 状态描述，判断err是 错误对象 还是 错误
        res.send({ status,message:err instanceof Error? err.message:err,})
    }
    next()
})

// 一定要在路由之前配置解析 Token 的中间件
// 导入配置文件
const config = require('./config')
// 解析token的中间件
const expressJWT = require('express-jwt')
// 使用unless({path:[/^\/api\//] })指定哪些接口不需要进行token身份认证
app.use(expressJWT( {secret:config.jwtSecretKey}).unless({path:[/^\/api\//] }))


// 【1】导入 并注册用户 路由模块
const userRouter = require('./router/user')
// 注意：以/api开头的接口,不需要权限
app.use('/api',userRouter)

// 【2】导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以/my开头的接口，都是有权限的接口，需要进行token身份认证
app.use('/my',userinfoRouter)

// 【3】导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
//  为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/artcate',artCateRouter)

//【4】 导入并使用文章路由模块 
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article',articleRouter)


// 定义错误级别中间件
app.use((err,req,res,next)=>{
    // 数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    // 未知错误
    res.cc(err)
})


// 调用 app.listen() 方法，指定端口号并指定启动web服务器
app.listen(801,()=>{
    console.log('http://127.0.0.1:801')
})