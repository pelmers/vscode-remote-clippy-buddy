import { once } from "events";
import { createCommandHostConnection } from "../common";
import { randomUUID } from "crypto";

async function main() {
  const socket = createCommandHostConnection();
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
