const express = require("express");
const checkAuth = require("../middleware/check-auth");
const postsController = require("../controllers/posts");
const imageFileMiddleware = require("../middleware/image-file");

const router = express.Router();

router.post("", checkAuth, imageFileMiddleware, postsController.createPost);

router.get("", postsController.getPosts);

router.delete("/:id", checkAuth, postsController.deletePost);

router.put("/:id", checkAuth, imageFileMiddleware, postsController.editPost);

router.get("/:id", postsController.getPost)

module.exports = router;
