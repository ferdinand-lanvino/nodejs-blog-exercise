const Post = require("../models/PostModel");
const Comment = require("../models/CommentModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);


/**
 * Post List.
 * 
 * @returns {Object}
 */
exports.postList = [
	function (req, res) {
		try {
			Post
			.find({},"_id title author content createdAt updatedAt ")
			.populate("author","email firstName lastName")
			.then((posts)=>{
				if(posts.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", posts);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Comment List.
 * 
 * @param {string}  forPost
 * 
 * @returns {Object}
 */
exports.commentList = [
	function (req, res) {
		try {
			// Comment.find({forPost: req.params.forPost},"_id forPost postedBy content createdAt").then((comments)=>{
			// 	if(comments.length > 0){
			// 		return apiResponse.successResponseWithData(res, "Operation success", comments);
			// 	}else{
			// 		return apiResponse.successResponseWithData(res, "No Comments", []);
			// 	}
			// });
			Comment
			.find({forPost: req.params.forPost},"_id  forPost postedBy content createdAt updatedAt")
			.populate("postedBy","email firstName lastName")
			.then((comments)=>{
				if(comments.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", comments);
				}else{
					return apiResponse.successResponseWithData(res, "No Comments", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];







