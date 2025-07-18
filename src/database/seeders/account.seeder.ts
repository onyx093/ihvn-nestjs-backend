import { Account } from '../../users/entities/account.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class AccountSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const accountEntity = new Account({
      firstTimeLogin: true,
      isAccountGenerated: true,
    });
    const accountRepository = dataSource.getRepository(Account);
    await accountRepository.save(accountEntity);
  }
}
