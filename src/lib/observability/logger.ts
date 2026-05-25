import { redactPayload } from "@/lib/observability/redaction";

type LogMetadata = Record<string, unknown>;

function formatLog(message: string, metadata?: LogMetadata) {
  if (!metadata) {
    return message;
  }
  return `${message} ${JSON.stringify(redactPayload(metadata))}`;
}

export function logInfo(message: string, metadata?: LogMetadata) {
  console.info(formatLog(message, metadata));
}

export function logWarn(message: string, metadata?: LogMetadata) {
  console.warn(formatLog(message, metadata));
}

export function logError(message: string, metadata?: LogMetadata) {
  console.error(formatLog(message, metadata));
}
