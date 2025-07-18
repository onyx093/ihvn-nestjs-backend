import { Ability } from '@casl/ability';
import { CaslAbilityFactory } from './casl-ability.factory';

describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory;

  beforeEach(() => {
    factory = new CaslAbilityFactory();
  });

  it('should generate an Ability with proper rules without duplicates', () => {
    const user = {
      roles: [
        {
          permissions: [
            { name: 'read_articles', subject: 'Article' },
            { name: 'read_articles', subject: 'Article' }, // duplicate
            { name: 'create_articles', subject: 'Article' },
          ],
        },
        {
          permissions: [
            { name: 'delete_articles', subject: 'Article' },
            { name: 'create_articles', subject: 'Article' }, // duplicate from another role
          ],
        },
      ],
    } as any;

    const ability = factory.createForUser(user);
    expect(ability).toBeInstanceOf(Ability);

    // Check that rules length equals 3 unique rules.
    const rules = (ability as any).rules;
    expect(rules).toHaveLength(3);
    expect(rules).toEqual(
      expect.arrayContaining([
        { action: 'read_articles', subject: 'Article' },
        { action: 'create_articles', subject: 'Article' },
        { action: 'delete_articles', subject: 'Article' },
      ])
    );
  });
});
