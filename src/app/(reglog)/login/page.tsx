"use client";
import LoginClient from "@/page_components/LoginClient";
import { Suspense } from "react";

// ensures this page is client-rendered

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginClient />
    </Suspense>
  );
}
