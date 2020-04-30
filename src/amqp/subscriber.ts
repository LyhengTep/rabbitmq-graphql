import amqp from "amqplib";
import Debug from "debug";

import { Logger } from "./common";

export class AMQPSubscriber {
  private channel: amqp.Channel | null = null;

  constructor(
    private connection: amqp.Connection,
    private logger: Debug.IDebugger
  ) {}

  public async subscribe(
    queue_name: string,
    routingKey: string,
    action: (routingKey: string, message: any) => void
  ): Promise<() => PromiseLike<any>> {
    let promise: PromiseLike<amqp.Channel>;
    if (this.channel) {
      promise = Promise.resolve(this.channel);
    } else {
      promise = this.connection.createChannel();
    }
    return promise.then(async (ch) => {
      this.channel = ch;
      return ch
        .assertQueue(queue_name || "graphql_queue")
        .then(async (queue) => {
          return ch
            .consume(
              queue.queue,
              (msg) => {
                let parsedMessage = Logger.convertMessage(msg);
                this.logger(
                  'Message arrived from Queue "%s" (%j)',
                  queue.queue,
                  parsedMessage
                );
                action(routingKey, parsedMessage);
              },
              { noAck: true }
            )
            .then((opts) => {
              this.logger(
                'Subscribed to Queue "%s" (%s)',
                queue.queue,
                opts.consumerTag
              );
              return (): PromiseLike<any> => {
                this.logger(
                  'Disposing Subscriber to Queue "%s" (%s)',
                  queue.queue,
                  opts.consumerTag
                );
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
