// 导入定义验证的模块
const joi = require('joi');

// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();
// 定义 分类Id 的校验规则
const id = joi.number().integer().min(1).required();

// 共享验证规则对象 新增文章分类
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 删除文章分类的验证对象
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 根据 id 获取文章分类的规则对象
exports.get_cate_schema = {
    params: {
        id
    }
}

// 根据 id 更新文章分类的规则对象
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}