export const API = import.meta.env.VITE_API_URL;

export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: body ? JSON.stringify(body) : null
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || "Request failed",
      data
    };
  }

  return data;
}
