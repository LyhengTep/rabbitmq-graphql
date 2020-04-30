"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscriber_1 = require("./subscriber");
const publisher_1 = require("./publisher");
const chai_1 = require("chai");
require("mocha");
const debug_1 = require("debug");
const amqplib_1 = require("amqplib");
const logger = debug_1.default('AMQPPubSub');
let conn;
let subscriber;
let publisher;
describe('AMQP Subscriber', () => {
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
    it('should create new instance of AMQPSubscriber class', () => {
        subscriber = new subscriber_1.AMQPSubscriber(conn, logger);
        chai_1.expect(subscriber).to.exist;
    });
    it('should create new instance of AMQPPublisher class', () => {
        publisher = new publisher_1.AMQPPublisher(conn, logger);
        chai_1.expect(publisher).to.exist;
    });
    it('should be able to receive a message through an exchange', (done) => {
        subscriber.subscribe('exchange', '*.test', (routingKey, message) => {
            chai_1.expect(routingKey).to.exist;
            chai_1.expect(message).to.exist;
            chai_1.expect(message.test).to.exist;
            chai_1.expect(message.test).to.equal('data');
            done();
        })
            .then(disposer => {
            chai_1.expect(disposer).to.exist;
            publisher.publish('exchange', 'test.test', { test: 'data' })
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
        subscriber.subscribe('exchange', 'test.test', () => {
            done(new Error('Should not reach'));
        })
            .then(disposer => {
            chai_1.expect(disposer).to.exist;
            disposer()
                .then(() => {
                done();
            });
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
});
//# sourceMappingURL=subscriber.test.js.map