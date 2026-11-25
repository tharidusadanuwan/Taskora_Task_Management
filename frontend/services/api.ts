const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api"
).replace(/\/+$/, "");

// ==========================================
// API ERROR CLASS
// ==========================================

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ==========================================
// REQUEST TYPES
// ==========================================

interface RequestConfig {
  params?: object;
}

interface HttpResponse<T> {
  data: T;
}

// ==========================================
// BASE REQUEST
// ==========================================

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  const url = new URL(
    `${BASE_URL}/${endpoint.replace(/^\/+/, "")}`
  );

  // Query parameters
  if (config?.params) {
    Object.entries(config.params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          url.searchParams.set(key, String(value));
        }
      }
    );
  }

  // Request timeout
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(url.toString(), {
      method,

      headers: {
        Accept: "application/json",

        ...(body !== undefined && {
          "Content-Type": "application/json",
        }),
      },

      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,

      signal: controller.signal,

      cache: "no-store",
    });

    const result = await response
      .json()
      .catch(() => null);

    // Handle unsuccessful responses
    if (!response.ok) {
      throw new ApiError(
        result?.message ||
          `Request failed with status ${response.status}`,
        response.status,
        result?.errors
      );
    }

    if (result === null && response.status !== 204) {
      throw new ApiError(
        "Invalid response from the server.",
        response.status
      );
    }

    return {
      data: result as T,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new ApiError(
        "Request timed out. Please try again.",
        408
      );
    }

    throw new ApiError(
      "Unable to connect to the server. Please try again.",
      0
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ==========================================
// HTTP CLIENT
// ==========================================

const api = {
  get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return request<T>(
      "GET",
      endpoint,
      undefined,
      config
    );
  },

  post<T>(
    endpoint: string,
    data?: unknown
  ): Promise<HttpResponse<T>> {
    return request<T>("POST", endpoint, data);
  },

  put<T>(
    endpoint: string,
    data?: unknown
  ): Promise<HttpResponse<T>> {
    return request<T>("PUT", endpoint, data);
  },

  patch<T>(
    endpoint: string,
    data?: unknown
  ): Promise<HttpResponse<T>> {
    return request<T>("PATCH", endpoint, data);
  },

  delete<T = unknown>(
    endpoint: string
  ): Promise<HttpResponse<T>> {
    return request<T>("DELETE", endpoint);
  },
};

export default api;