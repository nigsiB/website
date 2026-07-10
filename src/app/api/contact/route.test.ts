import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { POST } from "./route";

const originalEnv = process.env;
const originalFetch = global.fetch;

function contactRequest(payload: Record<string, unknown>) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => {
  process.env = {
    ...originalEnv,
    RESEND_API_KEY: "test-api-key",
    CONTACT_TO_EMAIL: "owner@example.com",
    CONTACT_FROM_EMAIL: "Website Contact <sender@example.com>",
  };
});

afterEach(() => {
  process.env = originalEnv;
  global.fetch = originalFetch;
});

test("sends legitimate contact submissions with a company value", async () => {
  const fetchCalls: Parameters<typeof fetch>[] = [];
  global.fetch = (async (...args: Parameters<typeof fetch>) => {
    fetchCalls.push(args);
    return new Response("{}", { status: 200 });
  }) as typeof fetch;

  const response = await POST(
    contactRequest({
      name: "Jane Sender",
      email: "jane@example.com",
      subject: "Project brief",
      message: "I would like to discuss a new project.",
      company: "Acme Studio",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(fetchCalls.length, 1);

  const [, init] = fetchCalls[0];
  assert.equal(init?.method, "POST");
  const body = JSON.parse(String(init?.body)) as { text: string };
  assert.match(body.text, /Company: Acme Studio/);
  assert.match(body.text, /Message:\nI would like to discuss a new project\./);
});

test("silently accepts renamed honeypot submissions without sending email", async () => {
  let fetchCalled = false;
  global.fetch = (async () => {
    fetchCalled = true;
    return new Response("{}", { status: 200 });
  }) as typeof fetch;

  const response = await POST(
    contactRequest({
      name: "Spam Bot",
      email: "bot@example.com",
      subject: "Guaranteed leads",
      message: "Buy my list.",
      _contact_hp: "filled",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(fetchCalled, false);
});
