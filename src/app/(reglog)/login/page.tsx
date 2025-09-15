"use client";

import LoginClient from "@/page_components/LoginClient";
import WithSuspense from "@/page_components/WithSuspense";

// ensures this page is client-rendered

export default function LoginPage() {
  return (
    <WithSuspense>
      <LoginClient />
    </WithSuspense>
  );
}
