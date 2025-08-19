import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8080";

const socket = io(SERVER_URL);

type Message = { type: string };

export default function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    socket.connect();

    function onMessage(message: Message) {
      if (message.type === "request-counter") {
        socket.emit("message", {
          type: "counter-value",
          value: countRef.current,
        });
      }
    }

    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>Increment</button>
    </>
  );
}
