var express = require("express");
const PublicController = require("../controllers/PublicController");

var router = express.Router();
router.get("/", PublicController.postList);
router.get("/:forPost/comments", PublicController.commentList);

module.exports = router;