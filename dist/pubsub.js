"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const publisher_1 = require("./amqp/publisher");
const subscriber_1 = require("./amqp/subscriber");
const pubsub_async_iterator_1 = require("./pubsub-async-iterator");
const logger = debug_1.default("AMQPPubSub");
class AMQPPubSub {
    constructor(options) {
        this.connection = options.connection;
        this.exchange = options.exchange || "graphql_subscriptions";
        this.subscriptionMap = {};
        this.subsRefsMap = {};
        this.unsubscribeMap = {};
        this.currentSubscriptionId = 0;
        this.publisher = new publisher_1.AMQPPublisher(this.connection, logger);
        this.subscriber = new subscriber_1.AMQPSubscriber(this.connection, logger);
        logger("Finished initializing");
    }
    async publish(routingKey, payload) {
        logger('Publishing message to exchange "%s" for key "%s" (%j)', this.exchange, routingKey, payload);
        return this.publisher.publish(this.exchange, routingKey, payload);
    }
    async subscribe(routingKey, onMessage) {
        const id = this.currentSubscriptionId++;
        this.subscriptionMap[id] = {
            routingKey: routingKey,
            listener: onMessage,
        };
        const refs = this.subsRefsMap[routingKey];
        if (refs && refs.length > 0) {
            const newRefs = [...refs, id];
            this.subsRefsMap[routingKey] = newRefs;
            return Promise.resolve(id);
        }
        else {
            return this.subscriber
                .subscribe(this.exchange, routingKey, this.onMessage.bind(this))
                .then((disposer) => {
                this.subsRefsMap[routingKey] = [
                    ...(this.subsRefsMap[routingKey] || []),
                    id,
                ];
                if (this.unsubscribeMap[routingKey]) {
                    return disposer();
                }
                this.unsubscribeMap[routingKey] = disposer;
                return Promise.resolve(id);
            });
        }
    }
    unsubscribe(subId) {
        const routingKey = this.subscriptionMap[subId].routingKey;
        const refs = this.subsRefsMap[routingKey];
        if (!refs) {
            throw new Error(`There is no subscription of id "${subId}"`);
        }
        if (refs.length === 1) {
            delete this.subscriptionMap[subId];
            return this.unsubscribeForKey(routingKey);
        }
        else {
            const index = refs.indexOf(subId);
            const newRefs = index === -1
                ? refs
                : [...refs.slice(0, index), ...refs.slice(index + 1)];
            this.subsRefsMap[routingKey] = newRefs;
            delete this.subscriptionMap[subId];
        }
        return Promise.resolve();
    }
    asyncIterator(triggers) {
        return new pubsub_async_iterator_1.PubSubAsyncIterator(this, triggers);
    }
    onMessage(routingKey, message) {
        const subscribers = this.subsRefsMap[routingKey];
        if (!subscribers || !subscribers.length) {
            this.unsubscribeForKey(routingKey);
            return;
        }
        for (const subId of subscribers) {
            this.subscriptionMap[subId].listener(message);
        }
    }
    async unsubscribeForKey(routingKey) {
        await this.unsubscribeMap[routingKey]();
        delete this.subsRefsMap[routingKey];
        delete this.unsubscribeMap[routingKey];
    }
}
exports.AMQPPubSub = AMQPPubSub;
//# sourceMappingURL=pubsub.js.map