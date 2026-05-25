import { isAxiosError } from "axios";

export type ApiError = {
  code: string;
  message: string;
  status?: number;
};

export function mapApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    if (!error.response) {
      return {
        code: "network_error",
        message: "Network request failed",
      };
    }

    const status = error.response.status;
    const messageFromBody =
      typeof error.response.data?.message === "string"
        ? error.response.data.message
        : undefined;

    return {
      code: "api_error",
      message: messageFromBody ?? error.message,
      status,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unknown_error",
      message: error.message,
    };
  }

  return {
    code: "unknown_error",
    message: "Unexpected error",
  };
}
