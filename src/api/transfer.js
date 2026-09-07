import api from "./axios";

export async function transferMoney({ toUserId, amount, idempotencyKey }) {
  const res = await api.post("/api/transfer/transfer-money", { toUserId, amount, idempotencyKey });
  return res.data;
}