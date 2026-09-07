import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBalance, claimBonus } from "../api/account";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      setLoading(true);
      const data = await getBalance();
      setBalance(data.balance);
    } catch (error) {
      toast.error("Failed to load balance");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimBonus() {
    try {
      setClaiming(true);
      const data = await claimBonus();
      toast.success(`Bonus claimed! +₹${data.amount}`);
      fetchBalance(); // balance refresh karo bonus claim hone ke baad
    } catch (error) {
      const message = error.response?.data?.message || "Failed to claim bonus";
      toast.error(message);
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Welcome, {user?.name}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <p className="text-slate-500 text-sm mb-1">Current Balance</p>
        {loading ? (
          <p className="text-3xl font-bold text-slate-400">Loading...</p>
        ) : (
          <p className="text-3xl font-bold text-slate-900">₹{balance}</p>
        )}

        <button
          onClick={handleClaimBonus}
          disabled={claiming}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {claiming ? "Claiming..." : "Claim Bonus"}
        </button>
      </div>
    </div>
  );
}