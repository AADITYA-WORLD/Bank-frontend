import api from "./axios";

export async function systemTransfer({ toUserId, amount }) {
  const res = await api.post("/api/account/system-transfer", { toUserId, amount });
  return res.data;
}