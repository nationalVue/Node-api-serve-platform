//导入数据库操作模块
const db = require('../db/index')
//导入处理密码的模块
const bcrypt = require('bcryptjs')
//获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    //定义查询用户信息的SQL语句
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('获取用户信息失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
        res.send()
    })
}

//更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    //定义待执行的SQL语句
    const sql = `update ev_users set ? where id=?`
    //调用db.query()执行SQL语句并传递参数
    db.query(sql, [req.body, req.body.id], (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败')
        //成功
        res.cc('更新用户成功', 0)

    })
}
//更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    //根据id查询用户的信息
    const sql = `select * from ev_users where id=?`
    // 执行 SQL 语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')

        //判断密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('旧密码错误！')

        //定义更新密码的SQL语句
        const sql = `update ev_users set password=? where id=?`

        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        // 执行 SQL 语句，根据 id 更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')

            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
}
//更新用头像的处理函数
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
}