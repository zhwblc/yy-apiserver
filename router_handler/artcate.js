// 这是路由的处理函数模块

const path = require('path');
// 导入数据库操作模块
const db = require(path.join(__dirname, '../db/index'));

// 获取文章信息的处理函数
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sqlSelect = 'select * from ev_article_cate  where is_delete=0 order by id';
    // 调用 db.query() 执行 SQL 语句
    db.query(sqlSelect, (err, results) => {
        // 执行失败
        if (err) return res.cc(err);
        // 执行成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功!',
            data: results
        });
    });

    // res.send('ok');
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 接收客户端的数据
    const article = req.body;
    //  定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sqlSelect = 'select * from ev_article_cate  where name=? or alias=?';
    // 执行 SQL
    db.query(sqlSelect, [article.name, article.alias], (err, results) => {
        // 执行失败
        if (err) return res.cc(err);

        // 执行成功
        // 1. 查出来 2 条，分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称和别名都被占用!');
        // 2. 查出来 1 条，分类名称 或 分类别名 其中一个被占用
        if (results.length === 1) {
            // 接收查询出来的数据
            const reslutArticle = results[0];
            if (reslutArticle.name === article.name && reslutArticle.alias === article.alias) return res.cc('分类名称和别名都被占用!');
            return reslutArticle.name === article.name ? res.cc('分类名称被占用!') : res.cc('分类别名被占用!');
        }

        // TODO: 分类名称 和 分类别名 都可用，执行添加操作
        // 定义新增文章分类 SQL
        const sqlInsert = 'insert into ev_article_cate set ?';
        // 执行 SQL
        db.query(sqlInsert, req.body, (err, results) => {
            if (err) res.cc(err);
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败!');
            res.cc('新增文章分类成功!', 0);
        });
    });

    // res.send('ok');
}

// 根据 id 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 定义标记删除文章分类的 SQL
    const sqlDelete = 'update ev_article_cate set is_delete=1 where id=?';
    // 执行 SQL
    db.query(sqlDelete, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败!');
        res.cc('删除文章分类成功!', 0);
    });
    // res.send('ok');
}

// 根据 id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // 定义根据 id 获取文章分类的 SQL
    const sqlSelect = 'select * from ev_article_cate where id=?';
    // 执行 SQL
    db.query(sqlSelect, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取文章信息失败!');
        // 把获取到的文章信息返回给客户端
        res.send({
            status: 0,
            message: '获取文章信息成功!',
            data: results[0]
        });
    });

    // res.send('ok');
}

// 根据 id 更新文章分类的路由
exports.updateCateById = (req, res) => {
    // 接收客户端的数据
    const article = req.body;
    // 判断 分类名称 和分类别名 是否被占用
    //  定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sqlSelect = 'select * from ev_article_cate  where id<>? and is_delete=0 and (name=? or alias=?)';
    // 执行 SQL
    db.query(sqlSelect, [article.id, article.name, article.alias], (err, results) => {
        // 执行失败
        if (err) return res.cc(err);

        // 执行成功
        // 1. 查出来 2 条，分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称和别名都被占用!');
        // 2. 查出来 1 条，分类名称 或 分类别名 其中一个被占用
        if (results.length === 1) {
            // 接收查询出来的数据
            const reslutArticle = results[0];
            if (reslutArticle.name === article.name && reslutArticle.alias === article.alias) return res.cc('分类名称和别名都被占用!');
            return reslutArticle.name === article.name ? res.cc('分类名称被占用!') : res.cc('分类别名被占用!');
        }

        // 分类名称 和分类别名 没被占用
        // 根据 id 更新文章分类
        // 定义 SQL
        const sqlUpdate = 'update ev_article_cate set ? where id=?';
        // 执行 SQL
        db.query(sqlUpdate, [article, article.id], (err, results) => {
            // 执行失败
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败!');
            // 执行成功
            res.cc('更新文章分类成功!', 0);
        });

    });


    // res.send('ok');
}