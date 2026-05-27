/**
 * MyFatoorah Hosted Payment Service (Mock)
 *
 * In production this will call:
 *   POST /api/payments/myfatoorah/create   → server creates invoice via MyFatoorah API
 *   GET  /api/payments/myfatoorah/status    → server verifies payment via GetPaymentStatus
 *   POST /api/payments/myfatoorah/webhook   → server handles async payment updates
 *
 * Currently uses a local mock flow that redirects to a sample hosted page.
 */

import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentVerificationResult,
  PaymentInvoiceStatus,
} from '@/types/payment';

const PENDING_PAYMENT_KEY = 'mayar_pending_payment';

// ── Mock: Create hosted payment session ──
// Future: POST /api/payments/myfatoorah/create

export const createMyFatoorahPayment = async (
  request: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  // Simulate server latency
  await new Promise(r => setTimeout(r, 800));

  const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`;

  // Store pending payment data for the mock flow
  const pendingData = {
    invoiceId,
    orderId: request.orderId,
    orderNumber: request.orderNumber,
    amount: request.amount,
    currency: request.currency,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    callbackUrl: request.callbackUrl,
    errorUrl: request.errorUrl,
    createdAt: new Date().toISOString(),
  };
  sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pendingData));

  // In production the server returns a real MyFatoorah PaymentURL.
  // Here we redirect to our own mock hosted-payment page.
  const paymentUrl = `/payment/hosted?invoiceId=${invoiceId}&amount=${request.amount}&currency=${request.currency}`;

  return { paymentUrl, invoiceId, invoiceValue: request.amount };
};

// ── Mock: Verify payment status ──
// Future: GET /api/payments/myfatoorah/status?paymentId=...

export const verifyMyFatoorahPayment = async (
  paymentId: string
): Promise<PaymentVerificationResult> => {
  await new Promise(r => setTimeout(r, 600));

  const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
  const pending = raw ? JSON.parse(raw) : {};

  // The mock hosted page stores the chosen result in the URL
  const url = new URL(window.location.href);
  const status = (url.searchParams.get('status') || 'PAID') as PaymentInvoiceStatus;

  return {
    paymentId,
    invoiceStatus: status,
    transactionStatus: status === 'PAID' ? 'SUCCESS' : status === 'PENDING' ? 'INPROGRESS' : 'FAILED',
    orderId: pending.orderId || '',
    orderNumber: pending.orderNumber || '',
    invoiceId: pending.invoiceId || '',
    paidAmount: pending.amount || 0,
    paidCurrency: pending.currency || 'KWD',
  };
};

// ── Helpers ──

export const getPendingPayment = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearPendingPayment = () => {
  sessionStorage.removeItem(PENDING_PAYMENT_KEY);
};
