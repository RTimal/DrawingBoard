var storage = require('../storage');
var artworkschema = storage.mongoose.Schema({
	art_id : 'string',
	user_id: 'string',
	url: 'string',
	title: 'string',
});

function Artwork () {
	//store to s3
	//store url under users id
	this.setData = function(img) {
		this.uid = img.uid;
		this.title = img.title;
		this.imageData = img.imagedata;
	}, 

	this.save = function() {
		this.store(this.convertToPNG());
	}

	this.convertToPNG = function() {
		//use this .imageData
		//convert from base64
		//return data
	}

	this.store = function(png) {
		var self = this;
		//store to s3
		var req = storage.s3.put('/' + self.uid + '/artwork.png', {
			'Content-Length': png.length,
			'Content-Type' : 'image/png'
		});

		req.on('response', function(res) {
			if(200 == res.statusCode) {
				self.storeToMongo(req.url);
			}
		});
	}

	this.storeToMongo = function(url) {

		var Artwork = storage.mongoose.model('Artwork', artworkschema);
		
		var drawing = new Artwork({
			art_id: "id",
			user_id: this.uid,
			url: url,
			title: this.title
		});

		drawing.save(function (err) {
			if(err) {
				console.log("error");
			}
		});
	}

}

module.exports = new Artwork();