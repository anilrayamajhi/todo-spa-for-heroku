//dotenv: is more for local testing; {silent: true}: avoid throwing error coming for it
const dotenv = require('dotenv').load({silent: true});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
var app = express();

mongoose.connect(process.env.MONGO_URL, function(err) {
	console.log(process.env.MONGO_URL);//check connetion with mLab in nodemon
	if (err) console.log(err);
	else console.log('Succesfully connected to my-first-spa database');
});

var ItemSchema = mongoose.Schema({
	title: String,
	done: {type: Boolean, default: false},
	dateCreated: {type: Date, default: Date.now }
});
var Item = mongoose.model('Item', ItemSchema);

app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile('index.html', {
		root: __dirname + '/public/'
	});
});

// GETTING ALL TODOS:
app.get('/items', function(req, res) {
	Item.find({}, function(err, items) {
		res.json(items);
	})
});

// ADDING NEW TODOS:
app.post('/items', function(req, res) {
  Item.create(req.body, function(err, todo) {
    res.json(todo)
  })
})

// REMOVING A TODO item:
app.delete('/items/:id', function(req, res) {
  Item.findByIdAndRemove(req.params.id, function(err, todo) {
    if(todo) return res.json({message: "Item deleted.", success: true})
    res.json({message: "No todo to delete.", success: false})
  })
})

app.listen(PORT, function() {
	console.log('Server started on port: ' + PORT);
});
