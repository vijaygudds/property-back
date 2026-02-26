import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Client } from 'src/model/Master/Client';
import { Staff } from 'src/model/Master/Staff';
import { Subscription } from 'src/model/Master/Subscription';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database.master'),
        models: [Client, Staff, Subscription],
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
