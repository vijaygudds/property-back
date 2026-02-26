import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppModule } from '../app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Staff } from 'src/model/Master/Staff';

@Module({
  imports: [
    SequelizeModule.forFeature([Staff]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret:
          configService.get<string>('JWT_SECRET') +
          configService.get<string>('DB_HOST') +
          configService.get<string>('DB_NAME'),
        signOptions: { expiresIn: '60d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => AppModule),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
