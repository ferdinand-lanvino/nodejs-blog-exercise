var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: {type: String, required: true},
    content: {type: String, required: true},
	author: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);