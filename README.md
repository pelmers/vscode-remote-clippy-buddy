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

- For bugs and feature requests, please visit the repository [on GitHub](https://github.com/pelmers/code-couplet)