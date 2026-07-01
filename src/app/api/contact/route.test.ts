import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalResendApiKey = process.env.RESEND_API_KEY;
const originalToEmail = process.env.CONTACT_TO_EMAIL;
const originalFromEmail = process.env.CONTACT_FROM_EMAIL;

function requestWithJson(payload: object): Request {
  return new Request("https://nigsib.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-api-key";
  process.env.CONTACT_TO_EMAIL = "hello@example.com";
  process.env.CONTACT_FROM_EMAIL = "Website Contact <contact@example.com>";
});

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalResendApiKey === undefined) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = originalResendApiKey;
  }

  if (originalToEmail === undefined) {
    delete process.env.CONTACT_TO_EMAIL;
  } else {
    process.env.CONTACT_TO_EMAIL = originalToEmail;
  }

  if (originalFromEmail === undefined) {
    delete process.env.CONTACT_FROM_EMAIL;
  } else {
    process.env.CONTACT_FROM_EMAIL = originalFromEmail;
  }
});

test("sends enquiries even when browsers autofill a company field", async () => {
  let resendPayload: { text?: string } | undefined;

  globalThis.fetch = async (_input, init) => {
    resendPayload = JSON.parse(String(init?.body));
    return new Response("{}", { status: 200 });
  };

  const response = await POST(
    requestWithJson({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Project enquiry",
      message: "Please contact me.",
      company: "Analytical Engines Ltd",
      _contact_hp: "",
    })
  );

  assert.equal(response.status, 200);
  assert.ok(resendPayload);
  assert.match(resendPayload.text ?? "", /Name: Ada Lovelace/);
  assert.match(resendPayload.text ?? "", /Message:\nPlease contact me\./);
});

test("silently accepts submissions when the honeypot field is filled", async () => {
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response("{}", { status: 200 });
  };

  const response = await POST(
    requestWithJson({
      name: "Spam Bot",
      email: "spam@example.com",
      subject: "Ignored",
      message: "This should not be sent.",
      _contact_hp: "bot-filled value",
    })
  );

  assert.equal(response.status, 200);
  assert.equal(fetchCalled, false);
  assert.deepEqual(await response.json(), { ok: true });
});
