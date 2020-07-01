import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// stan = client in NATS terminology
// it is "nats" backwards (really smart!)
// clientId (second argument) must be unique for every listener
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  // default behavior: whenever a client receives an event, NATS consider it done
  //                   if an error occurs while client processed the event, it will be LOST!
  const options = stan
    .subscriptionOptions()
    // overrides default behavior and forces client to ack the message
    // if no ack is received within an ammount of time (let's say, 30s),
    // NATS will resend the message to the queue group or other clients
    // that are subscribed to that channel
    .setManualAckMode(true)
    // asks NATS to resend all messages that exists for this channel when
    // a subscription is created and/or connected
    // this is still needed in parallel with durable subscription in
    // order to make sure all messages will be sent to a client that
    // subscribed to a channel for the very first time
    .setDeliverAllAvailable()
    // durable subscription makes sure messages that were ack'd are
    // marked as "processed" and will not send those whenever a
    // subscription to this channel is created and/or connected
    .setDurableName("orders-service-durable");

  // queue groups = make sure only ONE client subscribed to that group
  // will receive the message (useful for events that can't be handled
  // more than once)
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack(); // acks the message has been processed
  });
});

// handles process exit/termination to make sure NATS connection is closed
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());