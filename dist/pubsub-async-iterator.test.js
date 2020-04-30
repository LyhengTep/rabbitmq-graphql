"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chai_as_promised_1 = require("chai-as-promised");
const sinon_1 = require("sinon");
const sinon_chai_1 = require("sinon-chai");
const iterall_1 = require("iterall");
const pubsub_1 = require("./pubsub");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const amqplib_1 = require("amqplib");
chai_1.default.use(chai_as_promised_1.default);
chai_1.default.use(sinon_chai_1.default);
const expect = chai_1.default.expect;
const graphql_1 = require("graphql");
const subscription_1 = require("graphql/subscription");
const FIRST_EVENT = 'FIRST_EVENT';
let conn;
const defaultFilter = () => true;
function buildSchema(iterator, filterFn = defaultFilter) {
    return new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                testString: {
                    type: graphql_1.GraphQLString,
                    resolve: function () {
                        return 'works';
                    },
                },
            },
        }),
        subscription: new graphql_1.GraphQLObjectType({
            name: 'Subscription',
            fields: {
                testSubscription: {
                    type: graphql_1.GraphQLString,
                    subscribe: graphql_subscriptions_1.withFilter(() => iterator, filterFn),
                    resolve: () => {
                        return 'FIRST_EVENT';
                    },
                },
            },
        }),
    });
}
describe('GraphQL-JS asyncIterator', () => {
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
        setTimeout(() => {
            conn.close()
                .then(() => {
                done();
            })
                .catch(err => {
                done(err);
            });
        }, 100);
    });
    it('should allow subscriptions', async () => {
        const query = graphql_1.parse(`
      subscription S1 {

        testSubscription
      }
    `);
        const pubsub = new pubsub_1.AMQPPubSub({ connection: conn });
        const origIterator = pubsub.asyncIterator(FIRST_EVENT);
        const schema = buildSchema(origIterator);
        const results = await subscription_1.subscribe(schema, query);
        const payload1 = results.next();
        expect(iterall_1.isAsyncIterable(results)).to.be.true;
        const r = payload1.then(res => {
            expect(res.value.data.testSubscription).to.equal('FIRST_EVENT');
        });
        setTimeout(() => {
            pubsub.publish(FIRST_EVENT, {});
        }, 100);
        return r;
    });
    it('should allow async filter', async () => {
        const query = graphql_1.parse(`
      subscription S1 {

        testSubscription
      }
    `);
        const pubsub = new pubsub_1.AMQPPubSub({ connection: conn });
        const origIterator = pubsub.asyncIterator(FIRST_EVENT);
        const schema = buildSchema(origIterator, () => Promise.resolve(true));
        const results = await subscription_1.subscribe(schema, query);
        const payload1 = results.next();
        expect(iterall_1.isAsyncIterable(results)).to.be.true;
        const r = payload1.then(res => {
            expect(res.value.data.testSubscription).to.equal('FIRST_EVENT');
        });
        setTimeout(() => {
            pubsub.publish(FIRST_EVENT, {});
        }, 100);
        return r;
    });
    it('should detect when the payload is done when filtering', (done) => {
        const query = graphql_1.parse(`
      subscription S1 {
        testSubscription
      }
    `);
        const pubsub = new pubsub_1.AMQPPubSub({ connection: conn });
        const origIterator = pubsub.asyncIterator(FIRST_EVENT);
        let counter = 0;
        const filterFn = () => {
            counter++;
            if (counter > 10) {
                const e = new Error('Infinite loop detected');
                done(e);
                throw e;
            }
            return false;
        };
        const schema = buildSchema(origIterator, filterFn);
        Promise.resolve(subscription_1.subscribe(schema, query)).then((results) => {
            expect(iterall_1.isAsyncIterable(results)).to.be.true;
            results = results;
            results.next();
            results.return();
            setTimeout(() => {
                pubsub.publish(FIRST_EVENT, {});
            }, 100);
            setTimeout(_ => {
                done();
            }, 500);
        });
    });
    it('should clear event handlers', async () => {
        const query = graphql_1.parse(`
      subscription S1 {
        testSubscription
      }
    `);
        const pubsub = new pubsub_1.AMQPPubSub({ connection: conn });
        const origIterator = pubsub.asyncIterator(FIRST_EVENT);
        const returnSpy = sinon_1.spy(origIterator, 'return');
        const schema = buildSchema(origIterator);
        const results = await subscription_1.subscribe(schema, query);
        const end = results.return();
        const r = end.then(() => {
            expect(returnSpy).to.have.been.called;
        });
        pubsub.publish(FIRST_EVENT, {});
        return r;
    });
});
//# sourceMappingURL=pubsub-async-iterator.test.js.map