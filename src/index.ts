// require("dotenv").config();
// import * as amqp from "amqplib";

export { AMQPPubSub } from "./pubsub";
// const test = () => {
//   console.log("executing test function");
//   amqp
//     .connect(`amqp://${process.env.RABBITMQ_DOMAIN}:5673`)
//     .then((conn) => {
//       const pubsub = new AMQPPubSub(
//         {
//           connection: conn,
//           exchange: "tasks",
//         },
//         "tasks"
//       );
//       pubsub.subscribe("tasks", (msg) => {
//         if (msg !== null) {
//           console.log(msg);
//           // ch.ack(msg);
//         }
//       });
//       // Use the pubsub instance from here on
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// test();
