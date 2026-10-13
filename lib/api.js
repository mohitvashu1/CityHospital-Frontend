
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export async function apiRequest(
  path,
  { method = "GET", body, token } = {}
) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}
