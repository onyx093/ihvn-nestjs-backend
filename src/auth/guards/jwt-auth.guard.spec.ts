import { JWTAuthGuard } from './jwt-auth.guard';

describe('JWTAuthGuard', () => {
  it('should be defined', () => {
    expect(new JWTAuthGuard()).toBeDefined();
  });
});
