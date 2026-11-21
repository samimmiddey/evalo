// Ratio of total scheduled interview duration required as simultaneous co-presence for the session to be considered COMPLETED and settled (50%)
export const MINIMUM_PRESENCE_RATIO = 0.5;

// Ratio of total scheduled interview duration an interviewer must wait alone until slot end for candidate no-show compensation (85%)
export const HOST_WAIT_RATIO = 0.85;

// Maximum presence ratio allowed for a candidate to still be categorized as a no-show (5%)
export const CANDIDATE_NO_SHOW_MAX_RATIO = 0.05;

// 30 days in milliseconds for monthly billing cycle and credit renewal checks
export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
