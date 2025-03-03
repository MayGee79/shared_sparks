import { describe, it, expect } from 'vitest'
import { authOptions } from '@/lib/auth/handlers'

describe('Auth Configuration', () => {
  it('should have required providers configured', () => {
    expect(authOptions.providers).toHaveLength(3)
    expect(authOptions.providers[0].name).toBe('Credentials')
    expect(authOptions.providers[1].id).toBe('github')
    expect(authOptions.providers[2].id).toBe('google')
  })

  it('should have correct session strategy', () => {
    expect(authOptions.session?.strategy).toBe('jwt')
  })
})