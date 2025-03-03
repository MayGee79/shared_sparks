const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  error: (message: string, meta?: object) => {
    console.error('[ERROR]', message, meta ? JSON.stringify(meta, null, 2) : '')
  },
  warn: (message: string, meta?: object) => {
    console.warn('[WARN]', message, meta ? JSON.stringify(meta, null, 2) : '')
  },
  info: (message: string, meta?: object) => {
    if (isDev) console.info('[INFO]', message, meta ? JSON.stringify(meta, null, 2) : '')
  },
  debug: (message: string, meta?: object) => {
    if (isDev) console.debug('[DEBUG]', message, meta ? JSON.stringify(meta, null, 2) : '')
  },
  auth: (message: string, meta?: object) => {
    if (isDev) console.log('[AUTH]', message, meta ? JSON.stringify(meta, null, 2) : '')
  }
}