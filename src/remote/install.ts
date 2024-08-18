import * as path from "path";
import * as fs from "fs/promises";
import * as vscode from "vscode";
import { createTcpListener } from "./socketListener";
import { log } from "src/util";
import { REMOTE_CLIPPY_PORT_ENV } from "./common";

export const VERSION = "0.0.1";

// Our scripts pbcopy/pbpaste are defined in javascript.
// We want to install something executable on the PATH, so this takes a javascript path and
// generates a wrapper shell script that runs the javascript file using the node install that launched this vscode.
function wrapJSScript(scriptPath: string, portEnv: number) {
  const nodePath = process.execPath;
  return `#!/bin/bash
${REMOTE_CLIPPY_PORT_ENV}="${portEnv}" "${nodePath}" "${scriptPath}" "$@"
`;
}

async function findOpenPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = require("net").createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

// Runs in regular node on the remote server.
// Job is to install a hook on all opened terminals that adds pbcopy and pbpaste to the PATH.
export async function install(
  installDirectory: string,
): Promise<vscode.Disposable> {
  await fs.mkdir(installDirectory, { recursive: true });
  const openPort = await findOpenPort();
  for (const tool of ["pbcopy", "pbpaste"]) {
    const scriptPath = path.join(installDirectory, tool);
    const scriptContents = wrapJSScript(
      path.join(__dirname, `${tool}.js`),
      openPort,
    );
    log(`Writing script to ${scriptPath}`);
    await fs.writeFile(scriptPath, scriptContents, { mode: 0o755 });
  }
  return await createTcpListener(openPort);
}
