export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError("Request body must be a JSON object.", 400);
  }
  return value as Record<string, unknown>;
}

export function requiredString(
  object: Record<string, unknown>,
  key: string,
  maxLength: number,
): string {
  const value = object[key];
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw new ApiError(`Invalid ${key}.`, 400);
  }
  return value.trim();
}

export function validSessionToken(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(value)) {
    throw new ApiError("Invalid sessionId.", 400);
  }
  return value;
}

export function safeErrorResponse(error: unknown): { message: string; status: number } {
  if (error instanceof ApiError) return { message: error.message, status: error.status };
  console.error(error);
  return { message: "Unexpected server error.", status: 500 };
}
