var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });


    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({
                'name': 'Kale'
            })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });

    // Edit the Kale item just added
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/0')
            .send({name: 'New Item', id: 0})
            .end(function(err, res) {
                should.equal(err, null);
                storage.items[0].name.should.equal('New Item');
                res.should.have.status(200);
                done();
            });
            
    });
    
    // Delete the Kale item just added
    it('should delete an item on delete', function(done) {
        // console.log(storage.items);
        chai.request(app)
            .delete('/items/3')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                storage.items.should.have.length(3);
                should.equal(storage.items[3], undefined);
                done();
            });
    });

    it('should return the same list when deleting an id that does not exist', function(done) {
        var preDelete = storage.items;
        chai.request(app)
            .delete('/items/45')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                storage.items.should.equal(preDelete);
                done();
            });
    });
});