import { once } from "events";
import { createCommandHostConnection } from "../common";

async function main() {
  const socket = createCommandHostConnection();
  socket.write("pbpaste");

  socket.on("data", (data) => {
    process.stdout.write(data);
  });

  await once(socket, "end");
  socket.end();
}

main().catch(console.error);
