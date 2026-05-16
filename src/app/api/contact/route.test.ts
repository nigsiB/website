import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { POST } from "./route";

type ResendPayload = {
  reply_to?: string;
  text?: string;
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;
});

describe("POST /api/contact", () => {
  it("sends valid enquiries even when autofill-like extra fields are present", async () => {
    process.env.RESEND_API_KEY = "test-key";

    let sentBody: ResendPayload | undefined;
    globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
      sentBody = JSON.parse(String(init?.body)) as ResendPayload;
      return new Response(JSON.stringify({ id: "sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@example.com",
          subject: "New project",
          message: "Can we talk about a website?",
          company: "Analytical Engines Ltd",
        }),
      })
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(sentBody?.reply_to, "ada@example.com");
    assert.match(sentBody?.text ?? "", /Ada Lovelace/);
    assert.match(sentBody?.text ?? "", /Can we talk about a website\?/);
  });
});
