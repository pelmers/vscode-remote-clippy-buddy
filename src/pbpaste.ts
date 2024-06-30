import * as net from "net";
import { once } from "events";

async function main() {
  const socketPath = process.env.REMOTE_CLIPPY_CALLBACK_SOCKET;
  if (!socketPath) {
    console.error(
      "Environment variable REMOTE_CLIPPY_CALLBACK_SOCKET is not set.",
    );
    process.exit(1);
  }

  const socket = net.createConnection(socketPath, () => {
    socket.write("pbpaste");
  });

  socket.on("data", (data) => {
    process.stdout.write(data);
  });

  await once(socket, "end");
  socket.end();
}

main().catch(console.error);
