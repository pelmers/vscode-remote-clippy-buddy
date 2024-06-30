import * as vscode from "vscode";
import * as fsSync from "fs";
import * as net from "net";
import { log, logError } from "src/util";

export async function createTcpListener(
  port: number,
): Promise<vscode.Disposable> {
  log("Creating TCP listener on port", port);
  // Listen for connections on the socket. They will be either "pbcopy" + data (put data on clipboard) or "pbpaste" (we return the data from clipboard)
  // TODO this listener isn't working. should I just use a tcp port?
  const server = net.createServer();

  server.on("connection", (socket) => {
    socket.on("data", (data) => {
      const command = data.toString().trim();
      log("Got command", command);
      if (command.startsWith("pbcopy")) {
        const clipData = command.slice("pbcopy".length).trim();
        // TODO get this onto the client clipboard
        log("Got clip data", clipData);
      } else if (command === "pbpaste") {
        const data = "Hi from the server!";
        // TODO: get client clipboard and return it as data
        socket.write(data);
      } else {
        socket.write("Unknown command");
      }
      socket.end();
    });
    socket.on("error", (err) => {
      logError("Socket error", err);
    });
  });

  const disposable = new vscode.Disposable(() => {
    server.close();
  });

  return new Promise((resolve, reject) => {
    server.on("error", (err: Error) => {
      logError("Server error", err);
      reject(err);
    });
    server.listen({ port, host: "localhost" }, () => {
      log("Listening on port", port);
      resolve(disposable);
    });
  });
}
