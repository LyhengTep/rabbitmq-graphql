"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = require("./pubsub");
const chai_1 = require("chai");
require("mocha");
const amqplib_1 = require("amqplib");
let conn;
let pubsub;
describe('AMQP PubSub', () => {
    before((done) => {
        amqplib_1.default.connect('amqp://guest:guest@localhost:5672?heartbeat=30')
            .then(amqpConn => {
            conn = amqpConn;
            done();
        })
            .catch(err => {
            done(err);
        });
    });
    after((done) => {
        conn.close()
            .then(() => {
            done();
        })
            .catch(err => {
            done(err);
        });
    });
    it('should create new instance of AMQPPubSub class', () => {
        pubsub = new pubsub_1.AMQPPubSub({ connection: conn });
        chai_1.expect(pubsub).to.exist;
    });
    it('should be able to receive a message with the appropriate routingKey', (done) => {
        pubsub.subscribe('testx.*', (message) => {
            chai_1.expect(message).to.exist;
            chai_1.expect(message.test).to.equal('data');
            done();
        })
            .then(subscriberId => {
            chai_1.expect(subscriberId).to.exist;
            pubsub.publish('testx.test', { test: 'data' })
                .then(() => {
                chai_1.expect(true).to.equal(true);
            })
                .catch(err => {
                chai_1.expect(err).to.not.exist;
                done();
            });
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
    it('should be able to unsubscribe', (done) => {
        pubsub.subscribe('test.test', () => {
            done(new Error('Should not reach'));
        })
            .then(subscriberId => {
            chai_1.expect(subscriberId).to.exist;
            chai_1.expect(isNaN(subscriberId)).to.equal(false);
            pubsub.unsubscribe(subscriberId)
                .then(() => {
                done();
            })
                .catch(err => {
                chai_1.expect(err).to.not.exist;
            });
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
    it('should be able to receive a message after one of two subscribers unsubscribed', (done) => {
        pubsub.subscribe('testy.test', () => {
            done(new Error('Should not reach'));
        })
            .then(id1 => {
            pubsub.subscribe('testy.test', (message) => {
                chai_1.expect(message).to.exist;
                chai_1.expect(message.test).to.equal('data');
                done();
            })
                .then(id2 => {
                chai_1.expect(id1).to.exist;
                chai_1.expect(id2).to.exist;
                chai_1.expect(id1).to.not.equal(id2);
                pubsub.unsubscribe(id1)
                    .then(() => {
                    pubsub.publish('testy.test', { test: 'data' })
                        .then(() => {
                        chai_1.expect(true).to.equal(true);
                    })
                        .catch(err => {
                        chai_1.expect(err).to.not.exist;
                        done();
                    });
                })
                    .catch(err => {
                    chai_1.expect(err).to.not.exist;
                });
            })
                .catch(err => {
                chai_1.expect(err).to.not.exist;
            });
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
    it('should be able to receive a message after one of two subscribers unsubscribed (concurrent)', (done) => {
        Promise.all([
            pubsub.subscribe('testz.test', () => {
                done(new Error('Should not reach'));
            }),
            pubsub.subscribe('testz.test', (message) => {
                chai_1.expect(message).to.exist;
                chai_1.expect(message.test).to.equal('data');
                done();
            })
        ])
            .then(([id1, id2]) => {
            chai_1.expect(id1).to.exist;
            chai_1.expect(id2).to.exist;
            chai_1.expect(id1).to.not.equal(id2);
            pubsub.unsubscribe(id1)
                .then(() => {
                pubsub.publish('testz.test', { test: 'data' })
                    .then(() => {
                    chai_1.expect(true).to.equal(true);
                })
                    .catch(err => {
                    chai_1.expect(err).to.not.exist;
                    done();
                });
            })
                .catch(err => {
                chai_1.expect(err).to.not.exist;
            });
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
});
//# sourceMappingURL=pubsub.test.js.map