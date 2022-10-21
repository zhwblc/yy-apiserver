const express = require('express');
const router = express.Router();
const path = require('path');
// 导入处理函数模块
const artcate_handler = require(path.join(__dirname, '../router_handler/artcate'));

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要验证的规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require(path.join(__dirname, '../schema/artcate'));

// 获取文章信息的路由
router.get('/cates', artcate_handler.getArticleCates);
// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates);
// 根据 id 删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById);
// 根据 id 获取文章分类的数据的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById);
// 根据 id 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById);

module.exports = router;