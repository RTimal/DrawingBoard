var config = require('./config');

var mongoose = require('mongoose');
mongoose.connect(config.mongouri);

var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: config.s3key, secretAccessKey: config.s3secret});
AWS.config.update({region: 'us-east-1'});
//AWS.config.loadFromPath('modules/config.json');
var s3 = new AWS.S3();

exports.mongoose = mongoose;
exports.s3 = s3;
exports.config = config;
exports.gets3Url = function() {
	return config.s3BucketURL;
}