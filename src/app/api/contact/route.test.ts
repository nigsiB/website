import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { POST } from "./route";

const originalFetch = global.fetch;

function jsonRequest(payload: Record<string, unknown>) {
  return new Request("https://nigsib.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function setRequiredEnv() {
  process.env.RESEND_API_KEY = "test-resend-key";
  process.env.CONTACT_TO_EMAIL = "recipient@example.com";
  process.env.CONTACT_FROM_EMAIL = "Website Contact <sender@example.com>";
}

afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
});

describe("POST /api/contact", () => {
  it("silently accepts honeypot submissions without sending email", async () => {
    setRequiredEnv();
    let fetchCalled = false;
    global.fetch = (async () => {
      fetchCalled = true;
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const response = await POST(
      jsonRequest({
        name: "Bot",
        email: "bot@example.com",
        subject: "Spam",
        message: "Spam message",
        _contact_hp: "filled",
      })
    );

    assert.equal(response.status, 200);
    assert.equal(fetchCalled, false);
  });

  it("does not treat legitimate company data as the honeypot", async () => {
    setRequiredEnv();
    const fetchCalls: RequestInit[] = [];
    global.fetch = (async (_input, init) => {
      fetchCalls.push(init ?? {});
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const response = await POST(
      jsonRequest({
        name: "Jane Client",
        email: "jane@example.com",
        company: "Acme Studio",
        subject: "Project enquiry",
        message: "Can we discuss a brand refresh?",
      })
    );

    assert.equal(response.status, 200);
    assert.equal(fetchCalls.length, 1);

    const emailPayload = JSON.parse(String(fetchCalls[0].body)) as { text: string };
    assert.match(emailPayload.text, /Company: Acme Studio/);
    assert.match(emailPayload.text, /Message:\nCan we discuss a brand refresh\?/);
  });
});
