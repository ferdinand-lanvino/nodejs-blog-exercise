var express = require("express");
const PostController = require("../controllers/PostController");
const CommentController = require("../controllers/CommentController");

var router = express.Router();
router.get("/", PostController.postList);
router.get("/:id", PostController.postDetail);
router.post("/", PostController.postStore);
router.put("/:id", PostController.postUpdate);
router.delete("/:id", PostController.postDelete);

router.get("/:forPost/comments", CommentController.commentList);
router.post("/:forPost/comments", CommentController.commentStore);
router.put("/:forPost/comments/:id", CommentController.commentUpdate);
router.delete("/:forPost/comments/:id", CommentController.commentDelete);

module.exports = router;