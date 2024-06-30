import * as net from "net";
import { once } from "events";
import { getPort } from "../common";

async function main() {
  const port = getPort();
  const socket = net.createConnection(port)
  socket.write("pbpaste");

  socket.on("data", (data) => {
    process.stdout.write(data);
  });

  await once(socket, "end");
  socket.end();
}

main().catch(console.error);
