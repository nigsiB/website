import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { POST } from "./route";

const ORIGINAL_ENV = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
};

function jsonRequest(payload: unknown): Request {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.CONTACT_TO_EMAIL = "to@example.com";
    process.env.CONTACT_FROM_EMAIL = "Website <from@example.com>";
  });

  afterEach(() => {
    mock.restoreAll();

    for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it("sends legitimate enquiries when a company value is present", async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () => new Response("{}", { status: 200 }));

    const response = await POST(
      jsonRequest({
        name: "Ada Lovelace",
        email: "ada@example.com",
        company: "Analytical Engines Ltd",
        subject: "Project enquiry",
        message: "Can we discuss a new project?",
      }),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await readJson(response), { ok: true });
    assert.equal(fetchMock.mock.callCount(), 1);

    const [url, init] = fetchMock.mock.calls[0].arguments as [string, RequestInit];
    assert.equal(url, "https://api.resend.com/emails");

    const emailPayload = JSON.parse(String(init.body)) as { text: string };
    assert.match(emailPayload.text, /Name: Ada Lovelace/);
    assert.match(emailPayload.text, /Email: ada@example\.com/);
    assert.match(emailPayload.text, /Company: Analytical Engines Ltd/);
    assert.match(emailPayload.text, /Subject: Project enquiry/);
    assert.match(emailPayload.text, /Message:\nCan we discuss a new project\?/);
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () => new Response("{}", { status: 200 }));

    const response = await POST(
      jsonRequest({
        name: "Bot",
        email: "bot@example.com",
        _contact_hp: "spam",
        subject: "Spam",
        message: "This should not send.",
      }),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await readJson(response), { ok: true });
    assert.equal(fetchMock.mock.callCount(), 0);
  });
});
