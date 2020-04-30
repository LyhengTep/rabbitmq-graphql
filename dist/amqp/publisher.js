"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AMQPPublisher {
    constructor(connection, logger) {
        this.connection = connection;
        this.logger = logger;
        this.channel = null;
    }
    async publish(exchange, routingKey, data) {
        let promise;
        if (this.channel) {
            promise = Promise.resolve(this.channel);
        }
        else {
            promise = this.connection.createChannel();
        }
        return promise
            .then(async (ch) => {
            this.channel = ch;
            return ch.assertExchange(exchange, 'topic', { durable: false, autoDelete: false })
                .then(() => {
                this.logger('Message sent to Exchange "%s" with Routing Key "%s" (%j)', exchange, routingKey, data);
                ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));
                return Promise.resolve();
            })
                .catch(err => {
                return Promise.reject(err);
            });
        });
    }
}
exports.AMQPPublisher = AMQPPublisher;
//# sourceMappingURL=publisher.js.map