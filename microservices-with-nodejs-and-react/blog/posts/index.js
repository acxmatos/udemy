const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventBusBaseUrl = "http://event-bus-srv:4005";
const eventBusEventsUrl = `${eventBusBaseUrl}/events`;

const posts = {};

const debugLog = (msg) => {
  console.log(`[app] ${new Date().toISOString()} - ${msg}`);
};

app.get("/posts", (req, res) => {
  debugLog(
    `All posts requested. Sent a total of ${Object.keys(posts).length} post(s)`
  );
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios
    .post(eventBusEventsUrl, {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    })
    .then((res) => {
      debugLog("Triggered event: PostCreated");
    });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  debugLog("Received Event", req.body.type);
  debugLog(`We don't care about ${req.body.type} event type. Ignoring`);

  res.send({});
});

app.listen(4000, () => {
  debugLog("v2");
  debugLog("Listening on port 4000");
});
