import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";
import { install } from "./remote/install";
import { log, logError } from "./util";

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Hello, World! it's clippy buddy");
  // TODO: watch for terminal opening, inject pbcopy and pbpaste. they are hooked to a socket that links back to the editor's extension host
  // TODO: extension host gets events on the socket and sends back to the client via regular vscode command

  // install to a temp directory
  const installDirectory = path.join(
    context.globalStorageUri.fsPath,
    "clippy-buddy-b",
  );
  try {
    context.subscriptions.push(await install(installDirectory));
    // add the install directory to the PATH
    log("Adding to PATH", installDirectory);
    context.environmentVariableCollection?.append("PATH", installDirectory);
  } catch (e) {
    logError("Failed to install", e);
  }
}
