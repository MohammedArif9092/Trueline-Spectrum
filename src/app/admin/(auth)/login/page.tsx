import { Suspense } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { SITE } from "@/lib/constants";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 inline-flex">
            <Image src={SITE.logo} alt={SITE.name} width={2000} height={853} className="h-12 w-auto [filter:brightness(0)_invert(1)]" priority />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Editorial CMS</h1>
          <p className="mt-1 text-sm text-white/60">Sign in to manage {SITE.name}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Authorized administrators only. All activity is logged.
        </p>
      </div>
    </div>
  );
}
