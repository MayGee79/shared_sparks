type LogLevel = 'error' | 'warn' | 'info' | 'debug'

const logger = {
  log: (level: LogLevel, message: string, meta?: unknown) => {
    const timestamp = new Date().toISOString()
    console[level](`[${timestamp}] ${message}`, meta)
  },
  error: (message: string, meta?: unknown) => logger.log('error', message, meta),
  warn: (message: string, meta?: unknown) => logger.log('warn', message, meta),
  info: (message: string, meta?: unknown) => logger.log('info', message, meta),
  debug: (message: string, meta?: unknown) => logger.log('debug', message, meta)
}

export default logger