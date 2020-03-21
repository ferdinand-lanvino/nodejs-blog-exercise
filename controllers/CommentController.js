const Comment = require("../models/CommentModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Comment Schema
function CommentData(data) {
	this.id = data._id;
	this.forPost = data.forPost;
    this.postedBy = data.postedBy;
	this.content = data.content;
	this.createdAt = data.createdAt;
}


/**
 * Comment List.
 * 
 * @param {string}  forPost
 * 
 * @returns {Object}
 */
exports.commentList = [
	auth,
	function (req, res) {
		try {
			Comment
			.find({forPost: req.params.forPost},"_id forPost postedBy content createdAt")
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

/**
 * Comment Store.
 * 
 * @param {string}  forPost
 * @param {string}  content
 * 
 * @returns {Object}
 */
exports.commentStore = [
    auth,
    body("content", "Content must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
    (req, res) => {
		try {
			const errors = validationResult(req);
			var comment = new Comment(
				{ forPost: req.params.forPost,
					postedBy: req.user,
					content: req.body.content
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            
			else {
				//Save comment.
				comment.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let commentData = new CommentData(comment);
					return apiResponse.successResponseWithData(res,"Post add Success.", commentData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Comment update.
 * 
 * @param {string}  forPost
 * @param {string}  content
 * @returns {Object}
 */
exports.commentUpdate = [
	auth,
    body("content", "Content must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var comment = new Comment(
				{ forPost: req.params.forPost,
					postedBy: req.user,
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
					Comment.findById({forPost: req.params.forPost, _id: req.params.id}, function (err, foundComment) {
						if(foundComment === null){
							return apiResponse.notFoundResponse(res,"Comment not exists with this id");
						}else{
							//Check authorized user is the same with postedBy filed (comment author)
							if(foundComment.postedBy.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update comment.
								Comment.findByIdAndUpdate({forPost: req.params.forPost, _id: req.params.id}, comment, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let commentData = new CommentData(comment);
										return apiResponse.successResponseWithData(res,"Comment update success.", commentData);
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
 * Comment Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.commentDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Comment.findById({forPost: req.params.forPost, _id: req.params.id}, function (err, foundComment) {
				if(foundComment === null){
					return apiResponse.notFoundResponse(res,"Comment not exists with this id");
				}else{
					//Check authorized user is the same with author
					if(foundComment.postedBy.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete comment.
						Comment.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Comment delete Success.");
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