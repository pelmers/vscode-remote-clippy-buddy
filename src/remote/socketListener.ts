import * as vscode from "vscode";
import * as net from "net";

export async function createSocketListener(socketPath: string) {
    // Listen for connections on the socket. They will be either "pbcopy" + data (put data on clipboard) or "pbpaste" (we return the data from clipboard)
    const server = net.createServer((socket) => {
        socket.on("data", (data) => {
            const command = data.toString().trim();
            console.log("Got command", command)
            if (command.startsWith("pbcopy")) {
                const clipData = command.slice("pbcopy".length).trim();
                // TODO: get this onto the client clipboard
                console.log("Got clip data", clipData);
            } else if (command === "pbpaste") {
                const data = "Hi from the server!"
                // TODO: get client clipboard and return it as data
                socket.write(data);
            } else {
                socket.write("Unknown command");
            }
        });
        socket.on("error", (err) => {
            console.error("Socket error", err);
        });
    });

    server.listen(socketPath, () => {
        console.log(`Server listening on ${socketPath}`);
    });
}