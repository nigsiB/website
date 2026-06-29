import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { POST } from "./route";

const ORIGINAL_ENV = {
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
const ORIGINAL_FETCH = globalThis.fetch;

function restoreEnv(name: keyof typeof ORIGINAL_ENV) {
  const value = ORIGINAL_ENV[name];
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function contactRequest(payload: Record<string, unknown>) {
  return new Request("https://nigsib.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => {
  process.env.CONTACT_FROM_EMAIL = "Website Contact <website@example.com>";
  process.env.CONTACT_TO_EMAIL = "owner@example.com";
  process.env.RESEND_API_KEY = "test-resend-key";
});

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  restoreEnv("CONTACT_FROM_EMAIL");
  restoreEnv("CONTACT_TO_EMAIL");
  restoreEnv("RESEND_API_KEY");
});

test("does not treat an autofilled company value as the honeypot", async () => {
  const resendCalls: RequestInit[] = [];

  globalThis.fetch = async (input, init) => {
    assert.equal(input, "https://api.resend.com/emails");
    assert.ok(init);
    resendCalls.push(init);
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200 });
  };

  const response = await POST(
    contactRequest({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Project enquiry",
      message: "Can we discuss a new project?",
      company: "Analytical Engines Ltd",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendCalls.length, 1);

  const resendBody = JSON.parse(String(resendCalls[0].body));
  assert.equal(resendBody.reply_to, "ada@example.com");
  assert.equal(resendBody.subject, "Website enquiry: Project enquiry");
});

test("silently accepts submissions that fill the renamed honeypot", async () => {
  let fetchWasCalled = false;
  globalThis.fetch = async () => {
    fetchWasCalled = true;
    return new Response(null, { status: 500 });
  };

  const response = await POST(
    contactRequest({
      name: "Bot",
      email: "bot@example.com",
      subject: "Spam",
      message: "Spam message",
      _contact_hp: "filled by bot",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(fetchWasCalled, false);
});
