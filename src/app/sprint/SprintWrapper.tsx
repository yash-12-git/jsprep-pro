/** @jsxImportSource @emotion/react */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { css } from "@emotion/react";
import SprintClient from "./SprintClient";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import { Question } from "@/types/question";

const bg = css`
  min-height: 100vh;
  background: ${C.bg};
`;

export interface SprintWrapperProps {
  allQuestions?: {
    theory: Question[];
    output: Question[];
    debug: Question[];
  }
}

export default function SprintWrapper({ allQuestions }: SprintWrapperProps) {
  const { user, progress, loading } = useAuth();


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
      <SprintClient uid={user?.uid} isPro={progress?.isPro} allQuestions={allQuestions} />
    </div>
  );
}
