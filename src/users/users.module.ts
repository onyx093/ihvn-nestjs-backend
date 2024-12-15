import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSetting } from './entities/user-setting.entity';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '../queues/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSetting]),
    BullModule.registerQueue({
      name: 'email',
    }),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
