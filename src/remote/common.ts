import * as net from "net";

export const REMOTE_CLIPPY_PORT_ENV: string = "REMOTE_CLIPPY_PORT";

function getPort(): number {
  if (!process.env[REMOTE_CLIPPY_PORT_ENV]) {
    throw new Error(
      `Environment variable ${REMOTE_CLIPPY_PORT_ENV} is not set.`,
    );
  }
  return parseInt(process.env[REMOTE_CLIPPY_PORT_ENV]!);
}

export function createCommandHostConnection(): net.Socket {
  const socket = net.createConnection(getPort());
  socket.on("error", (e) => {
    console.error(e.message);
    if (e.message.indexOf("ECONNREFUSED") !== -1) {
      console.error(
        "Hint: Most likely means your terminal was restored from a previous session. Open a new terminal to fix.",
      );
    }
    process.exit(1);
  });
  return socket;
}
