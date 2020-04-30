import { PubSubEngine } from "graphql-subscriptions";
import { PubSubConnectionConfig } from "./interfaces";
export declare class AMQPPubSub implements PubSubEngine {
    private connection;
    private exchange;
    private queue_name;
    private publisher;
    private subscriber;
    private subscriptionMap;
    private subsRefsMap;
    private unsubscribeMap;
    private currentSubscriptionId;
    constructor(queue_name?: string);
    connect(config: PubSubConnectionConfig): Promise<void>;
    publish(routingKey: string, payload: any): Promise<void>;
    subscribe(routingKey: string, onMessage: (message: any) => void): Promise<number>;
    unsubscribe(subId: number): Promise<void>;
    asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
    private onMessage;
    private unsubscribeForKey;
}
