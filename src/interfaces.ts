/* istanbul ignore file */
import * as amqp from "amqplib";

export interface PubSubAMQPOptions {
  connection: amqp.Connection;
  exchange?: string;
}

export interface PubSubConnectionConfig {
  url: string;
  port: number;
  username: string;
  password: string;
}
