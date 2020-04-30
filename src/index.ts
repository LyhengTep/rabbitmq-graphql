// require("dotenv").config();
// import * as amqp from "amqplib";

export { AMQPPubSub } from "./pubsub";
// const test = async () => {
//   console.log("executing test function");

//   const pubsub = new AMQPPubSub("tasks");

//   await pubsub.connect({
//     username: "heng",
//     password: "heng",
//     url: "18.139.25.218",
//     port: 5673,
//   });
//   pubsub.subscribe("tasks", (msg) => {
//     if (msg !== null) {
//       console.log(msg);
//     }
//   });
// };

// test();
