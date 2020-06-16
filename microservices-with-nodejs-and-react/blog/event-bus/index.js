const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

const debugLog = (msg) => {
  console.log(`[app] ${new Date().toISOString()} - ${msg}`);
};

const sendEvent = (url, event) => {
  axios.post(url, event).then((res) => {
    debugLog(`Event Sent: type = ${event.type}, url = ${url}`);
  });
};

app.post("/events", (req, res) => {
  const event = req.body;

  debugLog("Received Event", event.type);

  events.push(event);

  sendEvent("http://posts-clusterip-srv:4000/events", event);
  sendEvent("http://comments-srv:4001/events", event);
  sendEvent("http://query-srv:4002/events", event);
  sendEvent("http://moderation-srv:4003/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  debugLog(`All events requested. Sent a total of ${events.length} event(s)`);
  res.send(events);
});

app.listen(4005, () => {
  debugLog("v1");
  debugLog("Listening on port 4005");
});
