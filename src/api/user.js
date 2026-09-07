import api from "./axios";

export async function lookupUserByEmail(email) {
  const res = await api.get(`/api/users/lookup?email=${encodeURIComponent(email)}`);
  return res.data;
}