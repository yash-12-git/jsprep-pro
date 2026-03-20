/** @jsxImportSource @emotion/react */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { css } from "@emotion/react";
import SprintClient from "./SprintClient";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";

const bg = css`
  min-height: 100vh;
  background: ${C.bg};
`;

export default function SprintWrapper() {
  const { user, progress, loading } = useAuth();
  const router = useRouter();


  if (loading) {
    return (
      <div
        css={bg}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div css={Shared.spinner}>
          <div css={Shared.spinnerDot} />
        </div>
      </div>
    );
  }

  return (
    <div css={bg}>
      <SprintClient uid={user?.uid} isPro={progress?.isPro} />
    </div>
  );
}
