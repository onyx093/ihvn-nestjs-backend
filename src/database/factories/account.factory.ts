import { slugify } from '../../lib/helpers';
import { Account } from '../../users/entities/account.entity';
import { setSeederFactory } from 'typeorm-extension';

export const AccountFactory = setSeederFactory(
  Account,
  (fakerEN, context: Partial<Account> = {}) => {
    const account = new Account({});
    account.firstTimeLogin = context.firstTimeLogin || true;
    account.isAccountGenerated = context.isAccountGenerated || true;
    return account;
  }
);
