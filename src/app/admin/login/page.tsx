import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Logo } from "@/components/Icon";
import { adminEnabled, isAdmin } from "@/lib/auth";
import { loginAction } from "../actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink p-5">
      <div className="w-full max-w-[400px] rounded-[6px] bg-white p-8">
        <Image
          src="/images/logo/logo.png"
          alt="ELON HARDWARE logo"
          width={448}
          height={250}
          priority
          className="h-20 w-auto"
        />
        <h1 className="mt-8 font-serif text-[28px]">Admin panel</h1>
        {adminEnabled() ? (
          <LoginForm action={loginAction} />
        ) : (
          <p className="mt-4 text-[15px] leading-[1.7] text-muted">
            The admin panel is disabled. Set <code className="rounded bg-mist px-1.5 py-0.5 text-ink">ADMIN_PASSWORD</code> in your
            <code className="rounded bg-mist px-1.5 py-0.5 text-ink">.env</code> file and restart the server.
          </p>
        )}
      </div>
    </main>
  );
}
