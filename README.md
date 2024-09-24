# [Remote Clippy Buddy](https://marketplace.visualstudio.com/items?itemName=pelmers.remote-clippy-buddy-vscode)

This [VS Code extension](https://marketplace.visualstudio.com/items?itemName=pelmers.remote-clippy-buddy-vscode) installs `pbcopy` and `pbpaste` on your remote terminal.
- `pbcopy`: consume standard input and set it as the clipboard contents of your local computer
- `pbpaste`: outputs clipboard contents to standard output

## Example usage
- `ls | pbcopy`
- `pbpaste > ls_folder_contents`

## How does it work?
1. we create a couple of small scripts, `pbpaste` and `pbcopy`
2. when you connect to a remote workspace, we install these to the extension folder
3. we update PATH for VS Code terminals to include this folder

## Additional Info

- For bugs and feature requests, please visit the repository [on GitHub](https://github.com/pelmers/vscode-remote-clippy-buddy)

## Debugging
To debug the extension, you need to run it locally by changing a few places in code.
1. `extension.ts` blocks activation if the workspace is not connected to a remote. Comment that out temporarily.
2. `install.ts` uses `process.execPath` to launch the pb-paste/copy scripts.
Change it to `'node'` for local development because Electron's built-in node doesn't support what we do.

## Release Testing
To test the real released version of this extension, you need to connect to a remote host.
1. Get a remote host somewhere
2. Connect vs code window to it
3. Laptop: build a vsix package via `vsce package`
4. Copy it to the remote host: `scp extension.vsix user@host`
5. Install from vsix on connected vs code window
