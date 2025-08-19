import { Server, Socket } from "socket.io";

const PORT = 8080;

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

type Message = { type: string; value: number };

io.on("connection", (socket: Socket) => {
  console.log("A client is connected");

  socket.on("message", (message: Message) => {
    if (message.type === "counter-value") {
      console.log("Counter received", message.value);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

setInterval(() => {
  io.emit("message", { type: "request-counter" });
  console.log("Broadcast sent");
}, 1000);

io.listen(PORT);
console.log(`Socket server listening on port ${PORT}`);
