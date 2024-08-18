import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";
import { install } from "./remote/install";
import { log, logError } from "./util";

export async function activate(context: vscode.ExtensionContext) {
  if (typeof vscode.env.remoteName === "undefined") {
    log("clippy buddy only works when connected to a remote workspace");
  }

  // install to a temp directory
  const installDirectory = path.join(
    context.globalStorageUri.fsPath,
    "clippy-buddy",
  );
  try {
    context.subscriptions.push(await install(installDirectory));
    // add the install directory to the PATH
    log("Installing on:", vscode.env.remoteName);
    log("Adding to PATH:", installDirectory);
    // adding the colon at the end is necessary by the way
    context.environmentVariableCollection?.prepend(
      "PATH",
      installDirectory + ":",
      { applyAtProcessCreation: true, applyAtShellIntegration: true },
    );
  } catch (e) {
    logError("Failed to install", e);
  }
}
