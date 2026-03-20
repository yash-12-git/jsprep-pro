/** @jsxImportSource @emotion/react */
"use client";

import * as Shared from "@/styles/shared";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { C } from "@/styles/tokens";

interface PageGuardProps {
  loading: boolean;
  ready: boolean;
  isPro?: boolean;
  proReason?: string;
  children: React.ReactNode;
}

/**
 * Handles the common pattern across Pro-gated pages:
 *   1. Show spinner while auth/data is loading
 *   2. Show PaywallBanner if not Pro (when proReason is provided)
 *   3. Otherwise render children
 *
 * Usage:
 *   <PageGuard loading={authLoading || !user || !progress} ready={!!progress}
 *              isPro={progress?.isPro} proReason="Analytics is a Pro feature.">
 *     <YourPageContent />
 *   </PageGuard>
 */
export default function PageGuard({
  loading,
  ready,
  isPro,
  proReason,
  children,
}: PageGuardProps) {
  if (loading || !ready) {
    return (
      <div css={Shared.spinner}>
        <div css={Shared.spinnerDot} />
      </div>
    );
  }
  if (proReason && !isPro) {
    return (
      <>
        <PaywallBanner reason={proReason} />
      </>
    );
  }
  return (
    <div
      style={{
        backgroundColor: C.bg,
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
