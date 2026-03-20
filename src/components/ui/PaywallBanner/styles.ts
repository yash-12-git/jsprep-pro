import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const overlay = css`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(55, 53, 47, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

export const modal = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  position: relative;
  box-shadow:
    0 4px 6px rgba(55, 53, 47, 0.04),
    0 20px 40px rgba(55, 53, 47, 0.12);
`;

export const closeBtn = css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  padding: 0.25rem;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

export const iconBox = css`
  width: 3rem;
  height: 3rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

export const title = css`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

export const reasonText = css`
  color: ${C.accentText};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

export const desc = css`
  color: ${C.muted};
  font-size: 0.875rem;
  line-height: 1.65;
  margin-bottom: 1.5rem;
`;

export const featureList = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  list-style: none;
  padding: 0;
`;

export const featureItem = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${C.text};
  line-height: 1.5;
`;

export const upgradeBtn = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${C.accent};
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.875rem;
  border-radius: ${RADIUS.lg};
  border: none;
  cursor: pointer;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const legal = css`
  color: ${C.muted};
  font-size: 0.75rem;
  text-align: center;
  margin-top: 0.75rem;
  line-height: 1.5;
`;
