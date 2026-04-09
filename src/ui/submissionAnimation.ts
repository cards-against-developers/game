export const SUBMISSION_REVEAL_CLICK_PULSE_MS = 360;
export const SUBMISSION_REVEAL_FRESH_STATE_MS = 520;
export const SUBMISSION_REVEAL_CARD_FLASH_MS = 380;
export const SUBMISSION_REVEAL_SHELL_FLASH_MS = 420;
export const SUBMISSION_CARD_FACE_FADE_MS = 180;

export function submissionAnimationStyleVars(): Record<string, string> {
  return {
    "--submission-reveal-click-pulse-ms": `${SUBMISSION_REVEAL_CLICK_PULSE_MS}ms`,
    "--submission-reveal-fresh-state-ms": `${SUBMISSION_REVEAL_FRESH_STATE_MS}ms`,
    "--submission-reveal-card-flash-ms": `${SUBMISSION_REVEAL_CARD_FLASH_MS}ms`,
    "--submission-reveal-shell-flash-ms": `${SUBMISSION_REVEAL_SHELL_FLASH_MS}ms`,
    "--submission-card-face-fade-ms": `${SUBMISSION_CARD_FACE_FADE_MS}ms`
  };
}
