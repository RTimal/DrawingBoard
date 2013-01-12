
(function(){
	var config = require('./config');
	var mongoose = require('mongoose');
	var knox = require('knox');
	mongoose.connect(config.mongouri);

	//var AWS = require('aws-sdk');
	//AWS.config.update({accessKeyId: config.s3key, secretAccessKey: config.s3secret});
	//AWS.config.update({region: 'us-east-1'});
	//AWS.config.loadFromPath('modules/config.json');
	//var s3 = new AWS.S3();

	var s3 = {};
	s3.client = knox.createClient({
		key: config.s3key,
		secret: config.s3secret,
		bucket: config.s3bucket
	});

	function storage() {
		this.getConfig = function() {
			return config;
		}

		this.gets3Url = function() {
			return config.s3BucketURL;
		}

		this.getS3Client = function() {
			return s3.client;
		}

		this.getMongoose = function() {
			return mongoose;
		}

		this.getAws = function() {
			return AWS;
		}
	}

	module.exports = new storage();

})();