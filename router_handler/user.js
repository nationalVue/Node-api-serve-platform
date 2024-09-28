/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
//导入数据库操作模块
const db = require(('../db/index'))
//导入bcryptjs这个包
const bcrypt = require('bcryptjs')
//导入生成的Token的包
const jwt = require('jsonwebtoken')
const config = require('../config')
//注册用户的处理函数
exports.regUser = (req, res) => {

    const userinfo = req.body
    //判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        return res.send({ status: 1, message: '用户名或密码不能为空' })
    }

    //定义SQL语句，查询用户名是否被占用
    const sqlStr = `select * from ev_users where username=? `
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        //用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 在注册用户的处理函数中，确认用户名可用之后，调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理：
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        //定义插入新用户的SQL语句
        const sql = 'insert into ev_users set ?'
        // 调用db.query()执行SQL语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断SQL语句是否执行成功
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return req.cc(err)
            //判断影响行数是否为1
            // if (results.affectedRows !== 1) return res.send({
            //     status: 1, message: '注册用户失败，请稍后重试!'
            // })
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后重试!')
            //注册用户成功
            // res.send({ status: 0, messsage: '注册成功！' })
            res.cc('注册成功', 0)
        })
    })
}

//登录的处理函数
exports.login = (req, res) => {
    //接受表单的数据
    const userinfo = req.body
    //定义SQL语句
    const sql = 'select * from ev_users where username=?'
    //执行SQL语句，根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行语句成功，但是获取的数据条数不等于1
        if (results.length !== 1) return res.cc('登陆失败！')
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('登陆失败！')


        const user = { ...results[0], password: '', user_pic: '' }
        //对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        console.log(tokenStr)
        //调用res.send()将token响应给客户端
        res.send({
            status: 0,
            message: '登陆成功!',
            token: 'Bearer ' + tokenStr
        })
    })
} 