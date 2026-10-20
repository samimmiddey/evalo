// User
export const DB_USER = '/user';

// Onboarding
export const ONBOARDING_USER = '/onboarding';

// Interviewers
export const GET_INTERVIEWERS = '/interviewers/list';
export const BOOK_SESSION = '/interviewers/book-session';
export const GET_FEEDBACK = '/interviewers/feedback';

// Appointments
export const GET_APPOINTMENTS = '/appointments/list';
export const GET_APPOINTMENT_STATS = '/appointments/stats';
export const CANCEL_BOOKING = '/appointments/cancel-booking';
export const CLAIM_REFUND = '/appointments/claim-refund';
export const RETRY_BOOKING = '/appointments/retry-booking';
export const RATE_INTERVIEWER = '/appointments/rate-interviewer';

// Call
export const GENERATE_QUESTIONS = '/call/generate-questions';

// Dashboard
export const GET_DASHBOARD_STATS = '/dashboard';
export const GET_DASHBOARD_NEXT_SESSION = '/dashboard/next-session';

// Interviewer
export const GET_SESSIONS = '/sessions';
export const INTERVIEWER_AVAILABILITY = '/availability';
export const GET_PAYOUTS = '/payouts';
export const GET_PAYOUT_RECORDS = '/payouts/records';
export const GET_PAYOUT_TRANSACTIONS = '/payouts/transactions';
export const REQUEST_PAYOUT = '/payouts/request';
export const UPDATE_PROFILE = '/profile';

// Config
export const GET_PLATFORM_CONFIG = '/platform-config';

// Cashfree
export const GET_PLANS = '/cashfree/plans';
export const CREATE_SUBSCRIPTION = '/cashfree/create-subscription';
export const GET_SUBSCRIPTION = '/cashfree/subscription-details';

// Billing
export const GET_BILLING = '/billing';
export const GET_BILLING_TRANSACTIONS = '/billing/transactions';
export const GET_BILLING_PAYMENTS = '/billing/payments';
export const CANCEL_SUBSCRIPTION = '/billing/cancel';
export const GET_CASHFREE_BILLING_DATA = (id: string) => `/subscriptions/${id}/payments`;
export const CANCEL_CASHFREE_SUBSCRIPTION = (id: string) => `/subscriptions/${id}/manage`;