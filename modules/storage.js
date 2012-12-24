var config = require('./config');
var mongoose = require('mongoose');
var knox = require('knox');
var s3client = knox.createClient({
	key:config.s3key,
	secret:config.s3secret,
	bucket:config.s3bucket
});
mongoose.connect(config.mongouri);
exports.mongoose = mongoose;
exports.s3 = s3client;