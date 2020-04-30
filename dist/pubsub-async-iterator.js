"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterall_1 = require("iterall");
class PubSubAsyncIterator {
    constructor(pubsub, eventNames) {
        this.pubsub = pubsub;
        this.pullQueue = [];
        this.pushQueue = [];
        this.listening = true;
        this.eventsArray = typeof eventNames === 'string' ? [eventNames] : eventNames;
        this.allSubscribed = this.subscribeAll();
    }
    async next() {
        await this.allSubscribed;
        return this.listening ? this.pullValue() : this.return();
    }
    async return() {
        this.emptyQueue(await this.allSubscribed);
        return { value: undefined, done: true };
    }
    async throw(err) {
        this.emptyQueue(await this.allSubscribed);
        return Promise.reject(err);
    }
    [iterall_1.$$asyncIterator]() {
        return this;
    }
    async pushValue(event) {
        await this.allSubscribed;
        if (this.pullQueue.length !== 0) {
            let element = this.pullQueue.shift();
            if (element) {
                element({ value: event, done: false });
            }
        }
        else {
            this.pushQueue.push(event);
        }
    }
    pullValue() {
        return new Promise(resolve => {
            if (this.pushQueue.length !== 0) {
                resolve({ value: this.pushQueue.shift(), done: false });
            }
            else {
                this.pullQueue.push(resolve);
            }
        });
    }
    emptyQueue(subscriptionIds) {
        if (this.listening) {
            this.listening = false;
            this.unsubscribeAll(subscriptionIds);
            this.pullQueue.forEach(resolve => resolve({ value: undefined, done: true }));
            this.pullQueue.length = 0;
            this.pushQueue.length = 0;
        }
    }
    subscribeAll() {
        return Promise.all(this.eventsArray.map(eventName => this.pubsub.subscribe(eventName, this.pushValue.bind(this), {})));
    }
    unsubscribeAll(subscriptionIds) {
        for (const subscriptionId of subscriptionIds) {
            this.pubsub.unsubscribe(subscriptionId);
        }
    }
}
exports.PubSubAsyncIterator = PubSubAsyncIterator;
//# sourceMappingURL=pubsub-async-iterator.js.map