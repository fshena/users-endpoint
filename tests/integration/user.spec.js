require('dotenv').config();

const chai          = require('chai');
const chaiHttp      = require('chai-http');
const models        = require('../../src/models/index');
const server        = require('../../devServer');
const userMysqlRepo = require('../../src/repository/mysql/user-repository');
const should        = chai.should();
const assert        = chai.assert;

chai.use(chaiHttp);

const userRecord = {
    first_name: 'Florian',
    last_name: 'Shena',
    email: 'florian.shena@gmail.com',
    password: 'password',
    roleId: 0,
    isActive: 0,
};

describe('User', () => {
    before(async () => {
        await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await models.User.sync({ force: true });
        await models.User.create(userRecord);
        await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });
    describe('GET /users', () => {
        it('should return an array of User objects', (done) => {
            chai.request(server)
                .get('/users')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    res.body[0].should.be.an('object');
                    done();
                });
        });
        it('should return an array of User objects with fields: name, telephone', (done) => {
            chai.request(server)
                .get('/users?fields=firstName,email')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.be.an('object').that.has.all.keys('firstName', 'email');
                    done();
                });
        });
        it('should return 400 when the requested fields are wrong', (done) => {
            chai.request(server)
                .get('/users?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
    describe('GET /users/:id', () => {
        it('should return a User object', (done) => {
            chai.request(server)
                .get('/users/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });
        it('should return a User object with fields: id, address.street, address.number', (done) => {
            chai.request(server)
                .get('/users/1?fields=id,email')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object').that.has.all.keys('id', 'email');
                    done();
                });
        });
        it('should return 400 when the requested fields are wrong', (done) => {
            chai.request(server)
                .get('/users/1?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
    describe('PUT /users/:id', () => {
        it('should replace a User record with a new one', (done) => {
            chai.request(server)
                .put('/users/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send({ firstName: 'updated' })
                .end((err, res) => {
                    res.should.have.status(204);
                    userMysqlRepo
                        .getUserById({ userId: 1 })
                        .then((user) => {
                            assert.equal(user.first_name, 'updated');
                            done();
                        })
                        .catch(errors => console.log(errors));
                });
        });
    });
    describe('DELETE /users/:id', () => {
        it('should delete a User record', (done) => {
            chai.request(server)
                .delete('/users/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(204);
                    userMysqlRepo
                        .getUserById({ userId: 1 })
                        .then((user) => {
                            assert.equal(user, null);
                            done();
                        });
                });
        });
    });
});
