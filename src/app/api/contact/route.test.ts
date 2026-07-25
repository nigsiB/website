import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { POST } from "./route";

const ENV_KEYS = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] as const;
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;

  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function configureContactEnv() {
  process.env.RESEND_API_KEY = "test-api-key";
  process.env.CONTACT_TO_EMAIL = "owner@example.com";
  process.env.CONTACT_FROM_EMAIL = "Website <site@example.com>";
}

function contactRequest(overrides: Record<string, string> = {}) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Jane Sender",
      email: "jane@example.com",
      subject: "Project enquiry",
      message: "Can we talk about a new project?",
      ...overrides,
    }),
  });
}

function mockResend(status = 200) {
  const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];

  globalThis.fetch = (async (input, init) => {
    calls.push({ input, init });
    return new Response(JSON.stringify({ id: "email_123" }), { status });
  }) as typeof fetch;

  return calls;
}

test("sends enquiries when browser autofill supplies a company value", async () => {
  configureContactEnv();
  const calls = mockResend();

  const response = await POST(contactRequest({ company: "Acme Studio" }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(calls.length, 1);

  const requestBody = JSON.parse(String(calls[0].init?.body));
  assert.equal(requestBody.reply_to, "jane@example.com");
  assert.match(requestBody.text, /Company: Acme Studio/);
  assert.match(requestBody.text, /Message:\nCan we talk about a new project\?/);
});

test("silently accepts bot submissions that fill the dedicated honeypot", async () => {
  configureContactEnv();
  const calls = mockResend();

  const response = await POST(contactRequest({ _contact_hp: "spam" }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(calls.length, 0);
});
