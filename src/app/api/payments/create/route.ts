import { NextRequest, NextResponse } from "next/server";
import { createTransaction, CreateTransactionPayload } from "@/lib/payment-gateway";

/**
 * POST /api/payments/create
 * Creates a new payment transaction through the payment gateway.
 *
 * Request body:
 * {
 *   orderId: string,
 *   amount: number,
 *   paymentMethod: string,
 *   customerEmail: string,
 *   customerName: string,
 *   propertyName: string,
 *   voucherCode?: string,
 *   discount?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orderId,
      amount,
      paymentMethod,
      customerEmail,
      customerName,
      propertyName,
      voucherCode,
      discount,
    } = body;

    // Validate required fields
    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "orderId, amount, dan paymentMethod wajib diisi." },
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_AMOUNT", message: "Jumlah pembayaran harus lebih dari 0." },
        },
        { status: 400 }
      );
    }

    const payload: CreateTransactionPayload = {
      orderId,
      amount,
      currency: "IDR",
      paymentMethod,
      customerEmail: customerEmail || "guest@staybook.id",
      customerName: customerName || "Guest",
      description: `Pembayaran booking ${propertyName || "StayBook"} - ${orderId}`,
      metadata: {
        ...(voucherCode ? { voucher_code: voucherCode } : {}),
        ...(discount ? { discount_amount: discount.toString() } : {}),
      },
    };

    const result = await createTransaction(payload);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API /payments/create] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan internal server." },
      },
      { status: 500 }
    );
  }
}
