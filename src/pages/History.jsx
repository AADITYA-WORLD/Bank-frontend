import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getTransactionHistory } from "../api/account";
import { useAuth } from "../context/AuthContext";

export default function History() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  async function fetchHistory() {
    try {
      setLoading(true);
      const data = await getTransactionHistory(page, 10);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h1>

      <div className="bg-white rounded-lg shadow-md max-w-2xl">
        {loading ? (
          <p className="p-6 text-slate-400">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="p-6 text-slate-400">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((txn) => {
              const isDebit = txn.direction === "debit";

              return (
                <li key={txn._id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isDebit ? "bg-red-100" : "bg-green-100"}`}>
                      {isDebit ? (
                        <ArrowUpRight className="text-red-600" size={18} />
                      ) : (
                        <ArrowDownLeft className="text-green-600" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {isDebit ? "Sent to" : "Received from"} {txn.otherParty.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(txn.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${isDebit ? "text-red-600" : "text-green-600"}`}>
                    {isDebit ? "-" : "+"}₹{txn.amount}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-slate-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm px-3 py-1 border rounded disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm px-3 py-1 border rounded disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}