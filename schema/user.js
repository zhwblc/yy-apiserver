// 导入 joi 来定义验证规则
const joi = require('joi')

// 定义验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
    // dataUri() 指的是如下格式的字符串数据：
    // data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 注意：这里不定义的，不会进行 body 赋值

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// 定义更新用户信息的验证规则
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

// 定义更新用户密码的验证规则
exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 定义更新用户头像的验证规则
exports.update_avatar_schema = {
    body: {
        avatar
    }
}