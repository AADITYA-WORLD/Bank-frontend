import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { lookupUserByEmail } from "../api/user";
import { transferMoney } from "../api/transfer";

export default function Transfer() {
  const [recipient, setRecipient] = useState(null); // dhoonda hua user
  const [searching, setSearching] = useState(false);
  const [step, setStep] = useState("search"); // "search" -> "confirm" -> "done"

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const amount = watch("amount");

  async function handleSearch(data) {
    try {
      setSearching(true);
      const user = await lookupUserByEmail(data.email);
      setRecipient(user);
    } catch (error) {
      const message = error.response?.data?.message || "User not found";
      toast.error(message);
      setRecipient(null);
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirmTransfer(data) {
    try {
      const idempotencyKey = crypto.randomUUID(); // unique key har transfer attempt ke liye
      await transferMoney({
        toUserId: recipient.id,
        amount: Number(data.amount),
        idempotencyKey,
      });
      toast.success("Transfer successful!");
      setStep("done");
    } catch (error) {
      const message = error.response?.data?.message || "Transfer failed";
      toast.error(message);
    }
  }

  function resetForm() {
    setRecipient(null);
    setStep("search");
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md h-fit">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Send Money</h1>

        {step === "done" && (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">Transfer completed successfully!</p>
            <button
              onClick={resetForm}
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              Send Another
            </button>
          </div>
        )}

        {!recipient && step === "search" && (
          <form onSubmit={handleSubmit(handleSearch)}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recipient's Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-slate-300 rounded px-3 py-2 mb-1"
              placeholder="friend@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
            )}

            <button
              type="submit"
              disabled={searching}
              className="w-full bg-slate-900 text-white py-2 rounded mt-3 disabled:opacity-50"
            >
              {searching ? "Searching..." : "Find Recipient"}
            </button>
          </form>
        )}

        {recipient && step === "search" && (
          <form onSubmit={handleSubmit(handleConfirmTransfer)}>
            <div className="bg-slate-50 rounded p-3 mb-4">
              <p className="text-sm text-slate-500">Sending to</p>
              <p className="font-medium text-slate-900">{recipient.name}</p>
              <p className="text-sm text-slate-500">{recipient.email}</p>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-blue-600 underline mt-1"
              >
                Change recipient
              </button>
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              className="w-full border border-slate-300 rounded px-3 py-2 mb-1"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mb-3">{errors.amount.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded mt-3 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : `Send ₹${amount || 0}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}