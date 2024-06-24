import * as path from 'path';
import * as fs from 'fs/promises';
import { createSocketListener } from './socketListener';

export const VERSION = '0.0.1';

// Our scripts pbcopy/pbpaste are defined in javascript.
// We want to install something executable on the PATH, so this takes a javascript path and 
// generates a wrapper shell script that runs the javascript file using the node install that launched this vscode.
function wrapJSScript(scriptPath: string, callbackSocketPath: string) {
    const nodePath = process.argv[0];
    return `#!/bin/bash
REMOTE_CLIPPY_CALLBACK_SOCKET="${callbackSocketPath}" "${nodePath}" "${scriptPath}" "$@"
`;
}

// Runs in regular node on the remote server.
// Job is to install a hook on all opened terminals that adds pbcopy and pbpaste to the PATH.
export async function install(installDirectory: string) {
    const binDirectory = path.join(installDirectory, VERSION);
    await fs.mkdir(binDirectory, { recursive: true });
    const socketPath = path.join(installDirectory, VERSION, 'remote-clippy.sock');
    await createSocketListener(socketPath);
    for (const tool of ['pbcopy', 'pbpaste']) {
        const scriptPath = path.join(binDirectory, tool);
        const scriptContents = wrapJSScript(path.join(__dirname, `${tool}.js`), socketPath);
        await fs.writeFile(scriptPath, scriptContents, { mode: 0o755 });
    }
}