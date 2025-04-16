// src/utils/logger.ts
export const logger = {
    info: (message: string, ...optionalParams: any[]): void =>
      console.log(`ℹ️ [INFO]: ${message}`, ...optionalParams),
    warn: (message: string, ...optionalParams: any[]): void =>
      console.warn(`⚠️ [WARN]: ${message}`, ...optionalParams),
    error: (message: string, ...optionalParams: any[]): void =>
      console.error(`❌ [ERROR]: ${message}`, ...optionalParams),
  };
  