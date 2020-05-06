const Post = require("../models/post");

exports.createPost = (req,res,next) => {
  const url = req.protocol + "://" + req.get("host") + '/images/';
  const post = new Post({title: req.body.title, content: req.body.content, imagePath: url + req.file.filename, creator: req.userData.userId });
  post.save().then(result => {
    res.status(201).json({
      message: "Post added",
      post: { ...result, id: result._id }
    });
  }).catch(err => {
    res.status(500).json({ message: "Creating post failed" });
  });
}

exports.getPost = (req,res,next) => {
  Post.findById(req.params.id).then(result => {
    if(result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  }).catch(err => {
    res.status(500).json({ message: "Error while fetching posts" })
  });
}

exports.getPosts = (req,res,next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(results => {
    fetchedPosts = results;
    return Post.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: fetchedPosts,
      postCount: count
    });
  }).catch(err => {
    res.status(500).json({ message: "Error while fetching posts" })
  });
}

exports.editPost = (req,res,next) => {
  console.log(req);
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + "://" + req.get("host") + '/images/';
    imagePath = url + req.file.filename;
  }
  const post = new Post({ _id: req.params.id, title: req.body.title, content: req.body.content, imagePath: imagePath, creator: req.userData.userId });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if(result.n > 0) {
      res.status(200).json({ message: "Updated" });
    } else {
      res.status(401).json({ message: "Not authorized to update" });
    }
  }).catch(err => {
    res.status(500).json({ message: "Could not update post" });
  });
}

exports.deletePost = (req,res,next) => {
  Post.deleteOne({ _id : req.params.id, creator: req.userData.userId }).then(result => {
    if(result.n > 0) {
      res.status(200).json({ message: "Post deleted" });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  }).catch(err => {
    res.status(500).json({ message: "Error while deleting post" })
  })
}
