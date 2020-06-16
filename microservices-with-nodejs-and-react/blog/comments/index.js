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

const commentsByPostId = {};

const debugLog = (msg) => {
  console.log(`[app] ${new Date().toISOString()} - ${msg}`);
};

app.get("/posts/:id/comments", (req, res) => {
  debugLog(`Requested comments for id = ${req.params.id}`);
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios
    .post(eventBusEventsUrl, {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .then((res) => {
      debugLog("Triggered event: CommentCreated");
    });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  debugLog("Received Event", type);

  if (type === "CommentModerated") {
    debugLog("Handling CommentModerated event");

    const { id, content, postId, status } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios
      .post(eventBusEventsUrl, {
        type: "CommentUpdated",
        data: {
          id,
          content,
          postId,
          status,
        },
      })
      .then((res) => {
        debugLog("Triggered event: CommentUpdated");
      });
  } else {
    debugLog(`We don't care about ${type} event type. Ignoring`);
  }

  res.send({});
});

app.listen(4001, () => {
  debugLog("v1");
  debugLog("Listening on port 4001");
});
