export const logger = {
  error: (message: string, meta?: object) => console.error(message, meta),
  warn: (message: string, meta?: object) => console.warn(message, meta),
  info: (message: string, meta?: object) => console.info(message, meta),
  debug: (message: string, meta?: object) => console.debug(message, meta)
}