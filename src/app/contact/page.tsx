 "use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubmitState("error");
        setMessage(result.error ?? "Unable to send your message right now.");
        return;
      }

      form.reset();
      setSubmitState("success");
      setMessage("Thanks, your enquiry has been sent. I will get back to you soon.");
    } catch {
      setSubmitState("error");
      setMessage("Unable to send your message right now. Please try again shortly.");
    }
  }

  return (
    <main className="invert-panel px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="display-title">CONTACT</h1>
        <p className="mt-4 max-w-2xl text-sm text-black/80">
          Available for selected freelance and long-term projects. Share a brief and I will get back to you.
        </p>

        <form className="mt-8 grid gap-4 md:max-w-3xl" onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <label className="grid gap-2 text-xs tracking-[0.18em] text-black/75">
            NAME
            <input
              type="text"
              name="name"
              required
              className="border border-black/35 bg-white px-3 py-2 text-sm tracking-normal text-black outline-none focus:border-black"
            />
          </label>

          <label className="grid gap-2 text-xs tracking-[0.18em] text-black/75">
            EMAIL
            <input
              type="email"
              name="email"
              required
              className="border border-black/35 bg-white px-3 py-2 text-sm tracking-normal text-black outline-none focus:border-black"
            />
          </label>

          <label className="grid gap-2 text-xs tracking-[0.18em] text-black/75">
            SUBJECT
            <input
              type="text"
              name="subject"
              required
              className="border border-black/35 bg-white px-3 py-2 text-sm tracking-normal text-black outline-none focus:border-black"
            />
          </label>

          <label className="grid gap-2 text-xs tracking-[0.18em] text-black/75">
            MESSAGE
            <textarea
              name="message"
              required
              rows={6}
              className="border border-black/35 bg-white px-3 py-2 text-sm leading-relaxed tracking-normal text-black outline-none focus:border-black"
            />
          </label>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="inline-flex min-w-[10rem] items-center justify-center border border-black px-4 py-2 text-xs tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white"
            >
              {submitState === "submitting" ? "SENDING..." : "SEND ENQUIRY"}
            </button>
            {message ? <p className="text-xs tracking-normal text-black/80">{message}</p> : null}
          </div>
        </form>
      </div>
    </main>
  );
}
