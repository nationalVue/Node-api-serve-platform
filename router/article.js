//文章的路由模块
// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
//导入需要的处理函数模块
const article_handler = require('../router_handler/article')
// 导入 multer 和 path
const multer = require('multer')
const path = require('path')
// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') })
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_article_schema } = require('../schema/article')
// 发布文章的路由
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

// 向外共享路由对象
module.exports = router