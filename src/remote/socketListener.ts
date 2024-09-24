import * as vscode from "vscode";
import * as fsSync from "fs";
import * as net from "net";
import { log, logError } from "src/util";

export async function createTcpListener(
  port: number,
): Promise<vscode.Disposable> {
  log("Creating TCP listener on port", port);
  // Listen for connections on the socket. They will be either "pbcopy" + data (put data on clipboard) or "pbpaste" (we return the data from clipboard)
  const server = net.createServer();

  server.on("connection", (socket) => {
    // If it's an incoming pbcopy then we keep reading data until client tells us it's ended
    let pbcopyExpectedUuid: string | null = null;
    let pbcopyCurrentValue = "";
    const receiveBytesIfPbcopy = (data: string) => {
      if (pbcopyExpectedUuid != null) {
        log(`pbcopy ${pbcopyExpectedUuid} received bytes`, data.length);
        if (data.endsWith(pbcopyExpectedUuid)) {
          // We reached the end, save to clipboard
          pbcopyCurrentValue += data.slice(0, data.length - pbcopyExpectedUuid.length)
          vscode.env.clipboard.writeText(pbcopyCurrentValue);
          socket.end()
        } else {
          // Continue receiving the current value
          pbcopyCurrentValue += data;
        }
      } else {
        log(`received unknown data ${data}`);
        socket.end();
      }
    };
    socket.on("data", async (data) => {
      const command = data.toString().trim();
      if (command.startsWith("pbcopy")) {
        const commandContents = command.slice("pbcopy".length).trim();
        pbcopyExpectedUuid = commandContents.slice("uuid=".length, commandContents.indexOf("data="))
        await receiveBytesIfPbcopy(commandContents.slice(commandContents.indexOf("data=") + "data=".length))
      } else if (command === "pbpaste") {
        const data = await vscode.env.clipboard.readText();
        log("pbpaste sending bytes", data.length);
        socket.write(data);
        socket.end()
      } else {
        // Assume we're in the middle of a pbcopy
        receiveBytesIfPbcopy(command);
      }
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
