// 导入 数据库操作 模块
const db = require('../db/index')


// 向外共享 【获取文章分类】列表数据的处理函数
exports.getArticleCates = async(req,res)=>{
    // 定义SQL语句，根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    let results = []
    try {
        results = await db.queryByPromisify(sql)
    } catch (e) {
        return res.cc("未获取到")
    }
    // 执行SQL语句成功
    res.send({ status:0,message:'获取文章分类列表成功',data:results })
}

// 向外共享 【新增文章】分类的处理函数
exports.addArticleCates = async(req,res)=>{
    // 1.定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where name=? or alias=?`
    // 2.执行查重操作
    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.body.name, req.body.alias])

        if (results.length === 1) { // name被占用 或 alias被占用 或 name，alias同时被一条数据占用
            if (results[0].alias == req.body.alias && results[0].name == req.body.name) {
                return res.cc('分类名称和分类别名已被占用,请更换后重试')
            }
            if (results[0].name == req.body.name) {
                return res.cc('分类名称已被占用,请更换后重试')
            }
            if (results[0].alias == req.body.alias) {
                return res.cc('分类别名已被占用,请更换后重试')
            }
        }
        if (results.length === 2) { // name，alias分别被两条数据占用
            return res.cc('分类名称和分类别名已被占用,请更换后重试')
        }
    } catch (e) {
        return res.cc(e)
    }

    // 新增文章分类
    // 定义新增文章分类的 SQL 语句
    const sqlInsert = `insert into ev_article_cate set?`
    // 调用 `db.query()` 执行新增文章分类的 SQL 语句
    let resultInsert = null
    try {
        resultInsert = await db.queryByPromisify(sqlInsert, req.body)
        if (resultInsert.affectedRows !== 1) {
            return res.cc('新增文章分类失败2')
        }
    } catch (e) {
        return res.cc(e)
    }
    res.send({
        status: 0,
        msg: '新增文章分类成功'
    })
}

// 向外共享 【根据ID删除文章分类】的处理函数
exports.deleteCateById = async(req,res)=>{
    // 定义删除文章分类的 SQL 语句
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    // 调用 `db.query()` 执行删除文章分类的 SQL 语句
    try {
        let result = await db.queryByPromisify(sql, req.params.id)
        if (result.affectedRows !== 1) {
            return res.cc('删除文章分类失败')
        }
    } catch (e) {
        return res.cc(e)
    }

    // bugfix: 当文章分类被删除了，则文章分类相关的文章也要被删除
    const sql2 = 'update ev_articles set is_delete = 1 where cate_id = ?'
    try {
        await db.queryByPromisify(sql2, req.params.id)
    } catch (e) {
        return res.cc(e)
    }
    res.send({
        status: 0,
        msg: '删除文章分类成功'
    })
}

// 向外共享 【根据Id获取文章分类】的处理函数
exports.getArticleById = async(req,res)=>{
    // 定义根据 Id 获取文章分类的 SQL 语句
    const sql = `select * from ev_article_cate where id=?`
    // 调用 `db.query()` 执行 SQL 语句
    let result = []
    try {
        result = await db.queryByPromisify(sql, req.params.id)

        if (result.length !== 1) {
            return res.cc('文章分类不存在')
        }
    } catch (e) {
        return res.cc(e)
    }
    res.send({
        status: 0,
        msg: '获取文章分类成功',
        data: result[0]
    })
}

// 向外共享 【更新文章分类】的路由处理函数
exports.updateCateById = async(req,res)=>{
    // 定义查重的 SQL 语句
    const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
    // 调用 `db.query()` 执行查重的操作：
    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.body.id, req.body.name, req.body.alias])

        if (results.length === 1) {
            if (results[0].name == req.body.name && results[0].alias == req.body.alias) {
                return res.cc('分类名称和别名已经被占用，请更换后重试！')
            }
            if (results[0].name == req.body.name) {
                return res.cc('分类名称已经被占用,请更换后重试！')
            }
            if (results[0].alias == req.body.alias) {
                return res.cc('分类别名已经被占用,请更换后重试！')
            }
        }
        if (results.length === 2) {
            return res.cc('分类名称和别名已经被占用.请更换后重试！')
        }
    } catch (e) {
        res.cc(e)
    }

    // 更新文章分类
    // 定义更新文章分类的 SQL 语句
    const sqlUpdate = `update ev_article_cate set ? where id=?`
    // 调用 `db.query()` 执行 SQL 语句
    let result = []
    try {
        result = await db.queryByPromisify(sqlUpdate, [req.body, req.body.id])

        if (result.affectedRows !== 1) {
            return res.cc('更新文章分类失败2')
        }
    } catch (e) {
        console.log(e);
        return res.cc(e)
    }
    res.send({
        status: 0,
        msg: '更新文章分类成功'
    })
}
