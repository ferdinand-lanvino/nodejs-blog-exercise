var express = require("express");
var authRouter = require("./auth");
var postRouter = require("./post");
var publicRouter = require("./public");

var app = express();

app.use("/auth/", authRouter);
app.use("/post/", postRouter);
app.use("/public/", publicRouter);

module.exports = app;