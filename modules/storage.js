var config = require('./config');
var mongoose = require('mongoose');
var knox = require('knox');
var s3sclient = knox.createClient({
	key:config.s3key,
	secret:config.s3secret,
	bucket:config.s3bucket
});
mongoose.connect(config.mongoip, config.mongodbname);
exports.mongoose = mongoose;
exports.s3client = s3client;