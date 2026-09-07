import api from "./axios";

export async function getBalance() {
  const res = await api.get("/api/account/balance");
  return res.data;
}

export async function claimBonus() {
  const res = await api.post("/api/account/claim-bonus");
  return res.data;
}

export async function getTransactionHistory(page = 1, limit = 10) {
  const res = await api.get(`/api/account/transactions?page=${page}&limit=${limit}`);
  return res.data;
}