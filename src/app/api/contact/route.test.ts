import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function contactRequest(payload: Record<string, unknown>) {
  return new Request("https://nigsib.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

test("sends contact requests even when a browser autofills company", async () => {
  const resendCalls: unknown[] = [];
  process.env.RESEND_API_KEY = "test-api-key";
  globalThis.fetch = (async (_input, init) => {
    resendCalls.push(init);
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  }) as typeof fetch;

  const response = await POST(
    contactRequest({
      name: "Jane Sender",
      email: "jane@example.com",
      subject: "Project enquiry",
      message: "Can we talk about a new project?",
      company: "Example Ltd",
    })
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendCalls.length, 1);
});

test("silently accepts submissions that fill the private honeypot", async () => {
  let resendCalled = false;
  process.env.RESEND_API_KEY = "test-api-key";
  globalThis.fetch = (async () => {
    resendCalled = true;
    return new Response(null, { status: 200 });
  }) as typeof fetch;

  const response = await POST(
    contactRequest({
      name: "Spam Bot",
      email: "spam@example.com",
      subject: "Buy now",
      message: "Automated payload",
      _contact_hp: "bot-filled-value",
    })
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendCalled, false);
});
