"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  type AuthActionState,
  signInWithEmail,
} from "@/features/auth/server/actions";

const initialState: AuthActionState = {};

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInWithEmail,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-stone-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ava.chen@example.com"
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          required
        />
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
        <p className="font-medium text-stone-900">Local development users</p>
        <p className="mt-2">Use `ava.chen@example.com` or `mateo.rivera@example.com` after running the seed command.</p>
      </div>
      <Link href="/" className="block text-center text-sm text-stone-600 transition hover:text-stone-950">
        Back to marketing site
      </Link>
    </form>
  );
}
