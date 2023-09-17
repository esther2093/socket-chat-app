const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new username", (username) => {
    socket.username = username;
  });

  socket.broadcast.emit("connection", `${socket.username} connected`);
  socket.emit("new connection", "welcome");

  socket.on("chat message", (data) => {
    console.log("message: " + data.message);
    io.emit('chat message', { username: socket.username, message: data.message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("disconnection", `${socket.username} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
