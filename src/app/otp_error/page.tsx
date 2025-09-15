"use client";

import OtpErrorInnerComp from "@/page_components/OtpErrorInnerComp";
import WithSuspense from "@/page_components/WithSuspense";

// ensures this page is client-rendered

export default function OtpErrorPage() {
  return (
    <WithSuspense>
      <OtpErrorInnerComp />
    </WithSuspense>
  );
}
