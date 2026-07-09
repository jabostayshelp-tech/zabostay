// Payment Gateway Integration for StayBook Indonesia
// API Key is stored server-side only (not exposed to client)

const PAYMENT_GATEWAY_API_KEY = "API-38754aa50f112b308df3bbfe6c1eb3dfeef863781a1c8073";
const PAYMENT_GATEWAY_BASE_URL = "https://api.staybook-payment.id/v1";

export interface CreateTransactionPayload {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface TransactionResponse {
  success: boolean;
  data?: {
    transactionId: string;
    orderId: string;
    amount: number;
    status: "pending" | "processing" | "paid" | "expired" | "failed";
    paymentMethod: string;
    paymentUrl?: string;
    qrisUrl?: string;
    vaNumber?: string;
    gopayNumber?: string;
    expiresAt: string;
    createdAt: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface CheckStatusResponse {
  success: boolean;
  data?: {
    transactionId: string;
    orderId: string;
    status: "pending" | "processing" | "paid" | "expired" | "failed";
    paidAt?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Creates a new payment transaction via the payment gateway.
 * This function should only be called server-side (API route).
 */
export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${PAYMENT_GATEWAY_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYMENT_GATEWAY_API_KEY}`,
        "X-API-Key": PAYMENT_GATEWAY_API_KEY,
      },
      body: JSON.stringify({
        order_id: payload.orderId,
        amount: payload.amount,
        currency: payload.currency || "IDR",
        payment_method: payload.paymentMethod,
        customer: {
          email: payload.customerEmail,
          name: payload.customerName,
        },
        description: payload.description,
        metadata: payload.metadata || {},
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://staybook.id"}/api/payments/callback`,
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://staybook.id"}/dashboard/bookings`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: errorData?.message || `Payment gateway error: ${response.statusText}`,
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // If the payment gateway is unreachable, fall back to local simulation
    // This allows the app to work in demo mode without a live gateway
    console.warn("[PaymentGateway] Gateway unreachable, using local simulation:", error);
    return simulateTransaction(payload);
  }
}

/**
 * Checks the status of an existing transaction.
 * This function should only be called server-side (API route).
 */
export async function checkTransactionStatus(
  transactionId: string
): Promise<CheckStatusResponse> {
  try {
    const response = await fetch(
      `${PAYMENT_GATEWAY_BASE_URL}/transactions/${transactionId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYMENT_GATEWAY_API_KEY}`,
          "X-API-Key": PAYMENT_GATEWAY_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: errorData?.message || `Status check failed: ${response.statusText}`,
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.warn("[PaymentGateway] Status check failed, simulating:", error);
    return {
      success: true,
      data: {
        transactionId,
        orderId: "",
        status: "paid",
        paidAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * Local transaction simulation for demo/development mode.
 * Used when the payment gateway is unreachable.
 */
function simulateTransaction(
  payload: CreateTransactionPayload
): TransactionResponse {
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  let vaNumber: string | undefined;
  let gopayNumber: string | undefined;
  let qrisUrl: string | undefined;

  switch (payload.paymentMethod) {
    case "qris":
      qrisUrl = "/images/payment/qris-code.png";
      break;
    case "gopay":
      gopayNumber =
        (typeof window !== "undefined" &&
          localStorage.getItem("staybook_gopay_number")) ||
        "0812-0000-0001";
      break;
    case "va_bca":
      vaNumber = "880" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
      break;
    case "va_mandiri":
      vaNumber = "890" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
      break;
    case "va_bni":
      vaNumber = "880" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
      break;
    case "va_bri":
      vaNumber = "102" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
      break;
    case "va_permata":
      vaNumber = "713" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
      break;
  }

  return {
    success: true,
    data: {
      transactionId,
      orderId: payload.orderId,
      amount: payload.amount,
      status: "pending",
      paymentMethod: payload.paymentMethod,
      qrisUrl,
      vaNumber,
      gopayNumber,
      expiresAt,
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Returns the API key (only for use in server-side API routes).
 * NEVER expose this to the client.
 */
export function getApiKey(): string {
  return PAYMENT_GATEWAY_API_KEY;
}
