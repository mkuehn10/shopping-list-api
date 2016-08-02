var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {
        name: name,
        id: this.id
    };
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {
    var removeLocation = -1;
    this.items.forEach(function(item, location) {
        if (item.id == id) {
            removeLocation = location;
        }
    });
    if (removeLocation === -1) {
        return this.items;
    }
    return this.items.splice(removeLocation, 1);
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.listen(process.env.PORT || 8080);

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    if (!req.params.id) {
        return res.sendStatus(400);
    }
    var id = req.params.id;
    var removed = storage.remove(id);
    res.status(200).json(removed);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body.name) {
        return res.sendStatus(400);
    }
    var id = req.params.id;
    storage.items[id].name = req.body.name;
    res.status(200).json(storage.items[id]);
});

exports.app = app;
exports.storage = storage;