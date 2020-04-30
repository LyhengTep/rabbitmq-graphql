import amqp from "amqplib";
import Debug from "debug";
export declare class AMQPSubscriber {
    private connection;
    private logger;
    private channel;
    constructor(connection: amqp.Connection, logger: Debug.IDebugger);
    subscribe(queue_name: string, routingKey: string, action: (routingKey: string, message: any) => void): Promise<() => PromiseLike<any>>;
}
