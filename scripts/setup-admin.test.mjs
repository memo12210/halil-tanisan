import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEnvContents } from './setup-admin.mjs';

test('buildEnvContents emits the three required keys', () => {
  const out = buildEnvContents({ passwordHash: '$2b$12$abc', sessionSecret: 'deadbeef' });
  assert.match(out, /^ADMIN_USER=admin$/m);
  assert.match(out, /^ADMIN_PASSWORD_HASH=\$2b\$12\$abc$/m);
  assert.match(out, /^SESSION_SECRET=deadbeef$/m);
});

test('buildEnvContents ends with a trailing newline', () => {
  const out = buildEnvContents({ passwordHash: 'h', sessionSecret: 's' });
  assert.ok(out.endsWith('\n'));
});
