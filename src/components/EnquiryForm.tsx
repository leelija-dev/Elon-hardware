"use client";

import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { site } from "@/config/site";
import { DEMO_SLOTS, ENQUIRY_TYPES, type EnquiryType } from "@/lib/enquiry-schema";
import { Icon } from "./Icon";

type ProductOption = { slug: string; name: string; category: string };
type CategoryOption = { slug: string; name: string; range: string };

type Props = {
  products: ProductOption[];
  categories?: CategoryOption[];
  defaultInterest?: string;
  defaultType?: EnquiryType;
  defaultProduct?: string;
  /** full = enquiry/contact page, dark = compact on dark panels, product = on a product page */
  variant?: "full" | "dark" | "product";
  showTypeTabs?: boolean;
  submitLabel?: string;
};

type Status = { state: "idle" } | { state: "sending" } | { state: "done"; id: string } | { state: "error"; message: string };

export function EnquiryForm({
  products,
  categories = [],
  defaultInterest,
  defaultType = "demo",
  defaultProduct,
  variant = "full",
  showTypeTabs = variant === "full",
  submitLabel,
}: Props) {
  const uid = useId();
  const pathname = usePathname();
  const [type, setType] = useState<EnquiryType>(defaultType);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dark = variant === "dark";
  const fieldCls = dark ? "field-dark" : "field";
  const labelCls = `flex flex-col gap-1.5 text-sm font-medium ${dark ? "text-fog" : "text-text"}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      pincode: String(fd.get("pincode") ?? ""),
      ...splitInterest(String(fd.get("interest") ?? ""), defaultProduct, defaultInterest),
      slot: type === "demo" ? (fd.get("slot") as string) || undefined : undefined,
      message: String(fd.get("message") ?? ""),
      whatsapp: fd.get("whatsapp") === "on",
      company: String(fd.get("company") ?? ""),
      page: pathname,
    };
    setStatus({ state: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; id?: string; error?: string; fieldErrors?: Record<string, string> };
      if (data.ok && data.id) {
        setStatus({ state: "done", id: data.id });
      } else {
        setErrors(data.fieldErrors ?? {});
        setStatus({ state: "error", message: data.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ state: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (status.state === "done") {
    return (
      <div
        role="status"
        className={`flex flex-col items-start gap-4 rounded-[4px] p-8 ${dark ? "bg-ink-2 text-white" : "border border-line bg-white"}`}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-gold text-ink">
          <Icon name="check" size={28} strokeWidth={2.6} />
        </span>
        <h3 className="m-0 font-serif text-[28px] font-normal">Thank you — we&rsquo;ve received your enquiry.</h3>
        <p className={`m-0 ${dark ? "text-fog" : "text-muted"}`}>
          Your reference number is <strong className={dark ? "text-white" : "text-text"}>{status.id}</strong>. Our
          team will call you within {site.responseTime}
          {type === "demo" ? " to confirm your demo slot" : ""}.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className={dark ? "btn-rect-gold" : "btn-rect-outline"}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <span id={`${uid}-${k}-err`} className={`text-[13px] font-medium ${dark ? "text-[#f3a6a6]" : "text-[#b42318]"}`}>
        {errors[k]}
      </span>
    ) : null;
  const aria = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${uid}-${k}-err` } : {});

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {showTypeTabs && (
        <div role="radiogroup" aria-label="Enquiry type" className="flex flex-wrap gap-1 self-start rounded-full bg-mist-2 p-1">
          {(Object.keys(ENQUIRY_TYPES) as EnquiryType[]).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              onClick={() => setType(t)}
              className={`min-h-11 rounded-full px-5 text-sm font-bold transition-colors ${type === t ? "bg-ink text-white" : "text-text hover:bg-white"}`}
            >
              {t === "demo" ? "Book a demo" : t === "quote" ? "Get a quote" : t === "service" ? "Service request" : "General query"}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          Full name *
          <input name="name" autoComplete="name" required placeholder="Your name" className={fieldCls} {...aria("name")} />
          {err("name")}
        </label>
        <label className={labelCls}>
          Mobile number *
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+91"
            className={fieldCls}
            {...aria("phone")}
          />
          {err("phone")}
        </label>
        {variant !== "dark" && (
          <label className={labelCls}>
            Email
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={fieldCls} {...aria("email")} />
            {err("email")}
          </label>
        )}
        <label className={labelCls}>
          City *
          <input name="city" autoComplete="address-level2" required placeholder="e.g. Kolkata" className={fieldCls} {...aria("city")} />
          {err("city")}
        </label>
        {variant !== "dark" && (
          <label className={labelCls}>
            Pin code
            <input
              name="pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="700001"
              className={fieldCls}
              {...aria("pincode")}
            />
            {err("pincode")}
          </label>
        )}
        {variant !== "product" && (
          <label className={labelCls}>
            Interested in
            <select
              name="interest"
              defaultValue={defaultProduct ? `product:${defaultProduct}` : defaultInterest ? `cat:${defaultInterest}` : ""}
              className={fieldCls}
            >
              <option value="">Not sure yet — advise me</option>
              {categories.length > 0 && (
                <optgroup label="Product ranges">
                  {categories.map((c) => (
                    <option key={c.slug} value={`cat:${c.slug}`}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {groupByCategory(products).map(([cat, items]) => (
                <optgroup key={cat} label={`${cat} — models`}>
                  {items.map((p) => (
                    <option key={p.slug} value={`product:${p.slug}`}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        )}
      </div>

      {type === "demo" && variant !== "dark" && (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2.5 p-0 text-sm font-medium">Preferred demo slot</legend>
          <div className="flex flex-wrap gap-2.5">
            {(Object.entries(DEMO_SLOTS) as [keyof typeof DEMO_SLOTS, string][]).map(([k, label], i) => (
              <label
                key={k}
                className="flex min-h-12 cursor-pointer items-center gap-2 rounded-[3px] border border-line-2 bg-white px-4 text-sm has-[:checked]:border-ink has-[:checked]:bg-mist"
              >
                <input type="radio" name="slot" value={k} defaultChecked={i === 0} className="accent-ink" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {variant !== "dark" && (
        <label className={labelCls}>
          {type === "service" ? "Describe the issue *" : "Anything we should know?"}
          <textarea
            name="message"
            rows={variant === "product" ? 3 : 4}
            maxLength={1500}
            placeholder={
              type === "service"
                ? "Model, what's happening, when it started…"
                : type === "demo"
                  ? "Where you'd like to place the locker, what you'll store, etc."
                  : "Product, quantity, location and timeline — anything that helps us advise you."
            }
            className={`${fieldCls} resize-y py-3`}
            {...aria("message")}
          />
          {err("message")}
        </label>
      )}

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {variant !== "dark" && (
        <label className="flex items-start gap-2.5 text-sm text-muted">
          <input type="checkbox" name="whatsapp" defaultChecked className="mt-0.5 size-[18px] accent-ink" />
          Send me updates on WhatsApp about my enquiry.
        </label>
      )}

      {status.state === "error" && (
        <p role="alert" className={`m-0 rounded-[3px] px-4 py-3 text-sm font-medium ${dark ? "bg-[#3a1d1d] text-[#f7c1c1]" : "bg-[#fdecea] text-[#8a1c12]"}`}>
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.state === "sending"}
        className={`${dark ? "btn-rect-gold" : "btn-rect-dark"} min-h-[54px] w-full justify-center text-[15px]`}
      >
        {status.state === "sending"
          ? "Sending…"
          : (submitLabel ??
            (type === "demo"
              ? "Book My Free Demo"
              : type === "quote"
                ? "Request a Quote"
                : type === "service"
                  ? "Submit Service Request"
                  : "Submit Query"))}
      </button>
      {variant !== "dark" && (
        <p className="m-0 text-center text-[13px] text-muted">
          We&rsquo;ll only use your details to respond to this enquiry.
        </p>
      )}
    </form>
  );
}

function splitInterest(v: string, defaultProduct?: string, defaultInterest?: string) {
  if (v.startsWith("product:")) return { product: v.slice(8), interest: "" };
  if (v.startsWith("cat:")) return { product: "", interest: v.slice(4) };
  return { product: defaultProduct ?? "", interest: defaultInterest ?? "" };
}

function groupByCategory(products: ProductOption[]) {
  const map = new Map<string, ProductOption[]>();
  for (const p of products) map.set(p.category, [...(map.get(p.category) ?? []), p]);
  return [...map.entries()];
}
