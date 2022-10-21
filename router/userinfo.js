const express = require('express');
const router = express.Router();
const path = require('path');

// 导入路由处理模块
const userinfo_handler = require(path.join(__dirname, '../router_handler/userinfo'));

// 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require(path.join(__dirname, '../schema/user'));

// 挂载路由
// 获取用户基本信息的处理函数
router.get('/userinfo', userinfo_handler.getUserInfo);
// 更新用户基本信息的处理函数
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo);
// 重置密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword);
// 更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar);

module.exports = router;