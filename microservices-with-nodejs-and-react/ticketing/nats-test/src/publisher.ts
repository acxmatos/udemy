import nats from "node-nats-streaming";

console.clear();

// stan = client in NATS terminology
// it is "nats" backwards (really smart!)
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222"
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  // we can't publish objects to NATS (only strings are allowed)
  // so we need to convert the object to a JSON string
  // data is refered as "message" in NATS world
  const data = JSON.stringify({
    id: "123",
    title: "Title",
    price: 20
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});
