import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Values = { name: string; email: string; phone: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Tell us your name";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email";
  if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a valid phone number, with country code";
  return e;
}

const EntryForm = () => {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const update = (k: keyof Values) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValues((s) => ({ ...s, [k]: ev.target.value }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("submitting");
    const source = new URLSearchParams(window.location.search).get("src") ?? "direct";
    const { error } = await supabase.from("stoketober_entries").insert({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      source,
    });
    setStatus(error ? "error" : "done");
  };

  if (status === "done") {
    return (
      <div className="text-center" role="status" aria-live="polite">
        <p className="graffiti text-5xl sm:text-6xl leading-none">You&rsquo;re in!</p>
        <p className="poster-heading mt-4 text-xl sm:text-2xl">
          Entry received, {values.name.trim().split(" ")[0]}.
        </p>
        <p className="mt-4 text-base font-bold text-[hsl(var(--ink))]/80">
          Keep an eye on your inbox and phone. If your name comes out of the hat, that is how we&rsquo;ll reach you.
        </p>
        <a
          href="https://madmonkeyhostels.com"
          target="_blank"
          rel="noreferrer"
          className="btn-poster mt-8"
        >
          Explore Mad Monkey
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="sr-only">Name</label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          className="field"
          value={values.name}
          onChange={update("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-err" : undefined}
        />
        {errors.name && <p id="name-err" className="mt-1 pl-2 text-sm font-bold text-[hsl(var(--destructive))]">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          className="field"
          value={values.email}
          onChange={update("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-err" : undefined}
        />
        {errors.email && <p id="email-err" className="mt-1 pl-2 text-sm font-bold text-[hsl(var(--destructive))]">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="sr-only">Phone number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone number (with country code)"
          className="field"
          value={values.phone}
          onChange={update("phone")}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-err" : undefined}
        />
        {errors.phone && <p id="phone-err" className="mt-1 pl-2 text-sm font-bold text-[hsl(var(--destructive))]">{errors.phone}</p>}
      </div>

      <button type="submit" className="btn-poster mt-2" disabled={status === "submitting"}>
        {status === "submitting" ? "Entering..." : "Enter the giveaway"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-center text-sm font-bold text-[hsl(var(--destructive))]">
          Something went wrong sending your entry. Please try again.
        </p>
      )}

      <p className="pt-1 text-center text-xs font-semibold text-[hsl(var(--ink))]/65">
        We only use your details to run this giveaway and contact the winner.
      </p>
    </form>
  );
};

export default EntryForm;
