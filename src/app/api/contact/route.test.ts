import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
};

function contactRequest(payload: Record<string, unknown>): Request {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY;
  process.env.CONTACT_TO_EMAIL = originalEnv.CONTACT_TO_EMAIL;
  process.env.CONTACT_FROM_EMAIL = originalEnv.CONTACT_FROM_EMAIL;
});

test("sends legitimate submissions that include a company value", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.CONTACT_TO_EMAIL = "to@example.com";
  process.env.CONTACT_FROM_EMAIL = "Website <from@example.com>";

  const sentBodies: string[] = [];
  globalThis.fetch = async (_input, init) => {
    sentBodies.push(String(init?.body ?? ""));
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  };

  const response = await POST(
    contactRequest({
      name: "A Client",
      email: "client@example.com",
      company: "Client Company",
      subject: "Project enquiry",
      message: "Please contact me.",
    })
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(sentBodies.length, 1);

  const emailPayload = JSON.parse(sentBodies[0]) as { text?: string };
  assert.match(emailPayload.text ?? "", /Company: Client Company/);
});

test("silently accepts submissions that fill the renamed honeypot", async () => {
  process.env.RESEND_API_KEY = "test-key";

  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  };

  const response = await POST(
    contactRequest({
      name: "Spam Bot",
      email: "bot@example.com",
      subject: "Spam",
      message: "Spam message",
      _contact_hp: "filled by bot",
    })
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(fetchCalls, 0);
});
