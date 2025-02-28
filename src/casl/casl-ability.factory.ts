import { User } from '../users/entities/user.entity';
import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';

export type AppAbility = Ability<[string, string]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const rules = [];

    const seen = new Set<string>();
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        // Create a unique key for deduplication
        const key = `${permission.name}-${permission.subject}`;
        if (!seen.has(key)) {
          seen.add(key);
          rules.push({
            action: permission.name,
            subject: permission.subject,
          });
        }
      }
    }
    return new Ability(rules);
  }
}
