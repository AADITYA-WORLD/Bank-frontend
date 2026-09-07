import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { lookupUserByEmail } from "../api/user";
import { systemTransfer } from "../api/admin";

export default function Admin() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      // Pehle email se User dhoondo
      const user = await lookupUserByEmail(data.email);

      // Fir System account se us user ko transfer karo
      await systemTransfer({ toUserId: user.id, amount: Number(data.amount) });

      toast.success(`₹${data.amount} sent to ${user.name}`);
      reset();
    } catch (error) {
      const message = error.response?.data?.message || "Transfer failed";
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md h-fit">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin - System Transfer</h1>
        <p className="text-sm text-slate-500 mb-6">
          Send money from the system reserve account to any user.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-slate-300 rounded px-3 py-2 mb-1"
            placeholder="user@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
          )}

          <label className="block text-sm font-medium text-slate-700 mb-1 mt-3">
            Amount (₹)
          </label>
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
            className="w-full bg-slate-900 text-white py-2 rounded mt-4 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
}