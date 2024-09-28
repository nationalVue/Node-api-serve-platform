// 导入express模块
const express = require('express')
// 创建express的服务器实例
const app = express()
const joi = require('joi')


//导入cors中间件
const cors = require('cors')
//将cors注册为全局中间件
app.use(cors())

// 配置解析 application / x - www - form - urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

//一定要在路由之前，封装res.cc函数
// 响应数据的中间件
app.use((req, res, next) => {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

//一定要在路由之前配置解析Token的中间件
const expressJwt = require('express-jwt')
const config = require('./config')

app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))


//导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
//导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
//导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')

app.use('/my/article', artCateRouter)

//导入并使用文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 错误中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})


//调用app.listen方法，指定端口号并启动web服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})


