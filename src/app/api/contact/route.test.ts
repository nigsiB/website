import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalEnv = {
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

function restoreEnv(name: keyof typeof originalEnv) {
  const value = originalEnv[name];
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function contactRequest(payload: Record<string, unknown>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  restoreEnv("CONTACT_FROM_EMAIL");
  restoreEnv("CONTACT_TO_EMAIL");
  restoreEnv("RESEND_API_KEY");
});

test("sends legitimate submissions that include a company value", async () => {
  process.env.RESEND_API_KEY = "test_resend_key";
  process.env.CONTACT_FROM_EMAIL = "Website <from@example.com>";
  process.env.CONTACT_TO_EMAIL = "owner@example.com";

  let resendBody: unknown;
  globalThis.fetch = (async (_input, init) => {
    resendBody = JSON.parse(String(init?.body));
    return new Response("{}", { status: 200 });
  }) as typeof fetch;

  const response = await POST(
    contactRequest({
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines Ltd",
      subject: "Project enquiry",
      message: "Can we discuss a launch?",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(resendBody, {
    from: "Website <from@example.com>",
    to: ["owner@example.com"],
    reply_to: "ada@example.com",
    subject: "Website enquiry: Project enquiry",
    text: [
      "Name: Ada Lovelace",
      "Email: ada@example.com",
      "Company: Analytical Engines Ltd",
      "Subject: Project enquiry",
      "",
      "Message:",
      "Can we discuss a launch?",
    ].join("\n"),
  });
});

test("silently accepts honeypot submissions without sending email", async () => {
  process.env.RESEND_API_KEY = "test_resend_key";

  let fetchCalled = false;
  globalThis.fetch = (async () => {
    fetchCalled = true;
    return new Response("{}", { status: 200 });
  }) as typeof fetch;

  const response = await POST(
    contactRequest({
      _contact_hp: "bot-filled",
      name: "Spam Bot",
      email: "spam@example.com",
      subject: "Spam",
      message: "Spam message",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(fetchCalled, false);
});
