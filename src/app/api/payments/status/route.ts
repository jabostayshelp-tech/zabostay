import { NextRequest, NextResponse } from "next/server";
import { checkTransactionStatus } from "@/lib/payment-gateway";

/**
 * GET /api/payments/status?transactionId=TXN-xxxxx
 * Checks the status of a payment transaction.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "transactionId wajib diisi." },
        },
        { status: 400 }
      );
    }

    const result = await checkTransactionStatus(transactionId);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /payments/status] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan internal server." },
      },
      { status: 500 }
    );
  }
}
