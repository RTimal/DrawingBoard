var config = {
	mongouri: "mongodb://nodejitsu_rtimal:1jc5n6unaa71snflejrkgivk9s@ds043947.mongolab.com:43947/nodejitsu_rtimal_nodejitsudb1406254654",
	s3key: "AKIAIRNKBR7QFUDWQ3PQ",
	s3secret: "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",
	s3bucket: "thedrawingboard",
}
config.s3BucketURL = "https://s3.amazonaws.com/" + config.s3bucket + "/";

module.exports = config;