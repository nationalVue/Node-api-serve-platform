//这是路由处理函数模块

const express = require('express')
const router = express.Router()
const db = require('../db/index')
//导入文章分类的路由处理函数模块
require('../router_handler/artcate')

//获取文章分类列表处理函数
exports.getArtCates = (req, res) => {
    //定义查询分类列表数据的SQL语句
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 2. 执行 SQL 语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        })
    })
}
//新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    //定义查重的SQL语句
    const sql = `select * from ev_article_cate where name=? or alias=?`
    // 执行查重操作
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分别判断 分类名称 和 分类别名 是否被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        const sql = `insert into ev_article_cate set ?`

        db.query(sql, req.body, (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')

            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
        })
    })
}
// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    // 调用 db.query() 执行删除文章分类的 SQL 语句：
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')

        // 删除文章分类成功
        res.cc('删除文章分类成功！', 0)
    })
}
//根据Id获取文章分类的处理函数
exports.getArticleById = (req, res) => {
    // 定义根据 Id 获取文章分类的 SQL 语句：
    const sql = `select * from ev_article_cate where id=?`

    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')

        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}
// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查重的 SQL 语句
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    // 执行查重操作
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 定义更新文章分类的 SQL 语句
        const sql = `update ev_article_cate set ? where Id=?`

        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })
    })
}