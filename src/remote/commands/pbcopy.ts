import * as net from "net";
import { once } from "events";
import { getPort } from "../common";

async function main() {
  const port = getPort();
  const socket = net.createConnection(port);

  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });

  await once(process.stdin, "end");

  socket.write(`pbcopy${data}`, () => {
    socket.end();
  });
}

main().catch(console.error);
