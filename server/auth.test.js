import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { verifyCredentials, isAuthenticated, COOKIE_NAME } from './auth.js';

const passwordHash = bcrypt.hashSync('correct horse', 12);
const config = { adminUser: 'admin', passwordHash };

test('verifyCredentials accepts the right username and password', async () => {
  assert.equal(await verifyCredentials('admin', 'correct horse', config), true);
});

test('verifyCredentials rejects a wrong password', async () => {
  assert.equal(await verifyCredentials('admin', 'nope', config), false);
});

test('verifyCredentials rejects a wrong username', async () => {
  assert.equal(await verifyCredentials('root', 'correct horse', config), false);
});

test('verifyCredentials rejects when config is missing', async () => {
  assert.equal(await verifyCredentials('admin', 'correct horse', { adminUser: '', passwordHash: '' }), false);
});

test('isAuthenticated is true only for the valid signed cookie value', () => {
  assert.equal(isAuthenticated({ signedCookies: { [COOKIE_NAME]: 'authenticated' } }), true);
  assert.equal(isAuthenticated({ signedCookies: { [COOKIE_NAME]: 'tampered' } }), false);
  assert.equal(isAuthenticated({ signedCookies: {} }), false);
  assert.equal(isAuthenticated({}), false);
});
