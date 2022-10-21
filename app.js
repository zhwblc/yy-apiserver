// 导入 express
const express = require('express');
// 创建服务器的实例
const app = express();

const path = require('path');

// 托管静态资源文件
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 导入 joi 来定义验证规则
const joi = require('joi')

// 导入 cors 跨域
const cors = require('cors');
app.use(cors());

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 一定要在路由之前封装 res.cc 函数
app.use((req, res, next) => {
    // status 的默认值为 1，表示失败
    // err 的值，可能是一个错误对象，也有可能是一个错误描述的字符串
    res.cc = function (err, status = 1) {
        res.send({
            status, // ES6 对象中属性名和属性值相同时，可以简写
            messages: err instanceof Error ? err.message : err
        });
    }
    next();
});

// 一定要在路由之前配置解析 token 的中间件
const expressJwt = require('express-jwt');
const config = require(path.join(__dirname, '/config'));

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJwt({ secret: config.jwtSecertKey }).unless({ path: [/^\/api\//] }));

// 导入并使用用户路由模块
const userRouter = require(__dirname + '/router/user');
app.use('/api', userRouter);
// 导入并使用用户信息的路由模块
const userinfoRouter = require(__dirname + '/router/userinfo');
app.use('/my', userinfoRouter);
// 导入并使用文章分类的路由
const artCateRouter = require(path.join(__dirname, '/router/artcate'));
app.use('/my/article', artCateRouter);
// 导入并使用文章内容的路由
const addArticle = require(path.join(__dirname, '/router/article'));
app.use('/my/article', addArticle);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    // 身份认证失败
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败!');
    // 未知的错误
    else res.cc(err);
});

// 启动服务器
app.listen(8080, () => {
    console.log('App running at http://127.0.0.1:8080');
});