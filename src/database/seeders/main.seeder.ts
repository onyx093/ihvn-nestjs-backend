import { UserSetting } from '@/users/entities/user-setting.entity';
import { User } from '@/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    // const userSettingsRepository = dataSource.getRepository(UserSetting);
    const commentsRepository = dataSource.getRepository(Comment);

    const userFactory = factoryManager.get(User);
    const userSettingsFactory = factoryManager.get(UserSetting);
    const commentsFactory = factoryManager.get(Comment);

    const userSettings = await userSettingsFactory.saveMany(4);

    await userRepository.insert([
      {
        name: 'Caleb Barrows',
        email: 'caleb.barrows@gmail.com',
        password: await hash('password1'),
        userSetting: faker.helpers.arrayElement(userSettings),
      },
    ]);
    // const users = await userFactory.saveMany(2);
    await userFactory.saveMany(2);

    const comments = await Promise.all(
      Array(5)
        .fill('')
        .map(async () => {
          const made = await commentsFactory.make({
            // user: faker.helpers.arrayElement(users),
          });
          return made;
        }),
    );

    await commentsRepository.save(comments);
  }
}
