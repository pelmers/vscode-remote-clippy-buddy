import * as net from 'net';
import { once } from 'events';

async function main() {
  const socketPath = process.env.REMOTE_CLIPPY_CALLBACK_SOCKET;
  if (!socketPath) {
    console.error('Environment variable REMOTE_CLIPPY_CALLBACK_SOCKET is not set.');
    process.exit(1);
  }

  const socket = net.createConnection(socketPath);

  let data = '';
  process.stdin.on('data', (chunk) => {
    data += chunk;
  });

  await once(process.stdin, 'end');

  socket.write(`pbcopy${data}`, () => {
    socket.end();
  });
}

main().catch(console.error);