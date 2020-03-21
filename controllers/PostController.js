const Post = require("../models/PostModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Post Schema
function PostData(data) {
	this.id = data._id;
	this.title= data.title;
	this.author = data.author;
	this.content = data.content;
	this.createdAt = data.createdAt;
}


/**
 * Post List.
 * 
 * @returns {Object}
 */
exports.postList = [
	auth,
	function (req, res) {
		try {
			Post.find({author: req.user._id},"_id title author content createdAt").then((posts)=>{
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
 * Post Detail.
 * 
 * @param {string}  id
 * 
 * @returns {Object}
 */
exports.postDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Post.findOne({_id: req.params.id},"_id title author content createdAt").then((post)=>{                
				if(post !== null){
					let postData = new PostData(post);
					return apiResponse.successResponseWithData(res, "Operation success", postData);
				}else{
					return apiResponse.successResponseWithData(res, "Data Not Found", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Post store.
 * 
 * @param {string}      title 
 * @param {string}      content
 * 
 * @returns {Object}
 */
exports.postStore = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
    body("content", "Content must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var post = new Post(
				{ title: req.body.title,
					author: req.user,
					content: req.body.content
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            
			else {
				//Save post.
				post.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let postData = new PostData(post);
					return apiResponse.successResponseWithData(res,"Post add Success.", postData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Post update.
 * 
 * @param {string}      title 
 * @param {string}      content
 * @param {string}      _id
 * @returns {Object}
 */
exports.postUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
    body("content", "Content must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var post = new Post(
				{ title: req.body.title,
					author: req.user,
					content: req.body.content,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Post.findById(req.params.id, function (err, foundPost) {
						if(foundPost === null){
							return apiResponse.notFoundResponse(res,"Post not exists with this id");
						}else{
							//Check authorized user is the same with post author
							if(foundPost.author.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update post.
								Post.findByIdAndUpdate(req.params.id, post, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let postData = new PostData(post);
										return apiResponse.successResponseWithData(res,"Post update Success.", postData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Post Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.postDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Post.findById(req.params.id, function (err, foundPost) {
				if(foundPost === null){
					return apiResponse.notFoundResponse(res,"Post not exists with this id");
				}else{
					//Check authorized user is the same with post author
					if(foundPost.author.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete post.
						Post.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Post delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];