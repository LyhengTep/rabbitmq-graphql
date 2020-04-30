"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publisher_1 = require("./publisher");
const chai_1 = require("chai");
require("mocha");
const debug_1 = require("debug");
const amqplib_1 = require("amqplib");
const logger = debug_1.default('AMQPPubSub');
let conn;
let publisher;
describe('AMQP Publisher', () => {
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
    it('should create new instance of AMQPPublisher class', () => {
        publisher = new publisher_1.AMQPPublisher(conn, logger);
        chai_1.expect(publisher).to.exist;
    });
    it('should publish a message to an exchange', (done) => {
        publisher.publish('exchange', 'test.test', { test: 'data' })
            .then(() => {
            done();
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
    it('should publish a second message to an exchange', (done) => {
        publisher.publish('exchange', 'test.test', { test: 'data' })
            .then(() => {
            done();
        })
            .catch(err => {
            chai_1.expect(err).to.not.exist;
            done();
        });
    });
});
//# sourceMappingURL=publisher.test.js.map