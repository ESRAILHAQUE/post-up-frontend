"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { createPaymentIntent } from "@/app/actions/add-funds"
import { Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface AddFundsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess: () => void
}

function AddFundsForm({ userId, onSuccess, onClose }: { userId: string; onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [amount, setAmount] = useState("50")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "An error occurred")
        setIsProcessing(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/billing`,
        },
        redirect: "if_required",
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setIsProcessing(false)
      } else {
        // Payment successful
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount to Add</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
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
        <p className="text-xs text-muted-foreground">Minimum: $10, Maximum: $10,000</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[50, 100, 250, 500].map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAmount(preset.toString())}
            className="hover:bg-primary/10 hover:text-primary hover:border-primary"
          >
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
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing} className="flex-1 bg-primary hover:bg-primary/90">
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
  )
}

export function AddFundsModal({ open, onOpenChange, userId, onSuccess }: AddFundsModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState("50")

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen && !clientSecret) {
      // Create payment intent when modal opens
      try {
        const { clientSecret: secret } = await createPaymentIntent(Number.parseFloat(amount), userId)
        setClientSecret(secret!)
      } catch (error) {
        console.error("[v0] Error creating payment intent:", error)
      }
    } else if (!newOpen) {
      // Reset when modal closes
      setClientSecret(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Your Account</DialogTitle>
          <DialogDescription>Add funds to your account balance to use for future purchases</DialogDescription>
        </DialogHeader>

        {clientSecret ? (
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
            }}
          >
            <AddFundsForm userId={userId} onSuccess={onSuccess} onClose={() => onOpenChange(false)} />
          </Elements>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
