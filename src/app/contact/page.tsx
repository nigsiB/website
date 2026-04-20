export default function ContactPage() {
  return (
    <main className="invert-panel px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="display-title">CONTACT</h1>
        <p className="mt-4 max-w-2xl text-sm text-black/80">
          Available for selected freelance and long-term projects. Share a brief and I will get back to you.
        </p>

        <form className="mt-8 grid gap-4 md:max-w-3xl" action="mailto:nigelburt@gmail.com" method="post" encType="text/plain">
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
              className="inline-flex min-w-[10rem] items-center justify-center border border-black px-4 py-2 text-xs tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white"
            >
              SEND ENQUIRY
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
