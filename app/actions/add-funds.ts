"use server";

/**
 * Payment actions
 * These functions call the backend API for payment processing
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function createPaymentIntent(amount: number, userId: string) {
  try {
    const response = await fetch(`${API_URL}/payments/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: userId, // Temporary - should be actual order ID
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const data = await response.json();
    return { clientSecret: data.data.clientSecret };
  } catch (error) {
    console.error("[v0] Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}

export async function createSetupIntent(userId: string) {
  try {
    // For now, return a placeholder
    // You can implement this in backend if needed for saving cards
    return { clientSecret: null };
  } catch (error) {
    console.error("[v0] Error creating setup intent:", error);
    throw new Error("Failed to create setup intent");
  }
}
