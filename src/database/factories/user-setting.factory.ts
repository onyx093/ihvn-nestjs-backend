import { UserSetting } from '../../users/entities/user-setting.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserSettingFactory = setSeederFactory(UserSetting, (faker) => {
  const userSetting = new UserSetting({
    theme: faker.helpers.arrayElement(['light', 'dark']),
    notificationsEnabled: faker.datatype.boolean({ probability: 0.5 }),
  });
  return userSetting;
});
