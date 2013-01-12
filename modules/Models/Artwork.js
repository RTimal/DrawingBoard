var storage = require('../storage');
var Utils = require('../Utils');

var artworkschema = storage.getMongoose().Schema({
	art_id : 'string',
	user_id: 'string',
	url: 'string',
	title: 'string',
	created: {type: Date, default: Date.now},
	updated: {type:Date, default: Date.now}
});

function Artwork () {
	this.setData = function(data) {
		for(var prop in data) {
			this[prop] = data[prop];
		}
		this.unique_id = Utils.uniqid();
		this.filename = this.unique_id + ".png";
		this.convertToPNG();
		this.fileUrl = storage.gets3Url() + this.filename;
	}, 

	this.convertToPNG = function() {
		var b64image = this.image.replace(/^data:image\/\w+;base64,/, "");
		this.image = new Buffer(b64image, 'base64');
	}

	this.save = function() {
		var self = this;

 		/* var data = {Bucket: 'thedrawingboard', Key: this.filename, Body: this.image};
	  		storage.getS3Client().putObject(data, function(err, data) {
	  			console.log(data);
	  			self.storeToMongo();
	  		});
	  	*/

	  	var req = storage.getS3Client().put(this.filename, {
	  		'Content-Length': self.image.length,
	  	});

	  	req.on('response', function(res) {
	  		console.log(res.statusCode);
	  		if(200 == res.statusCode) {
	  			console.log('saved to %s', req.url);
	  			self.storeToMongo();
	  		}
	  	});

	  	req.end(this.image);
	}

	this.storeToMongo = function() {

		var Artwork = storage.getMongoose().model('Artwork', artworkschema);
		
		var drawing = new Artwork({
			art_id: this.unique_id,
			user_id: this.uid,
			url: this.fileUrl,
			title: this.title
		});

		drawing.save(function (err) {
			if(err) {
				console.log("error");
			} else {
				return true;
			}
			storage.getMongoose().connection.close();
		});

	}

}

module.exports = new Artwork();