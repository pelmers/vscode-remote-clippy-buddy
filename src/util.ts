import * as vscode from "vscode";

let outputStream: vscode.OutputChannel;

export function log(...messages: unknown[]) {
  if (!outputStream) {
    outputStream = vscode.window.createOutputChannel("Clippy Buddy");
  }
  const combinedMessage = messages.join(" ");
  outputStream.appendLine(combinedMessage);
}

export function logError(...messages: unknown[]) {
  log("ERROR:", ...messages);
}
