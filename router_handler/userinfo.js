const path = require('path');
// 导入数据库操作模块
const db = require(path.join(__dirname, '../db/index'));
// 导入处理密码的模块
const bcrypt = require('bcryptjs');

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    //    定义查询用户信息的 SQL 语句
    const sqlSelect = 'select id, username, nickname,email, user_pic from ev_users where id=?';
    // 调用 db.query() 执行 SQL 语句
    db.query(sqlSelect, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是查询结果可能为空
        if (results.length !== 1) return res.cc('获取用户基本信息失败!');

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户基本信息成功!',
            data: results[0]
        });
    });
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 获取用户基本信息
    const userinfo = req.body;
    // 定义 SQL
    const sqlUpdate = 'update ev_users set ? where id=?';
    // 执行 SQL
    db.query(sqlUpdate, [userinfo, userinfo.id], (err, results) => {
        // 执行 SQL 失败
        if (err) return res.cc(err);
        // 执行 SQL 成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('更新用户基本信息失败!');
        // 成功
        res.cc('更新用户基本信息成功', 0);
    });
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 根据 id 查询用户信息
    const sqlSelect = 'select * from ev_users where id=?';
    // 执行 SQL
    db.query(sqlSelect, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('查询失败!');
        // res.cc('查询成功!', 0);
        // TODO: 判断提交的旧密码是否正确
        const compareResults = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResults) return res.cc('旧密码错误!');

        // TODO: 更新数据库的密码
        // res.cc('ok', 0);
        const sqlUpdatePwd = 'update ev_users set password=? where id=?';
        // 对密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        // 执行 SQL
        db.query(sqlUpdatePwd, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            // console.log(results, newPwd, req.body);
            if (results.affectedRows !== 1) return res.cc('更新密码失败!');
            res.cc('更新密码成功!', 0);
        });
    });
}

// 更新用户头像
exports.updateAvatar = (req, res) => {
    // 更新用户头像的 SQL
    const sqlUpdate = 'update ev_users set user_pic=? where id=?';
    // 执行 SQL
    db.query(sqlUpdate, [req.body.avatar, req.user.id], (err, results) => {
        // 执行失败
        if (err) return res.cc(err);
        // 执行成功，但是影响的行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败!');
        res.cc('更新头像成功!', 0);
    });


    // res.send('ok');
}