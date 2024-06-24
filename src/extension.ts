import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Hello, World! it's clippy buddy");
  // TODO: watch for terminal opening, inject pbcopy and pbpaste. they are hooked to a socket that links back to the editor's extension host
  // TODO: extension host gets events on the socket and sends back to the client via regular vscode command

  // we call remote/install when the extension is activated in a remote workspace
  context.environmentVariableCollection.append
}
