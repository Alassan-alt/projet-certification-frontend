// src/api/helpers.ts
export const authHeader = (token: string | null, json = false) =>
  token
    ? json
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { Authorization: `Bearer ${token}` }
    : json
    ? { "Content-Type": "application/json" }
    : {};
