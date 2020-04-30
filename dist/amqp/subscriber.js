"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class AMQPSubscriber {
    constructor(connection, logger) {
        this.connection = connection;
        this.logger = logger;
        this.channel = null;
    }
    async subscribe(exchange, routingKey, action) {
        let promise;
        if (this.channel) {
            promise = Promise.resolve(this.channel);
        }
        else {
            promise = this.connection.createChannel();
        }
        return promise.then(async (ch) => {
            this.channel = ch;
            return ch
                .assertExchange(exchange, "topic", {
                durable: false,
                autoDelete: false,
            })
                .then(() => {
                return ch.assertQueue("tasks", {
                    exclusive: true,
                    durable: false,
                    autoDelete: true,
                });
            })
                .then(async (queue) => {
                return ch.bindQueue(queue.queue, exchange, routingKey).then(() => {
                    return queue;
                });
            })
                .then(async (queue) => {
                return ch
                    .consume(queue.queue, (msg) => {
                    let parsedMessage = common_1.Logger.convertMessage(msg);
                    this.logger('Message arrived from Queue "%s" (%j)', queue.queue, parsedMessage);
                    action(routingKey, parsedMessage);
                }, { noAck: true })
                    .then((opts) => {
                    this.logger('Subscribed to Queue "%s" (%s)', queue.queue, opts.consumerTag);
                    return () => {
                        this.logger('Disposing Subscriber to Queue "%s" (%s)', queue.queue, opts.consumerTag);
                        return ch.cancel(opts.consumerTag);
                    };
                });
            })
                .catch((err) => {
                return Promise.reject(err);
            });
        });
    }
}
exports.AMQPSubscriber = AMQPSubscriber;
//# sourceMappingURL=subscriber.js.map