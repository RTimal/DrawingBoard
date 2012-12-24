var storage = require('../storage');
var schema = storage.mongoose.Schema({
	artworkid : 'string',
	userid: 'string',
	url: 'string',
	thumburl: 'string'
});

function Artwork() {
	this.data = data;
	this.userid = userid;
	//store to s3
	//store url under users id

	this.save = function(data,uid) {
		var png = this.convertToPNG(data);
		this.storetoS3(png, uid);

	}

	this.convertToPNG = function(data) {
		//convert from base64
		//return data
	}

	this.storeToS3 = function(png, uid) {
		var self = this;
		var req = storage.s3client.put('/' + uid + '/artwork.png', {
			'Content-Length': data.length,
			'Content-Type' : 'image/png'
		});

		req.on('response', function(res) {
			if(200 == res.statusCode) {
				self.storeToMongo(uid, req.url);
			}
		});
	}

	this.storeToMongo = function() {
		var Artwork = storage.mongoose.model('Artwork', schema);
		Artwork.save(function(err) {
			if(err) {
				console.log("error");
			}
		});
	}

}

exports = new Artwork;