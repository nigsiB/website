import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { POST } from "./route";

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

function contactRequest(payload: Record<string, string>) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: "test-api-key",
      CONTACT_TO_EMAIL: "owner@example.com",
      CONTACT_FROM_EMAIL: "Website Contact <contact@example.com>",
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
  });

  it("sends legitimate messages even when a company value is present", async () => {
    let sentBody = "";
    global.fetch = async (_input, init) => {
      sentBody = String(init?.body ?? "");
      return new Response(null, { status: 202 });
    };

    const response = await POST(
      contactRequest({
        name: "Jane Sender",
        email: "jane@example.com",
        company: "Acme Ltd",
        subject: "Project enquiry",
        message: "Can we discuss a new project?",
      })
    );

    assert.equal(response.status, 200);
    assert.match(sentBody, /"reply_to":"jane@example.com"/);
    assert.match(sentBody, /Company: Acme Ltd/);
  });

  it("silently accepts submissions that fill the dedicated honeypot", async () => {
    let fetchCalled = false;
    global.fetch = async () => {
      fetchCalled = true;
      return new Response(null, { status: 202 });
    };

    const response = await POST(
      contactRequest({
        name: "Spam Bot",
        email: "spam@example.com",
        _contact_hp: "filled by bot",
        subject: "Hello",
        message: "Spam message",
      })
    );

    assert.equal(response.status, 200);
    assert.equal(fetchCalled, false);
  });
});
