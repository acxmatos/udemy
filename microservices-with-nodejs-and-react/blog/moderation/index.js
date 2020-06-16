const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const eventBusBaseUrl = "http://event-bus-srv:4005";
const eventBusEventsUrl = `${eventBusBaseUrl}/events`;

const debugLog = (msg) => {
  console.log(`[app] ${new Date().toISOString()} - ${msg}`);
};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  debugLog("Received Event", type);

  if (type === "CommentCreated") {
    debugLog("Handling CommentModerated event");

    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios
      .post(eventBusEventsUrl, {
        type: "CommentModerated",
        data: {
          id: data.id,
          content: data.content,
          postId: data.postId,
          status,
        },
      })
      .then((res) => {
        debugLog("Triggered event: CommentModerated");
      });
  } else {
    debugLog(`We don't care about ${type} event type. Ignoring`);
  }

  res.send({});
});

app.listen(4003, () => {
  debugLog("v1");
  debugLog("Listening on port 4003");
});
