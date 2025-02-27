import { Subject, SUBJECT_METADATA } from './subject.decorator';

describe('Subject Decorator', () => {
  it('should attach metadata to the class', () => {
    @Subject('TestSubject')
    class TestClass {}

    const metadata = Reflect.getMetadata(SUBJECT_METADATA, TestClass);
    expect(metadata).toBe('TestSubject');
  });
});
