"use client";

import { Suspense } from "react";

interface WithSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function WithSuspense({
  children,
  fallback = <p className="text-center mt-8">Loading...</p>,
}: WithSuspenseProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
