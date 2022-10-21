const express = require('express');
const path = require('path');
// 创建路由对象
const router = express.Router();

// 导入用户路由处理函数对应的模块
const user_handler = require(path.join(__dirname, '../router_handler/user'));

// 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { reg_login_schema } = require(path.join(__dirname, '../schema/user'));

// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser);
// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login);

// 将路由共享出去
module.exports = router;