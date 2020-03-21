var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    forPost: { type: Schema.ObjectId, ref: "Post", required: true },
    postedBy: { type: Schema.ObjectId, ref: "User", required: true },
    content: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Comment", CommentSchema);