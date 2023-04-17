// 文章的路由模块

const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const article_handler = require('../router_handler/article')

// 导入 multer 和 path，解析form-data表单数据
const multer = require('multer')
const path = require('path')
// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_article_schema,list_article_schema, del_article_schema, eidt_article_schema } = require('../schema/article')

// 发布文章的路由
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
// 发布文章的封面图片
router.post('/add/img', uploads.single('block_img'), article_handler.addImg)
// 获取文章列表
router.get('/list', expressJoi(list_article_schema), article_handler.listArticle)
// 根据id删除文章
router.get('/delete/:id', expressJoi(del_article_schema), article_handler.delArticle)
// 编辑更新文章
router.post('/edit', uploads.single('cover_img'), expressJoi(eidt_article_schema),article_handler. editArticle)
// 查询文章详情
router.get('/:id', expressJoi(del_article_schema), article_handler.queryArticleDetail)


module.exports = router
