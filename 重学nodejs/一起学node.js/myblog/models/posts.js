var marked = require('marked');
var Post = require('../lib/mongo').Post;
var CommentModel = require('./comments');
// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});
// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount;
        return post;
      });
    }));
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  }
});

module.exports = {
  // 创建一篇文章
  create: function create(post) {
    return Post.create(post).exec();
  },

  // 通过文章 id 获取一篇文章
  getPostById: function getPostById(postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts: function getPosts(author) {
    var query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },

  // 通过文章 id 给 pv 加 1
  incPv: function incPv(postId) {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
      .exec();
  },
    // 通过文章 id 获取一篇原生文章（编辑文章）
	getRawPostById: function getRawPostById(postId) {
	  return Post
	    .findOne({ _id: postId })
	    .populate({ path: 'author', model: 'User' })
	    .exec();
	},

	// 通过用户 id 和文章 id 更新一篇文章
	updatePostById: function updatePostById(postId, author, data) {
	  return Post.update({ author: author, _id: postId }, { $set: data }).exec();
	},

	// 通过用户 id 和文章 id 删除一篇文章
	delPostById: function delPostById(postId, author) {
	  return Post.remove({ author: author, _id: postId })
      .exec()
      .then(function (res) {
        // 文章删除后，再删除该文章下的所有留言
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId);
        }
      });
	}
	// 注意：不要忘了在适当位置添加逗号，如 incPv 的结束大括号后。
	// 注意：我们通过新函数 getRawPostById 用来获取文章原生的内容，而不是用 getPostById 返回将 markdown 转换成 html 后的内容。
};
// 需要讲解两点：

// 我们使用了 markdown 解析文章的内容，所以在发表文章的时候可使用 markdown 语法（如插入链接、图片等等），关于 markdown 的使用请参考： Markdown 语法说明。
// 我们在 PostModel 上注册了 contentToHtml，而 addCreatedAt 是在 lib/mongo.js 中 mongolass 上注册的。