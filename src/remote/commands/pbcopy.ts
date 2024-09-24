import * as net from "net";
import { once } from "events";
import { getPort } from "../common";
import { randomUUID } from "crypto";

async function main() {
  const port = getPort();
  const socket = net.createConnection(port);
  const uuid = randomUUID();

  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });

  await once(process.stdin, "end");

  socket.write(`pbcopyuuid=${uuid}data=${data}${uuid}`, () => {
    socket.end();
  });
}

main().catch(console.error);
