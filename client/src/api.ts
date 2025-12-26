const API = import.meta.env.VITE_API_URL;

if (!API) {
  throw new Error("VITE_API_URL is not defined. Check Render environment variables.");
}

export async function api<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const token = localStorage.getItem("token");

  const baseUrl = API.endsWith("/") ? API.slice(0, -1) : API;
  const fullUrl = baseUrl + path;
  console.log(`[API REQUEST] ${method} ${fullUrl}`, body ?? "");

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    console.error(`[API NETWORK ERROR] ${method} ${path}`, error);
    throw {
      status: 0,
      message: "Network Error: Failed to reach server",
      data: null
    };
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`[API ERROR] ${method} ${path} ${res.status}`, data);
    throw {
      status: res.status,
      message: data?.message || "Request failed",
      data
    };
  }

  return data as T;
}
