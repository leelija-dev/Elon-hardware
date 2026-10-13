"use client";

import { useActionState } from "react";
import type { FormState } from "../actions";

export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  className = "",
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="sticky bottom-0 mt-6 flex items-center gap-4 border-t border-line bg-white/95 py-4 backdrop-blur">
        <button type="submit" disabled={pending} className="btn-rect-dark min-w-[160px] justify-center">
          {pending ? "Saving…" : submitLabel}
        </button>
        {state?.error && (
          <p role="alert" className="text-[14px] font-bold text-[#b42318]">
            {state.error}
          </p>
        )}
        {state?.ok && !pending && (
          <p role="status" className="text-[14px] font-bold text-[#1a7f37]">
            {state.ok}
          </p>
        )}
      </div>
    </form>
  );
}

export function ConfirmButton({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
