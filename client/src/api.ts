const envUrl = import.meta.env.VITE_API_URL;
// Workaround: If user wrongly sets API_URL to frontend port (5173), force backend (5000)
export const API = (envUrl && envUrl.includes("5173")) ? "http://localhost:5000" : (envUrl || "http://localhost:5000");

export async function api<T>(path: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: any): Promise<T> {
  const token = localStorage.getItem("token");

  const fullUrl = API + path;
  console.log(`[API REQUEST] ${method} ${fullUrl}`, body ? body : "");

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: body ? JSON.stringify(body) : null
    });
  } catch (error) {
    console.error(`[API NETWORK ERROR] ${method} ${path}`, error);
    throw {
      status: 0,
      message: "Network Error: Failed to reach server",
      data: null
    };
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.error(`[API ERROR] ${method} ${path} ${res.status}`, data);
    throw {
      status: res.status,
      message: data?.message || "Request failed",
      data
    };
  }

  console.log(`[API RESPONSE] ${method} ${path} ${res.status}`, data);
  return data as T;
}
