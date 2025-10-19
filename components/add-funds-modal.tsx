"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  confirmAddFundsPayment,
} from "@/app/actions/add-funds";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess: () => void;
}

function AddFundsForm({
  userId,
  onSuccess,
  onClose,
}: {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("50");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/dashboard/billing`,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on backend and update balance
        try {
          const result = await confirmAddFundsPayment(paymentIntent.id);

          // Show success message
          await Swal.fire({
            icon: "success",
            title: "Funds Added Successfully!",
            html: `
              <p>Your payment has been processed.</p>
              <p><strong>Amount Added:</strong> $${result.amount.toFixed(2)}</p>
              <p><strong>New Balance:</strong> $${result.newBalance.toFixed(
                2
              )}</p>
              <p class="text-sm text-gray-600 mt-2">A confirmation email has been sent to your email address.</p>
            `,
            confirmButtonText: "Great!",
            confirmButtonColor: "#10b981",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          // Close modal and call success callback
          setTimeout(() => {
            onClose();
            onSuccess();
          }, 100);
        } catch (confirmErr) {
          console.error("Error confirming payment:", confirmErr);
          setError(
            "Payment successful but failed to update balance. Please contact support."
          );
          setIsProcessing(false);
        }
      } else {
        setError("Payment was not completed");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount to Add</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="amount"
            type="number"
            min="10"
            max="10000"
            step="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Minimum: $10, Maximum: $10,000
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[50, 100, 250, 500].map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAmount(preset.toString())}
            className="hover:bg-primary/10 hover:text-primary hover:border-primary">
            ${preset}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <PaymentElement />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-primary hover:bg-primary/90">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Add $${amount}`
          )}
        </Button>
      </div>
    </form>
  );
}

export function AddFundsModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: AddFundsModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState("50");
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      // Reset state when opening
      setClientSecret(null);
      setIsCreatingIntent(false);
    } else {
      // Reset when modal closes
      setClientSecret(null);
      setIsCreatingIntent(false);
      setAmount("50"); // Reset amount to default
    }
    onOpenChange(newOpen);
  };

  const handleCreatePaymentIntent = async (selectedAmount: number) => {
    setIsCreatingIntent(true);
    try {
      const { clientSecret: secret } = await createPaymentIntent(
        selectedAmount,
        userId
      );
      setClientSecret(secret!);
    } catch (error) {
      console.error("[v0] Error creating payment intent:", error);
      alert("Failed to create payment intent. Please try again.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Funds to Your Account</DialogTitle>
          <DialogDescription>
            Add funds to your account balance to use for future purchases
          </DialogDescription>
        </DialogHeader>

        {clientSecret ? (
          <div className="space-y-4">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#10b981",
                  },
                },
              }}>
              <AddFundsForm
                userId={userId}
                onSuccess={onSuccess}
                onClose={() => onOpenChange(false)}
              />
            </Elements>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount to Add
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  id="amount"
                  type="number"
                  min="10"
                  max="10000"
                  step="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-input rounded-md"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: $10, Maximum: $10,000
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 250, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className="px-3 py-2 text-sm border border-input rounded-md hover:bg-muted">
                  ${preset}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isCreatingIntent}
                className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-muted">
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCreatePaymentIntent(Number.parseFloat(amount))
                }
                disabled={
                  isCreatingIntent || !amount || Number.parseFloat(amount) < 10
                }
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
                {isCreatingIntent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Creating...
                  </>
                ) : (
                  `Add $${amount}`
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
