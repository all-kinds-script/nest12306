import { JwtGlobalGuard } from './jwt.global.guard'

describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new JwtGlobalGuard()).toBeDefined()
  })
})
