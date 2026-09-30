// `pnpm dev:btg`: mock API + Next dev server pointed at it. No database,
// Google account or OpenAI key needed.
import { spawn } from 'node:child_process';
import { startMockApi } from './server.mjs';

const API_PORT = Number(process.env.MOCK_API_PORT ?? 3999);
const api = startMockApi(API_PORT);

const next = spawn('next', ['dev', '--turbopack', '-p', '3000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_API_URL: `http://localhost:${API_PORT}` },
});

console.log('[btg-mock] Abra http://localhost:3000/btg-poc (membro) ou http://localhost:3000/btgadmin-poc (admin)');

const stop = () => {
  api.close();
  next.kill('SIGTERM');
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
next.on('exit', (code) => {
  api.close();
  process.exit(code ?? 0);
});
