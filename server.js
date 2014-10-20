//Base SETUP

var express=require('express');
var app=express();

var bodyParser=require('body-parser');

var mongoose=require('mongoose');
//connect our mongodb
mongoose.connect('mongodb://localhost/cooks')

var Bear = require('./app/model/bear');

//config app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

//Route for our api
//get an instance of express
var router = express.Router();

router.use(function(req, res, next){
	console.log('Something is happening.');
	next();
})
//test route to make sure everything is working(accessed at GET http://localhost:3000/api)
router.get('/', function(req, res){
	res.json({message: 'hooray! Welcome to our api'});
});

//on routes that end in /bears
router.route('/bears')
	//create a bear(access at POST http:localhost:3000/api/bears)
	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
		
		var bear = new Bear(); 		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		// save the bear and check for errors
		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});
		
	})
	.get(function(req, res){
		Bear.find(function(err, bears){
			if(err){
				res.send(err);
			}
			res.json(bears);
		});
	});

	router.route('/bears/:bear_id')
		.get(function(req, res){
			Bear.findById(req.params.bear_id, function(err, bear){
				if(err){
					res.send(err);
				}
				res.json(bear);
			});
		})
		.put(function(req, res){
			Bear.findById(req.params.bear_id, function(err, bear){
				if(err){
					res.send(err);
				}

				bear.name = req.params.name;
				bear.save(function(err){
					if(err){
						res.send(err);
					}

					res.json({message : 'update successfully!'});
				});
			});
		})
		.delete(function(req, res){
			Bear.remove({_id: req.params.bear_id}, function(err, bear){
				if(err){
					res.send(err);
				}

				res.json({message : 'successfully!'});
			});
		});

//register our router
//all of our routers will be prefixed with /api
app.use('/api', router);

//start the server
app.listen(port);
console.log('Magic happens on port ' + port);




