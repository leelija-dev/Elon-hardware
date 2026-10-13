"use client";

import { useActionState } from "react";
import type { FormState } from "../actions";

export function LoginForm({ action }: { action: (s: FormState, fd: FormData) => Promise<FormState> }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[14px] font-bold">
        Password
        <input name="password" type="password" required autoFocus autoComplete="current-password" className="field" />
      </label>
      {state?.error && (
        <p role="alert" className="text-[14px] font-bold text-[#b42318]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-rect-dark justify-center">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
