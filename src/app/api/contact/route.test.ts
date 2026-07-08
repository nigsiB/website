import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { POST } from "./route";

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function contactRequest(payload: Record<string, unknown>): Request {
  return new Request("https://nigsib.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

const validPayload = {
  name: "Alex Designer",
  email: "alex@example.com",
  subject: "Project enquiry",
  message: "I would like to discuss a new project.",
};

beforeEach(() => {
  process.env = {
    ...originalEnv,
    RESEND_API_KEY: "test-api-key",
    CONTACT_TO_EMAIL: "hello@example.com",
    CONTACT_FROM_EMAIL: "Website Contact <contact@example.com>",
  };
});

afterEach(() => {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
});

test("sends contact email when browser autofills a company value", async () => {
  let resendBody: Record<string, unknown> | undefined;
  globalThis.fetch = async (_input, init) => {
    resendBody = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  };

  const response = await POST(contactRequest({ ...validPayload, company: "Studio Co." }));

  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.ok(resendBody);
  assert.match(String(resendBody.text), /Company: Studio Co\./);
});

test("silently accepts submissions only when the dedicated honeypot is filled", async () => {
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  };

  const response = await POST(contactRequest({ ...validPayload, _contact_hp: "bot-value" }));

  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(fetchCalled, false);
});
