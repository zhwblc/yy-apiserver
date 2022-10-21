const path = require('path');
// 导入数据库操作模块
const db = require(path.join(__dirname, '../db/index'));
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs');
// 导入 jsonwebtoken 包
const jwt = require('jsonwebtoken');
// 导入全局的配置文件
const config = require(path.join(__dirname, '../config'));

exports.regUser = (req, res) => {
    // 获取用户提交的数据
    const userinfo = req.body;
    // 对表单中的数据进行合法性效验
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({ status: 1, message: '用户名或密码不合法!' });
    //     return res.cc('用户名或密码不合法!');
    // }

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlSelect = 'select * from ev_users where username=?';
    db.query(sqlSelect, userinfo.username, (err, results) => {
        // 执行失败
        if (err) return res.cc(err);
        // 判断用户名是否被占用
        if (results.length > 0) return res.cc('用户名被占用!');
        // TODO: 用户名可以使用
        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义 SQL 语句，插入用户信息
        const sqlInsert = 'insert into ev_users set ?';
        // 调用 db.query() 执行 SQL 语句
        db.query(sqlInsert, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('注册用户失败, 请稍后再试!');
            // 注册用户乘公共
            // res.send({ status: 0, message: '注册用户成功!' });
            res.cc('注册用户成功!', 0);
        });
    });

    // res.send('reguser ok');
};

exports.login = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    // 定义 SQL 语句
    const sqlSelect = 'select * from ev_users where username=?';
    // 执行 SQL 语句，根据用户名查询用户信息
    db.query(sqlSelect, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
        if (results.length !== 1) return res.cc('登陆失败!');
        // TODO: 判断密码是否正确
        const compareResults = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResults) return res.cc('密码错误!');
        // res.cc('登陆成功!');
        // TODO: 生成 token 发送给客户端
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = {...results[0], password: '', user_pic: '' };
        // 对用户信息进行加密，生成 token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecertKey, { expiresIn: config.expirersIn });
        // 调用 res.send() 将 token 响应给客户端
        res.send({
            status: 0,
            message: '登陆成功!',
            token: 'Bearer ' + tokenStr
        });
    });

    // res.send('login ok');
};