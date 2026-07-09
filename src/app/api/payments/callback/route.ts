import { NextRequest, NextResponse } from "next/server";
import { getApiKey } from "@/lib/payment-gateway";

/**
 * POST /api/payments/callback
 * Webhook endpoint for the payment gateway to notify payment status changes.
 *
 * The gateway will send:
 * {
 *   transaction_id: string,
 *   order_id: string,
 *   status: "paid" | "expired" | "failed",
 *   amount: number,
 *   paid_at?: string,
 *   signature: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { transaction_id, order_id, status, amount, signature } = body;

    // Verify the callback signature
    // In production, this should validate HMAC or signature from the gateway
    const apiKey = getApiKey();
    const expectedSignature = generateSignature(transaction_id, order_id, amount, apiKey);

    if (signature && signature !== expectedSignature) {
      console.warn("[Callback] Invalid signature for transaction:", transaction_id);
      return NextResponse.json(
        { success: false, error: { code: "INVALID_SIGNATURE", message: "Signature verification failed." } },
        { status: 401 }
      );
    }

    // Process the payment status update
    console.log(`[Callback] Payment ${transaction_id} for order ${order_id}: ${status}`);

    switch (status) {
      case "paid":
        // TODO: In production, update database booking status to 'paid'
        // await updateBookingStatus(order_id, 'paid');
        // await sendConfirmationEmail(order_id);
        console.log(`[Callback] Order ${order_id} PAID - amount: ${amount}`);
        break;

      case "expired":
        // TODO: In production, update booking status to 'expired' and release room
        // await updateBookingStatus(order_id, 'expired');
        // await releaseRoom(order_id);
        console.log(`[Callback] Order ${order_id} EXPIRED`);
        break;

      case "failed":
        // TODO: In production, update booking status to 'failed'
        // await updateBookingStatus(order_id, 'failed');
        console.log(`[Callback] Order ${order_id} FAILED`);
        break;

      default:
        console.log(`[Callback] Order ${order_id} status: ${status}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("[API /payments/callback] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Callback processing failed." } },
      { status: 500 }
    );
  }
}

/**
 * Generate verification signature for callback validation.
 * In production, use HMAC-SHA256 or the gateway's specific signature algorithm.
 */
function generateSignature(
  transactionId: string,
  orderId: string,
  amount: number,
  apiKey: string
): string {
  // Simple hash for demo — replace with proper HMAC in production
  const data = `${transactionId}:${orderId}:${amount}:${apiKey}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
