import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedListener } from "./events/ticket-created-listener";

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

  new TicketCreatedListener(stan).listen();
});

// handles process exit/termination to make sure NATS connection is closed
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
