const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventBusBaseUrl = "http://event-bus-srv:4005";
const eventBusEventsUrl = `${eventBusBaseUrl}/events`;

const posts = {};

const debugLog = (msg) => {
  console.log(`[app] ${new Date().toISOString()} - ${msg}`);
};

const handleEvent = (type, data) => {
  
  if (type === "PostCreated") {
    debugLog("Handling PostCreated event");
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };

  } else if (type == "CommentCreated") {
    debugLog("Handling CommentCreated event");
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });

  } else if (type === "CommentUpdated") {
    debugLog("Handling CommentUpdated event");
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;

  } else {
    debugLog(`We don't care about ${type} event type. Ignoring`);
  }
};

app.get("/posts", (req, res) => {
  debugLog(
    `All posts with comments requested. Sent a total of ${posts.length} post(s)`
  );
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  debugLog("Received Event", type);

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  debugLog("v1");
  debugLog("Listening on port 4002");

  const res = await axios.get(eventBusEventsUrl);

  for (let event of res.data) {
    debugLog(`Processing event type ${event.type}`);
    handleEvent(event.type, event.data);
  }
});
