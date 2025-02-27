import { Permission, PERMISSION_METADATA } from './permission.decorator';

describe('Permission Decorator', () => {
  it('should attach metadata to the method', () => {
    class TestClass {
      @Permission('test_permission')
      testMethod() {}
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(
      PERMISSION_METADATA,
      instance.testMethod
    );
    expect(metadata).toBe('test_permission');
  });
});
