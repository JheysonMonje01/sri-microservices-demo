//src/common/utils/logger.util.ts
export const logError = (context: string, error: unknown): void => {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  console.error(`[${context}] ${message}`);
};
