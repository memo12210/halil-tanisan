import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import bcrypt from 'bcryptjs';

const ENV_URL = new URL('../.env', import.meta.url);

export function buildEnvContents({ passwordHash, sessionSecret }) {
  return [
    'ADMIN_USER=admin',
    `ADMIN_PASSWORD_HASH=${passwordHash}`,
    `SESSION_SECRET=${sessionSecret}`,
    '',
  ].join('\n');
}

function openssl(args) {
  return execFileSync('openssl', args).toString().trim();
}

async function main() {
  if (existsSync(ENV_URL)) {
    const rl = createInterface({ input, output });
    const answer = await rl.question('.env already exists. Overwrite credentials? (y/N) ');
    rl.close();
    if (answer.trim().toLowerCase() !== 'y') {
      console.log('Aborted. No changes made.');
      return;
    }
  }

  const password = openssl(['rand', '-base64', '24']);
  const sessionSecret = openssl(['rand', '-hex', '32']);
  const passwordHash = bcrypt.hashSync(password, 12);

  writeFileSync(ENV_URL, buildEnvContents({ passwordHash, sessionSecret }), { mode: 0o600 });

  console.log('\n  Admin credentials generated and written to .env\n');
  console.log('  Username: admin');
  console.log(`  Password: ${password}`);
  console.log('\n  Save this password now — it will NOT be shown again.\n');
}

// Only run when executed directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
