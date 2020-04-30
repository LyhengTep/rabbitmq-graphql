import { PubSubConnectionConfig } from "interfaces";

export const buildConnectionString = (config: PubSubConnectionConfig) => {
  return `amqp://${config.username}:${config.password}@${config.url}:${config.port}`;
};
