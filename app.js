var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");

// MongoDB Databae Connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	if(process.env.NODE_ENV !== "test") {
		console.log("[Server] Connected to Database : %s \n", MONGODB_URL);
		console.log("[Server] Node.js Server is Running... \n");
		console.log("[Server] Press Ctrl+C to stop the process. \n");
	}
})
.catch(err => {
	console.error("Failed to start the application :", err.message);
	process.exit(1);
});

var db = mongoose.connection;

var app = express();

if(process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Allowing CORS request
app.use(cors());

// Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// If URL not found throw 404 response
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if(err.name == "UnauthorizedError"){
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;
